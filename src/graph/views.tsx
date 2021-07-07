/********************************************************************************
 * Copyright (c) 2017-2018 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

/** @jsx svg */
import { inject, injectable } from 'inversify';
import { svg } from 'snabbdom-jsx';
import { VNode } from "snabbdom/vnode";
import { getSubType } from "../base/model/smodel-utils";
import { IView, RenderingContext } from "../base/views/view";
import { setAttr } from '../base/views/vnode-utils';
import { ShapeView } from '../features/bounds/views';
import { BY_X_THEN_Y, IntersectingRoutedPoint, Intersection, isIntersectingRoutedPoint } from '../features/edge-intersection/intersection-finder';
import { isEdgeLayoutable } from '../features/edge-layout/model';
import { SRoutingHandle, SRoutableElement } from '../features/routing/model';
import { EdgeRouterRegistry, RoutedPoint } from '../features/routing/routing';
import { RoutableView } from '../features/routing/views';
import { Point, PointToPointLine, shiftTowards } from '../utils/geometry';
import { SCompartment, SEdge, SGraph, SLabel } from "./sgraph";

/**
 * IView component that turns an SGraph element and its children into a tree of virtual DOM elements.
 */
@injectable()
export class SGraphView implements IView {

    @inject(EdgeRouterRegistry) edgeRouterRegistry: EdgeRouterRegistry;

    render(model: Readonly<SGraph>, context: RenderingContext, args?: object): VNode {
        const edgeRouting = this.edgeRouterRegistry.routeAllChildren(model);
        const transform = `scale(${model.zoom}) translate(${-model.scroll.x},${-model.scroll.y})`;
        return <svg class-sprotty-graph={true}>
            <g transform={transform}>
                {context.renderChildren(model, { ...args, edgeRouting })}
            </g>
        </svg>;
    }

}

@injectable()
export class PolylineEdgeView extends RoutableView {

    @inject(EdgeRouterRegistry) edgeRouterRegistry: EdgeRouterRegistry;

    render(edge: Readonly<SEdge>, context: RenderingContext, args?: object): VNode | undefined {
        const route = this.edgeRouterRegistry.route(edge, args);
        if (route.length === 0) {
            return this.renderDanglingEdge("Cannot compute route", edge, context);
        }
        if (!this.isVisible(edge, route, context)) {
            if (edge.children.length === 0) {
                return undefined;
            }
            // The children of an edge are not necessarily inside the bounding box of the route,
            // so we need to render a group to ensure the children have a chance to be rendered.
            return <g>{context.renderChildren(edge, { ...args, route })}</g>;
        }

        return <g class-sprotty-edge={true} class-mouseover={edge.hoverFeedback}>
            {this.renderLine(edge, route, context, args)}
            {this.renderAdditionals(edge, route, context)}
            {context.renderChildren(edge, { ...args, route })}
        </g>;
    }

    protected renderLine(edge: SEdge, segments: Point[], context: RenderingContext, args?: object): VNode {
        const firstPoint = segments[0];
        let path = `M ${firstPoint.x},${firstPoint.y}`;
        for (let i = 1; i < segments.length; i++) {
            const p = segments[i];
            path += ` L ${p.x},${p.y}`;
        }
        return <path d={path} />;
    }

    protected renderAdditionals(edge: SEdge, segments: Point[], context: RenderingContext): VNode[] {
        return [];
    }

    protected renderDanglingEdge(message: string, edge: SEdge, context: RenderingContext): VNode {
        return <text class-sprotty-edge-dangling={true} title={message}>?</text>;
    }
}

/**
 * A `PolylineEdgeView` that renders jumps over intersections.
 *
 * In order to find intersections, `IntersectionFinder` needs to be configured as a `TYPES.IEdgeRoutePostprocessor`
 * so that that intersections are declared as `IntersectingRoutedPoint` in the computed routes.
 *
 * @see IntersectionFinder
 * @see IntersectingRoutedPoint
 * @see EdgeRouterRegistry
 */
@injectable()
export class JumpingPolylineEdgeView extends PolylineEdgeView {

    protected jumpOffsetBefore = 5;
    protected jumpOffsetAfter = 5;
    protected skipOffsetBefore = 3;
    protected skipOffsetAfter = 2;

    protected renderLine(edge: SEdge, segments: Point[], context: RenderingContext, args?: object): VNode {
        let path = '';
        for (let i = 0; i < segments.length; i++) {
            const p = segments[i];
            if (i === 0) {
                path = `M ${p.x},${p.y}`;
            }
            if (isIntersectingRoutedPoint(p)) {
                path += this.intersectionPath(edge, segments, p, args);
            }
            if (i !== 0) {
                path += ` L ${p.x},${p.y}`;
            }
        }
        return <path d={path} />;
    }

    protected intersectionPath(edge: SEdge, segments: Point[], intersectingPoint: IntersectingRoutedPoint, args?: object): string {
        let path = '';
        for (const intersection of intersectingPoint.intersections.sort(BY_X_THEN_Y)) {
            const otherLineSegment = this.getOtherLineSegment(edge, intersection, args);
            if (otherLineSegment === undefined) {
                continue;
            }
            const lineSegment = this.getLineSegment(edge, intersection, args, segments);
            const intersectionPoint = intersection.intersectionPoint;
            if (Math.abs(lineSegment.slopeOrMax) < Math.abs(otherLineSegment.slopeOrMax)) {
                path += this.createJumpPath(intersectionPoint, lineSegment);
            } else {
                path += this.createSkipPath(intersectionPoint, lineSegment);
            }
        }
        return path;
    }

    protected getOtherLineSegment(currentEdge: SEdge, intersection: Intersection, args?: object): PointToPointLine | undefined {
        const otherEdgeId = intersection.routable1 === currentEdge.id ? intersection.routable2 : intersection.routable1;
        const otherEdge = currentEdge.index.getById(otherEdgeId);
        if (!(otherEdge instanceof SRoutableElement)) {
            return undefined;
        }
        return this.getLineSegment(otherEdge, intersection, args);
    }

    protected getLineSegment(edge: SRoutableElement, intersection: Intersection, args?: object, segments?: Point[]): PointToPointLine {
        const route = segments ? segments : this.edgeRouterRegistry.route(edge, args);
        const index = intersection.routable1 === edge.id ? intersection.segmentIndex1 : intersection.segmentIndex2;
        return new PointToPointLine(route[index], route[index + 1]);
    }

    protected createJumpPath(intersectionPoint: Point, lineSegment: PointToPointLine): string {
        const anchorBefore = shiftTowards(intersectionPoint, lineSegment.p1, this.jumpOffsetBefore);
        const anchorAfter = shiftTowards(intersectionPoint, lineSegment.p2, this.jumpOffsetAfter);
        const rotation = lineSegment.p1.x < lineSegment.p2.x ? 1 : 0;
        return ` L ${anchorBefore.x},${anchorBefore.y} A 1,1 0,0 ${rotation} ${anchorAfter.x},${anchorAfter.y}`;
    }

    protected createSkipPath(intersectionPoint: Point, lineSegment: PointToPointLine): string {
        let offsetBefore;
        let offsetAfter;
        if (intersectionPoint.y < lineSegment.p1.y) {
            offsetBefore = -this.skipOffsetBefore;
            offsetAfter = this.jumpOffsetAfter + this.skipOffsetAfter;
        } else {
            offsetBefore = this.jumpOffsetBefore + this.skipOffsetAfter;
            offsetAfter = -this.skipOffsetBefore;
        }
        const anchorBefore = shiftTowards(intersectionPoint, lineSegment.p1, offsetBefore);
        const anchorAfter = shiftTowards(intersectionPoint, lineSegment.p2, offsetAfter);
        return ` L ${anchorBefore.x},${anchorBefore.y} M ${anchorAfter.x},${anchorAfter.y}`;
    }

}

@injectable()
export class SRoutingHandleView implements IView {

    @inject(EdgeRouterRegistry) edgeRouterRegistry: EdgeRouterRegistry;

    minimalPointDistance: number = 10;

    render(handle: Readonly<SRoutingHandle>, context: RenderingContext, args?: { route?: RoutedPoint[] }): VNode {
        if (args && args.route) {
            if (handle.parent instanceof SRoutableElement) {
                const router = this.edgeRouterRegistry.get(handle.parent.routerKind);
                const theRoute = args.route === undefined ? this.edgeRouterRegistry.route(handle.parent, args) : args.route;
                const position = router.getHandlePosition(handle.parent, theRoute, handle);
                if (position !== undefined) {
                    const node = <circle class-sprotty-routing-handle={true}
                        class-selected={handle.selected} class-mouseover={handle.hoverFeedback}
                        cx={position.x} cy={position.y} r={this.getRadius()} />;
                    setAttr(node, 'data-kind', handle.kind);
                    return node;
                }
            }
        }
        // Fallback: Create an empty group
        return <g />;
    }

    getRadius(): number {
        return 7;
    }
}

@injectable()
export class SLabelView extends ShapeView {
    render(label: Readonly<SLabel>, context: RenderingContext): VNode | undefined {
        if (!isEdgeLayoutable(label) && !this.isVisible(label, context)) {
            return undefined;
        }
        const vnode = <text class-sprotty-label={true}>{label.text}</text>;
        const subType = getSubType(label);
        if (subType) {
            setAttr(vnode, 'class', subType);
        }
        return vnode;
    }
}

@injectable()
export class SCompartmentView implements IView {
    render(compartment: Readonly<SCompartment>, context: RenderingContext, args?: object): VNode | undefined {
        const translate = `translate(${compartment.bounds.x}, ${compartment.bounds.y})`;
        const vnode = <g transform={translate} class-sprotty-comp="{true}">
            {context.renderChildren(compartment, args)}
        </g>;
        const subType = getSubType(compartment);
        if (subType)
            setAttr(vnode, 'class', subType);
        return vnode;
    }
}

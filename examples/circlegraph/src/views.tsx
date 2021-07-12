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
import { svg } from '../../../src/lib/jsx';
import { injectable } from 'inversify';
import { VNode } from "snabbdom";
import { RenderingContext, SNode, ShapeView } from "../../../src";

/**
 * A very simple example node consisting of a plain circle.
 */
@injectable()
export class CircleNodeView extends ShapeView {
    render(node: SNode, context: RenderingContext): VNode | undefined {
        if (!this.isVisible(node, context)) {
            return undefined;
        }
        const radius = this.getRadius(node);
        return <g>
            <circle class-sprotty-node={true}
                    class-selected={node.selected}
                    class-mouseover={node.hoverFeedback}
                    r={radius} cx={radius} cy={radius}>
            </circle>
            <text x={radius} y={radius + 7} class-sprotty-text={true}>{node.id.substr(4)}</text>
        </g>;
    }

    protected getRadius(node: SNode): number {
        const d = Math.min(node.size.width, node.size.height);
        return d > 0 ? d / 2 : 0;
    }
}

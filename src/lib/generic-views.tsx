/********************************************************************************
 * Copyright (c) 2017-2020 TypeFox and others.
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
import { svg } from './jsx';
import { injectable } from "inversify";
import virtualize from "./virtualize";
import { VNode } from "snabbdom";
import { IView, RenderingContext } from "../base/views/view";
import { setNamespace, setAttr } from "../base/views/vnode-utils";
import { ShapeView } from "../features/bounds/views";
import { ForeignObjectElement, PreRenderedElement, ShapedPreRenderedElement } from "./model";

@injectable()
export class PreRenderedView extends ShapeView {
    render(model: Readonly<PreRenderedElement>, context: RenderingContext): VNode | undefined {
        if (model instanceof ShapedPreRenderedElement && !this.isVisible(model, context)) {
            return undefined;
        }
        const node = virtualize(model.code);
        if (node === null) throw new Error('node must be single Element');
        this.correctNamespace(node);
        return node;
    }

    protected correctNamespace(node: VNode) {
        if (node.sel === 'svg' || node.sel === 'g')
            setNamespace(node, 'http://www.w3.org/2000/svg');
    }

}

/**
 * An SVG `foreignObject` view with a namespace specified by the provided `ForeignObjectElement`.
 * Note that `foreignObject` may not be supported by all browsers or SVG viewers.
 */
@injectable()
export class ForeignObjectView implements IView {
    render(model: ForeignObjectElement, context: RenderingContext): VNode {
        const foreignObjectContents = virtualize(model.code);
        if (foreignObjectContents === null) throw new Error('node must be single Element');
        const node = <g>
            <foreignObject requiredFeatures='http://www.w3.org/TR/SVG11/feature#Extensibility'
                height={model.bounds.height} width={model.bounds.width} x={0} y={0}>
                {foreignObjectContents}
            </foreignObject>
            {context.renderChildren(model)}
        </g>;
        setAttr(node, 'class', model.type);
        setNamespace(foreignObjectContents, model.namespace);
        return node;
    }
}

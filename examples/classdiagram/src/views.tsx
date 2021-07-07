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
import { svg } from 'snabbdom-jsx';

import { RenderingContext, IView, RectangularNodeView, SNode } from "../../../src";
import { VNode } from "snabbdom/vnode";
import { Icon } from './model';
import { injectable } from 'inversify';

@injectable()
export class NodeView extends RectangularNodeView {
    render(node: Readonly<SNode>, context: RenderingContext, args?: object): VNode | undefined {
        if (!this.isVisible(node, context)) {
            return undefined;
        }
        return <g>
            <rect class-sprotty-node={true}
                  class-node-package={node.type === 'node:package'}
                  class-node-class={node.type === 'node:class'}
                  class-mouseover={node.hoverFeedback} class-selected={node.selected}
                  x="0" y="0" width={Math.max(node.size.width, 0)} height={Math.max(node.size.height, 0)}></rect>
            {context.renderChildren(node, args)}
        </g>;
    }
}

@injectable()
export class IconView implements IView {

    render(element: Icon, context: RenderingContext, args?: object): VNode {
        const radius = this.getRadius();
        return <g>
            <circle class-sprotty-icon={true} r={radius} cx={radius} cy={radius}></circle>
            {context.renderChildren(element, args)}
        </g>;
    }

    getRadius() {
        return 16;
    }
}

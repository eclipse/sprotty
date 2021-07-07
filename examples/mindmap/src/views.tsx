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

import { VNode } from "snabbdom/vnode";
import { IView, RectangularNodeView, RenderingContext, SNode } from "../../../src";
import { PopupButton } from "./model";
import { injectable } from "inversify";

@injectable()
export class MindmapNodeView extends RectangularNodeView {
    render(node: SNode, context: RenderingContext, args?: object): VNode {
        return <g class-node={true}>
            <rect class-sprotty-node={true} class-selected={node.selected} class-mouseover={node.hoverFeedback}
                  x={0} y={0} rx={10} ry={10}
                  width={Math.max(0, node.bounds.width)} height={Math.max(0, node.bounds.height)}>
            </rect>
            {context.renderChildren(node, args)}
        </g>;
    }
}

@injectable()
export class PopupButtonView implements IView {

    static readonly SIZE = 24;

    render(model: PopupButton, context: RenderingContext): VNode {
        switch (model.kind) {
            case 'add-node':
                return <svg viewBox="-1 -1 26 26">
                    <rect class-sprotty-node={true}
                        x={0} y={0} rx={8} ry={8}
                        width={PopupButtonView.SIZE} height={PopupButtonView.SIZE}>
                    </rect>
                    <rect class-add-icon={true}
                        x={10} y={6} width={4} height={PopupButtonView.SIZE - 12}>
                    </rect>
                    <rect class-add-icon={true}
                        x={6} y={10} width={PopupButtonView.SIZE - 12} height={4}>
                    </rect>
                </svg>;
            case 'remove-node':
                return <svg>
                    <g transform={`rotate(45 ${PopupButtonView.SIZE / 2} ${PopupButtonView.SIZE / 2})`}>
                        <rect class-remove-icon={true}
                            x={10} y={4} width={4} height={PopupButtonView.SIZE - 8}>
                        </rect>
                        <rect class-remove-icon={true}
                            x={4} y={10} width={PopupButtonView.SIZE - 8} height={4}>
                        </rect>
                    </g>
                </svg>;
            default:
                return <svg></svg>;
        }
    }

}

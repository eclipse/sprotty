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

import { injectable, inject } from "inversify";
import { VNode } from "snabbdom";
import { TYPES } from "../types";
import { almostEquals, Bounds, isValidDimension } from '../../utils/geometry';
import { Action } from '../actions/action';
import { IActionDispatcher } from '../actions/action-dispatcher';
import { IVNodePostprocessor } from "../views/vnode-postprocessor";
import { SModelElement, SModelRoot } from "../model/smodel";
import { SystemCommand, CommandExecutionContext, CommandReturn } from '../commands/command';
import { getWindowScroll } from "../../utils/browser";

/**
 * Grabs the bounds from the root element in page coordinates and fires a
 * InitializeCanvasBoundsAction. This size is needed for other actions such
 * as FitToScreenAction.
 */
@injectable()
export class CanvasBoundsInitializer implements IVNodePostprocessor {

    protected rootAndVnode: [SModelRoot, VNode] | undefined;

    @inject(TYPES.IActionDispatcher) protected actionDispatcher: IActionDispatcher;

    decorate(vnode: VNode, element: SModelElement): VNode {
        if (element instanceof SModelRoot && !isValidDimension(element.canvasBounds)) {
            this.rootAndVnode = [element, vnode];
        }
        return vnode;
    }

    postUpdate() {
        if (this.rootAndVnode !== undefined) {
            const domElement = this.rootAndVnode[1].elm;
            const oldBounds = this.rootAndVnode[0].canvasBounds;
            if (domElement !== undefined) {
                const newBounds = this.getBoundsInPage(domElement as Element);
                if (!(almostEquals(newBounds.x, oldBounds.x)
                        && almostEquals(newBounds.y, oldBounds.y)
                        && almostEquals(newBounds.width, oldBounds.width)
                        && almostEquals(newBounds.height, oldBounds.width)))
                    this.actionDispatcher.dispatch(new InitializeCanvasBoundsAction(newBounds));

            }
            this.rootAndVnode = undefined;
        }
    }

    protected getBoundsInPage(element: Element) {
        const bounds = element.getBoundingClientRect();
        const scroll = getWindowScroll();
        return {
            x: bounds.left + scroll.x,
            y: bounds.top + scroll.y,
            width: bounds.width,
            height: bounds.height
        };
    }
}

export class InitializeCanvasBoundsAction implements Action {
    static readonly KIND: string  = 'initializeCanvasBounds';
    readonly kind = InitializeCanvasBoundsAction.KIND;

    constructor(public readonly newCanvasBounds: Bounds) {
    }
}

@injectable()
export class InitializeCanvasBoundsCommand extends SystemCommand {
    static readonly KIND: string = InitializeCanvasBoundsAction.KIND;

    private newCanvasBounds: Bounds;

    constructor(@inject(TYPES.Action) protected readonly action: InitializeCanvasBoundsAction) {
        super();
    }

    execute(context: CommandExecutionContext): CommandReturn {
        this.newCanvasBounds = this.action.newCanvasBounds;
        context.root.canvasBounds = this.newCanvasBounds;
        return context.root;
    }

    undo(context: CommandExecutionContext): CommandReturn {
        return context.root;
    }

    redo(context: CommandExecutionContext): CommandReturn {
        return context.root;
    }
}

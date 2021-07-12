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

import { inject, injectable, multiInject, optional } from "inversify";
import { VNode } from "snabbdom";
import { TYPES } from "../types";
import { IActionDispatcher } from "../actions/action-dispatcher";
import { SModelElement, SModelRoot } from "../model/smodel";
import { Action } from "../actions/action";
import { IVNodePostprocessor } from "./vnode-postprocessor";
import { on } from "./vnode-utils";

@injectable()
export class KeyTool implements IVNodePostprocessor {

    @inject(TYPES.IActionDispatcher) protected actionDispatcher: IActionDispatcher;

    constructor(@multiInject(TYPES.KeyListener)@optional() protected keyListeners: KeyListener[] = []) {}

    register(keyListener: KeyListener) {
        this.keyListeners.push(keyListener);
    }

    deregister(keyListener: KeyListener) {
        const index = this.keyListeners.indexOf(keyListener);
        if (index >= 0)
            this.keyListeners.splice(index, 1);
    }

    protected handleEvent<K extends keyof KeyListener>(methodName: K, model: SModelRoot, event: KeyboardEvent) {
        const actions = this.keyListeners
            .map(listener => listener[methodName].apply(listener, [model, event]))
            .reduce((a, b) => a.concat(b));
        if (actions.length > 0) {
            event.preventDefault();
            this.actionDispatcher.dispatchAll(actions);
        }
    }

    keyDown(element: SModelRoot, event: KeyboardEvent): void {
        this.handleEvent('keyDown', element, event);
    }

    keyUp(element: SModelRoot, event: KeyboardEvent): void {
        this.handleEvent('keyUp', element, event);
    }

    focus() {}

    decorate(vnode: VNode, element: SModelElement): VNode {
        if (element instanceof SModelRoot) {
            on(vnode, 'focus', this.focus.bind(this, element));
            on(vnode, 'keydown', this.keyDown.bind(this, element));
            on(vnode, 'keyup', this.keyUp.bind(this, element));
        }
        return vnode;
    }

    postUpdate() {
    }
}

@injectable()
export class KeyListener {
    keyDown(element: SModelElement, event: KeyboardEvent): Action[] {
        return [];
    }

    keyUp(element: SModelElement, event: KeyboardEvent): Action[] {
        return [];
    }
}

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
import { Action, isAction } from "../actions/action";
import { IActionDispatcher } from "../actions/action-dispatcher";
import { SModelElement, SModelRoot } from "../model/smodel";
import { TYPES } from "../types";
import { DOMHelper } from "./dom-helper";
import { IVNodePostprocessor } from "./vnode-postprocessor";
import { on } from "./vnode-utils";
import { Point } from "../../utils/geometry";

@injectable()
export class MouseTool implements IVNodePostprocessor {

    @inject(TYPES.IActionDispatcher) protected actionDispatcher: IActionDispatcher;
    @inject(TYPES.DOMHelper) protected domHelper: DOMHelper;

    constructor(@multiInject(TYPES.MouseListener) @optional() protected mouseListeners: MouseListener[] = []) { }

    register(mouseListener: MouseListener) {
        this.mouseListeners.push(mouseListener);
    }

    deregister(mouseListener: MouseListener) {
        const index = this.mouseListeners.indexOf(mouseListener);
        if (index >= 0)
            this.mouseListeners.splice(index, 1);
    }

    protected getTargetElement(model: SModelRoot, event: MouseEvent): SModelElement | undefined {
        let target = event.target as Element;
        const index = model.index;
        while (target) {
            if (target.id) {
                const element = index.getById(this.domHelper.findSModelIdByDOMElement(target));
                if (element !== undefined)
                    return element;
            }
            target = target.parentNode as Element;
        }
        return undefined;
    }

    protected handleEvent<K extends keyof MouseListener>(methodName: K, model: SModelRoot, event: MouseEvent) {
        this.focusOnMouseEvent(methodName, model);
        const element = this.getTargetElement(model, event);
        if (!element)
            return;
        const actions = this.mouseListeners
            .map(listener => listener[methodName].apply(listener, [element, event]))
            .reduce((a, b) => a.concat(b));
        if (actions.length > 0) {
            event.preventDefault();
            for (const actionOrPromise of actions) {
                if (isAction(actionOrPromise)) {
                    this.actionDispatcher.dispatch(actionOrPromise);
                } else {
                    actionOrPromise.then((action: Action) => {
                        this.actionDispatcher.dispatch(action);
                    });
                }
            }
        }
    }

    protected focusOnMouseEvent<K extends keyof MouseListener>(methodName: K, model: SModelRoot) {
        if (document) {
            const domElement = document.getElementById(this.domHelper.createUniqueDOMElementId(model));
            if (methodName === 'mouseDown' && domElement !== null && typeof domElement.focus === 'function')
                domElement.focus();
        }
    }

    mouseOver(model: SModelRoot, event: MouseEvent) {
        this.handleEvent('mouseOver', model, event);
    }

    mouseOut(model: SModelRoot, event: MouseEvent) {
        this.handleEvent('mouseOut', model, event);
    }

    mouseEnter(model: SModelRoot, event: MouseEvent) {
        this.handleEvent('mouseEnter', model, event);
    }

    mouseLeave(model: SModelRoot, event: MouseEvent) {
        this.handleEvent('mouseLeave', model, event);
    }

    mouseDown(model: SModelRoot, event: MouseEvent) {
        this.handleEvent('mouseDown', model, event);
    }

    mouseMove(model: SModelRoot, event: MouseEvent) {
        this.handleEvent('mouseMove', model, event);
    }

    mouseUp(model: SModelRoot, event: MouseEvent) {
        this.handleEvent('mouseUp', model, event);
    }

    wheel(model: SModelRoot, event: WheelEvent) {
        this.handleEvent('wheel', model, event);
    }

    doubleClick(model: SModelRoot, event: MouseEvent) {
        this.handleEvent('doubleClick', model, event);
    }

    decorate(vnode: VNode, element: SModelElement) {
        if (element instanceof SModelRoot) {
            on(vnode, 'mouseover', this.mouseOver.bind(this, element));
            on(vnode, 'mouseout', this.mouseOut.bind(this, element));
            on(vnode, 'mouseenter', this.mouseEnter.bind(this, element));
            on(vnode, 'mouseleave', this.mouseLeave.bind(this, element));
            on(vnode, 'mousedown', this.mouseDown.bind(this, element));
            on(vnode, 'mouseup', this.mouseUp.bind(this, element));
            on(vnode, 'mousemove', this.mouseMove.bind(this, element));
            on(vnode, 'wheel', this.wheel.bind(this, element));
            on(vnode, 'contextmenu', (event: Event) => {
                event.preventDefault();
            });
            on(vnode, 'dblclick', this.doubleClick.bind(this, element));
        }
        vnode = this.mouseListeners.reduce(
            (n: VNode, listener: MouseListener) => listener.decorate(n, element),
            vnode);
        return vnode;
    }

    postUpdate() {
    }
}

@injectable()
export class PopupMouseTool extends MouseTool {
    constructor(@multiInject(TYPES.PopupMouseListener) @optional() protected mouseListeners: MouseListener[] = []) {
        super(mouseListeners);
    }
}

@injectable()
export class MouseListener {

    mouseOver(target: SModelElement, event: MouseEvent): (Action | Promise<Action>)[] {
        return [];
    }

    mouseOut(target: SModelElement, event: MouseEvent): (Action | Promise<Action>)[] {
        return [];
    }

    mouseEnter(target: SModelElement, event: MouseEvent): (Action | Promise<Action>)[] {
        return [];
    }

    mouseLeave(target: SModelElement, event: MouseEvent): (Action | Promise<Action>)[] {
        return [];
    }

    mouseDown(target: SModelElement, event: MouseEvent): (Action | Promise<Action>)[] {
        return [];
    }

    mouseMove(target: SModelElement, event: MouseEvent): (Action | Promise<Action>)[] {
        return [];
    }

    mouseUp(target: SModelElement, event: MouseEvent): (Action | Promise<Action>)[] {
        return [];
    }

    wheel(target: SModelElement, event: WheelEvent): (Action | Promise<Action>)[] {
        return [];
    }

    doubleClick(target: SModelElement, event: MouseEvent): (Action | Promise<Action>)[] {
        return [];
    }

    decorate(vnode: VNode, element: SModelElement): VNode {
        return vnode;
    }
}

@injectable()
export class MousePositionTracker extends MouseListener {

    protected lastPosition: Point | undefined;

    mouseMove(target: SModelElement, event: MouseEvent): (Action | Promise<Action>)[] {
        this.lastPosition = target.root.parentToLocal({ x: event.offsetX, y: event.offsetY });
        return [];
    }

    /**
     * Returns the last tracked mouse cursor position relative to the diagram root or `undefined`
     * if no mouse cursor position was ever tracked yet.
     */
    get lastPositionOnDiagram(): Point | undefined {
        return this.lastPosition;
    }
}

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

import { VNode } from "snabbdom";

export function setAttr(vnode: VNode, name: string, value: any) {
    getAttrs(vnode)[name] = value;
}

export function setClass(vnode: VNode, name: string, value: boolean) {
    getClass(vnode)[name] = value;
}

export function setNamespace(node: VNode, ns: string) {
    if (node.data === undefined)
        node.data = {};
    node.data.ns = ns;
    const children = node.children;
    if (children !== undefined) {
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (typeof child !== 'string')
                setNamespace(child, ns);
        }
    }
}

export function copyClassesFromVNode(source: VNode, target: VNode) {
    const classList = getClass(source);
    for (const c in classList) {
        if (classList.hasOwnProperty(c))
            setClass(target, c, true);
    }
}

export function copyClassesFromElement(element: HTMLElement, target: VNode) {
    const classList = element.classList;
    for (let i = 0; i < classList.length; i++) {
        const item = classList.item(i);
        if (item)
            setClass(target, item, true);
    }
}

export function mergeStyle(vnode: VNode, style: any) {
    getData(vnode).style = {...(getData(vnode).style || {}), ...style};
}

export function on(vnode: VNode, event: string, listener: (event: Event) => void) {
    const val = getOn(vnode);
    if (val[event]) {
        throw new Error('EventListener for ' + event + ' already registered on VNode');
    }
    (val as any)[event] = listener;
}

export function getAttrs(vnode: VNode) {
    const data = getData(vnode);
    if (!data.attrs)
        data.attrs = {};
    return data.attrs;
}

function getData(vnode: VNode) {
    if (!vnode.data)
        vnode.data = {};
    return vnode.data;
}

function getClass(vnode: VNode) {
    const data = getData(vnode);
    if (!data.class)
        data.class = {};
    return data.class;
}

function getOn(vnode: VNode) {
    const data = getData(vnode);
    if (!data.on)
        data.on = {};
    return data.on;
}

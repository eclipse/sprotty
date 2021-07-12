/********************************************************************************
 * Copyright (c) 2017-2021 TypeFox and others.
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

import { h, vnode, VNode, VNodeData } from 'snabbdom';

function buildVNodeData(attrs: { [key: string]: string }) {
    const data: VNodeData = {};
    const addData = (memo: Record<string, string> | null, name: string) => {
        if (name !== 'style' && name !== 'class') {
            const val = unescapeEntities(attrs[name]);
            memo ? memo[name] = val : memo = { [name]: val };
        }
        return memo;
    };
    const _attrs = Object.keys(attrs).reduce(addData, null);

    if (_attrs) {
        data.attrs = _attrs;
    }

    const style = parseStyle(attrs);
    if (style) {
        data.style = style;
    }

    const classes = parseClass(attrs);
    if (classes) {
        data.class = classes;
    }
    return data;
}

function parseStyle(attrs: { [key: string]: string }) {
    const addStyle = (memo: Record<string, string> | null, styleProp: string) => {
        const res = styleProp.split(':');
        const name = transformName(res[0].trim());
        if (name) {
            const val = res[1].replace('!important', '').trim();
            memo ? memo[name] = val : memo = { [name]: val };
        }
        return memo;
    };
    try {
        return attrs.style.split(';').reduce(addStyle, null);
    } catch (e) {
        return null;
    }
}

function parseClass(attrs: { [key: string]: string }) {
    const addClass = (memo: Record<string, boolean> | null, className: string) => {
        className = className.trim();
        if (className) {
            memo ? memo[className] = true : memo = { [className]: true };
        }
        return memo;
    };
    try {
        return attrs.class.split(' ').reduce(addClass, null);
    } catch (e) {
        return null;
    }
}

function transformName(name: string) {
    // Replace -a with A to help camel case style property names.
    name = name.replace(/-(\w)/g, function _replace($1, $2) {
        return $2.toUpperCase();
    });
    // Handle properties that start with a -.
    const firstChar = name.charAt(0).toLowerCase();
    return `${firstChar}${name.substring(1)}`;
}

// Regex for matching HTML entities.
const entityRegex = new RegExp('&[a-z0-9#]+;', 'gi');
// Element for setting innerHTML for transforming entities.
let el: HTMLDivElement | null = null;

function unescapeEntities(text: string) {
    // Create the element using the context if it doesn't exist.
    if (!el) {
        el = document.createElement('div');
    }
    return text.replace(entityRegex, (entity) => {
        if (el === null) return '';
        el.innerHTML = entity;
        return el.textContent === null ? '' : el.textContent;
    });
}

function recurse(doc: Node, func: (node: Node, parent: Node | null) => void) {
    let node: Node | null = doc;
    let parent: Node | null = null;
    const stack: Node[] = [];

    const setChild = (n: Node) => {
        const child = n.firstChild;
        if (child !== null) {
            parent = n;
        }
        node = child;
    };
    func(node, parent);
    setChild(node);

    while (true) {
        while (node) {
            stack.push(node);
            func(node, parent);
            setChild(node);
        }
        const _node = stack.pop();
        node = _node ? _node : null;
        if (!stack.length) break;
        parent = stack[stack.length - 1];
        if (node) {
            const sibling = node.nextSibling;
            if (sibling == null) {
                parent = stack[stack.length - 1];
            }
            node = sibling;
        }
    }
}

let vdom: VNode | null = null;
const vnodeMap = new Map<Node, VNode>();
let delimited = false;

function toVNode(node: Node, parent: Node | null) {

    let current: VNode | undefined;
    if (parent !== null) {
        current = vnodeMap.get(parent);
    }

    switch (node?.nodeType) {
        // element
        case 1: {
            if (current === undefined) return;
            current.children = current.children ? current.children : [];
            const children = current.children;
            const attributes = (node as Element).attributes;
            const attrs: { [key: string]: string } = {};
            for (let i = 0; i < attributes.length; i++) {
                const attr = attributes.item(i);
                if (attr) {
                    attrs[attr.name] = attr.value;
                }
            }
            const vn = h(node.nodeName, buildVNodeData(attrs));
            children.push(vn);
            vnodeMap.set(node, vn);
            break;
        }
        // text
        case 3: {
            const text = node.textContent;
            if (text !== null && current !== undefined) {
                current.children = current.children ? current.children : [];
                const children = current.children;
                const lastData = children.length > 0 ? children[children.length - 1] : null;
                if (!delimited && typeof lastData !== 'string' && lastData !== null && lastData.sel === undefined) {
                    lastData.text = lastData.text + text;
                } else {
                    children.push(vnode(undefined, undefined, undefined, text, undefined));
                }
                delimited = false;
            }
            break;
        }
        case 8: {
            delimited = true;
            break;
        }
        // document
        case 9: {
            vdom = vnode(undefined, undefined, [], undefined, undefined);
            vnodeMap.set(node, vdom);
            break;
        }
        default:
            break;
    }
}

function stripVNode(vnodes: VNode | null) {
    const children = vnodes?.children;
    if (typeof children === 'undefined') return null;
    if (children.length === 1 && typeof children[0] !== 'string') return children[0];
    return null;
}

export default function virtualizeString(html?: string) {

    const parser = new window.DOMParser();
    if (parser === undefined || html === undefined || html === '') return null;

    const doc = parser.parseFromString(html, "application/xml");

    if (doc?.firstChild?.nodeName === 'parsererror') {
        const error = `${doc?.firstChild?.textContent}`;
        throw new Error(error);
    }

    delimited = false;
    vdom = null;
    recurse(doc, toVNode);

    if (vdom === null) return null;
    return stripVNode(vdom);
}

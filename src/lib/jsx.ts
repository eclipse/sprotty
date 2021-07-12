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

import { VNodeData, JsxVNodeChildren, JsxVNodeChild, jsx, FunctionComponent } from "snabbdom";


declare global {
  // eslint-disable-next-line no-redeclare
  namespace JSX {
      // Based on the tag list in github:DefinitelyTyped/DefinitelyTyped:React
      interface IntrinsicElements {
          [elemName: string]: VNodeData
      }
  }
}

const modulesNS = ['hook', 'on', 'style', 'class', 'props', 'attrs', 'dataset'];
const SVGNS = 'http://www.w3.org/2000/svg';

function normalizeAttrs(source: VNodeData | null, defNS: string, namespace?: string) {
  if (source === null) return source;
  const data: VNodeData = {};

  if (namespace) {
    data.ns = namespace;
  }

  modulesNS.forEach(mod => {
    if (source[mod])
      data[mod] = source[mod];
  });
  Object.keys(source).forEach(key => {
    if (key === 'key' || key === 'classNames' || key === 'selector') return;
    const idx = key.indexOf('-');
    if (idx > 0)
      addAttr(key.slice(0, idx), key.slice(idx + 1), source[key]);
    else if (!data[key])
      addAttr(defNS, key, source[key]);
  });
  return data;

  function addAttr(modname: string, key: string, val: JsxVNodeChildren) {
    const mod = data[modname] || (data[modname] = {});
    mod[key] = val;
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function JSX(namespace?: string, defNS: string = 'props') {
  return (tag: FunctionComponent | string, attrs: VNodeData | null, ...children: JsxVNodeChild[]) => jsx(tag, normalizeAttrs(attrs, defNS, namespace), children);
}

const html = JSX();
const svg = JSX(SVGNS, 'attrs');

export { html, svg, JSX };

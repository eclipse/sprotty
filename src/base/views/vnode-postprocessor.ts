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

import { injectable } from "inversify";
import { VNode } from "snabbdom";
import { SModelElement } from "../model/smodel";
import { Action } from "../actions/action";
import { setAttr } from "./vnode-utils";

/**
 * Manipulates a created VNode after it has been created.
 * Used to register listeners and add animations.
 */
export interface IVNodePostprocessor {
    decorate(vnode: VNode, element: SModelElement): VNode
    postUpdate(cause?: Action): void
}

@injectable()
export class FocusFixPostprocessor implements IVNodePostprocessor {

    decorate(vnode: VNode, element: SModelElement): VNode {
        if (vnode.sel && vnode.sel.startsWith('svg'))
            // allows to set focus in Firefox
            setAttr(vnode, 'tabindex', 0);
        return vnode;
    }

    postUpdate(): void {
    }
}

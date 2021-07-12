/********************************************************************************
 * Copyright (c) 2018 TypeFox and others.
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

import { IVNodePostprocessor } from "./vnode-postprocessor";
import { VNode } from "snabbdom";
import { SModelElement } from "../model/smodel";
import { setClass } from "./vnode-utils";
import { injectable } from "inversify";
import { getSubType } from '../model/smodel-utils';

@injectable()
export class CssClassPostprocessor implements IVNodePostprocessor {
    decorate(vnode: VNode, element: SModelElement): VNode {
        if (element.cssClasses) {
            for (const cssClass of element.cssClasses)
                setClass(vnode, cssClass, true);
        }
        // append model subtype as class
        const subType = getSubType(element);
        if (subType && subType !== element.type) {
            setClass(vnode, subType, true);
        }
        return vnode;
    }

    postUpdate(): void {
        // empty
    }
}

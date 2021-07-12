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

import { inject, injectable } from "inversify";
import { VNode } from "snabbdom";
import { TYPES } from "../types";
import { ILogger } from "../../utils/logging";
import { SModelElement } from "../model/smodel";
import { IVNodePostprocessor } from "./vnode-postprocessor";
import { DOMHelper } from "./dom-helper";
import { getAttrs } from "./vnode-utils";

@injectable()
export class IdPostprocessor implements IVNodePostprocessor {

    @inject(TYPES.ILogger) protected logger: ILogger;
    @inject(TYPES.DOMHelper) protected domHelper: DOMHelper;

    decorate(vnode: VNode, element: SModelElement): VNode {
        const attrs = getAttrs(vnode);
        if (attrs.id !== undefined)
            this.logger.warn(vnode, 'Overriding id of vnode (' + attrs.id + '). Make sure not to set it manually in view.');
        attrs.id = this.domHelper.createUniqueDOMElementId(element);
        if (!vnode.key)
            vnode.key = element.id;
        return vnode;
    }

    postUpdate(): void {
    }

}

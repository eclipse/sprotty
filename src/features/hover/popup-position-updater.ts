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
import { TYPES } from "../../base/types";
import { IVNodePostprocessor } from "../../base/views/vnode-postprocessor";
import { ViewerOptions } from "../../base/views/viewer-options";
import { SModelElement } from "../../base/model/smodel";

@injectable()
export class PopupPositionUpdater implements IVNodePostprocessor {

    @inject(TYPES.ViewerOptions) protected options: ViewerOptions;

    decorate(vnode: VNode, element: SModelElement): VNode {
        return vnode;
    }

    postUpdate(): void {
        const popupDiv = document.getElementById(this.options.popupDiv);
        if (popupDiv !== null && typeof window !== 'undefined') {
            const boundingClientRect = popupDiv.getBoundingClientRect();
            if (window.innerHeight < boundingClientRect.height + boundingClientRect.top) {
                popupDiv.style.top = (window.pageYOffset + window.innerHeight - boundingClientRect.height - 5) + 'px';
            }

            if (window.innerWidth < boundingClientRect.left + boundingClientRect.width) {
                popupDiv.style.left = (window.pageXOffset + window.innerWidth - boundingClientRect.width - 5) + 'px';
            }

            if (boundingClientRect.left < 0) {
                popupDiv.style.left = '0px';
            }

            if (boundingClientRect.top < 0) {
                popupDiv.style.top = '0px';
            }
        }
    }

}

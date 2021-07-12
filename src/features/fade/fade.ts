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
import { Animation } from "../../base/animations/animation";
import { CommandExecutionContext } from "../../base/commands/command";
import { SModelRoot, SModelElement, SChildElement } from "../../base/model/smodel";
import { IVNodePostprocessor } from "../../base/views/vnode-postprocessor";
import { setAttr } from "../../base/views/vnode-utils";
import { Fadeable, isFadeable } from "./model";

export interface ResolvedElementFade {
    element: SModelElement & Fadeable
    type: 'in' | 'out'
}

export class FadeAnimation extends Animation {

    constructor(protected model: SModelRoot,
                public elementFades: ResolvedElementFade[],
                context: CommandExecutionContext,
                protected removeAfterFadeOut: boolean = false) {
        super(context);
    }

    tween(t: number, context: CommandExecutionContext): SModelRoot {
        for (const elementFade of this.elementFades) {
            const element = elementFade.element;
            if (elementFade.type === 'in') {
                element.opacity = t;
            } else if (elementFade.type === 'out') {
                element.opacity = 1 - t;
                if (t === 1 && this.removeAfterFadeOut && element instanceof SChildElement) {
                    element.parent.remove(element);
                }
            }
        }
        return this.model;
    }

}

@injectable()
export class ElementFader implements IVNodePostprocessor {

    decorate(vnode: VNode, element: SModelElement): VNode {
        if (isFadeable(element) && element.opacity !== 1) {
            setAttr(vnode, 'opacity', element.opacity);
        }
        return vnode;
    }

    postUpdate(): void {
    }
}

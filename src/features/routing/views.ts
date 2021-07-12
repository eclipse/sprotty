/********************************************************************************
 * Copyright (c) 2020 TypeFox and others.
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

import { injectable } from 'inversify';
import { VNode } from 'snabbdom';
import { Point } from '../../utils/geometry';
import { IView, RenderingContext } from '../../base/views/view';
import { SRoutableElement, getAbsoluteRouteBounds } from './model';

@injectable()
export abstract class RoutableView implements IView {
    /**
     * Check whether the given model element is in the current viewport. Use this method
     * in your `render` implementation to skip rendering in case the element is not visible.
     * This can greatly enhance performance for large models.
     */
    isVisible(model: Readonly<SRoutableElement>, route: Point[], context: RenderingContext): boolean {
        if (context.targetKind === 'hidden') {
            // Don't hide any element for hidden rendering
            return true;
        }
        if (route.length === 0) {
            // We should hide only if we know the element's route
            return true;
        }
        const ab = getAbsoluteRouteBounds(model, route);
        const canvasBounds = model.root.canvasBounds;
        return ab.x <= canvasBounds.width
            && ab.x + ab.width >= 0
            && ab.y <= canvasBounds.height
            && ab.y + ab.height >= 0;
    }

    abstract render(model: Readonly<SRoutableElement>, context: RenderingContext, args?: object): VNode | undefined;
}

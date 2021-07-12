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
import { isValidDimension } from '../../utils/geometry';
import { IView, RenderingContext } from '../../base/views/view';
import { getAbsoluteBounds, BoundsAware } from './model';
import { SChildElement } from '../../base/model/smodel';

@injectable()
export abstract class ShapeView implements IView {
    /**
     * Check whether the given model element is in the current viewport. Use this method
     * in your `render` implementation to skip rendering in case the element is not visible.
     * This can greatly enhance performance for large models.
     */
    isVisible(model: Readonly<SChildElement & BoundsAware>, context: RenderingContext): boolean {
        if (context.targetKind === 'hidden') {
            // Don't hide any element for hidden rendering
            return true;
        }
        if (!isValidDimension(model.bounds)) {
            // We should hide only if we know the element's bounds
            return true;
        }
        const ab = getAbsoluteBounds(model);
        const canvasBounds = model.root.canvasBounds;
        return ab.x <= canvasBounds.width
            && ab.x + ab.width >= 0
            && ab.y <= canvasBounds.height
            && ab.y + ab.height >= 0;
    }

    abstract render(model: Readonly<SChildElement>, context: RenderingContext, args?: object): VNode | undefined;
}

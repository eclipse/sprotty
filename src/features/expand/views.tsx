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

 /** @jsx svg */
import { svg } from '../../lib/jsx';

import { VNode } from 'snabbdom';
import { IView, RenderingContext } from '../../base/views/view';
import { isExpandable } from './model';
import { findParentByFeature } from '../../base/model/smodel-utils';
import { SButton } from '../button/model';
import { injectable } from 'inversify';

@injectable()
export class ExpandButtonView implements IView {
    render(button: SButton, context: RenderingContext): VNode {
        const expandable = findParentByFeature(button, isExpandable);
        const path = (expandable !== undefined && expandable.expanded)
            ? 'M 1,5 L 8,12 L 15,5 Z'
            : 'M 1,8 L 8,15 L 8,1 Z';
        return <g class-sprotty-button="{true}" class-enabled="{button.enabled}">
                <rect x={0} y={0} width={16} height={16} opacity={0}></rect>
                <path d={path}></path>
            </g>;
    }
}

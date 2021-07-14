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

import { Container, interfaces } from "inversify";
import { safeAssign } from "../../utils/object";
import { TYPES } from "../types";

export interface ViewerOptions {
    baseDiv: string
    baseClass: string
    hiddenDiv: string
    hiddenClass: string
    popupDiv: string
    popupClass: string
    popupClosedClass: string
    needsClientLayout: boolean
    needsServerLayout: boolean
    popupOpenDelay: number
    popupCloseDelay: number
}

export const defaultViewerOptions = () => (<ViewerOptions>{
    baseDiv: 'sprotty',
    baseClass: 'sprotty',
    hiddenDiv: 'sprotty-hidden',
    hiddenClass: 'sprotty-hidden',
    popupDiv: 'sprotty-popup',
    popupClass: 'sprotty-popup',
    popupClosedClass: 'sprotty-popup-closed',
    needsClientLayout: true,
    needsServerLayout: false,
    popupOpenDelay: 1000,
    popupCloseDelay: 300
});

/**
 * Utility function to partially set viewer options. Default values (from `defaultViewerOptions`) are used for
 * options that are not specified.
 */
export function configureViewerOptions(context: { bind: interfaces.Bind, isBound: interfaces.IsBound, rebind: interfaces.Rebind },
        options: Partial<ViewerOptions>): void {
    const opt: ViewerOptions = {
        ...defaultViewerOptions(),
        ...options
    };
    if (context.isBound(TYPES.ViewerOptions))
        context.rebind(TYPES.ViewerOptions).toConstantValue(opt);
    else
        context.bind(TYPES.ViewerOptions).toConstantValue(opt);
}

/**
 * Utility function to partially override the currently configured viewer options in a DI container.
 */
export function overrideViewerOptions(container: Container, options: Partial<ViewerOptions>): ViewerOptions {
    const opt = container.get<ViewerOptions>(TYPES.ViewerOptions);
    safeAssign(opt, options);
    return opt;
}

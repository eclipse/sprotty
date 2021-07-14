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

import { Container } from "inversify";
import { safeAssign } from "../../utils/object";
import { TYPES } from '../types';

/**
 * Options for the command execution
 */
export interface CommandStackOptions {
    /**
     * The default duration of an animated command in milliseconds
     */
    defaultDuration: number

    /**
     * The maximum number of commands that can be undone. Once the undo stack
     * reaches this number, any additional command that is pushed will remove
     * one from the bottom of the stack.
     *
     * If negative, there is no limit, which results in a memory leak.
     */
    undoHistoryLimit: number
}

export function overrideCommandStackOptions(container: Container, options: Partial<CommandStackOptions>): CommandStackOptions {
    const defaultOptions = container.get<CommandStackOptions>(TYPES.CommandStackOptions);
    safeAssign(defaultOptions, options);
    return defaultOptions;
}

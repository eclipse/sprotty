/********************************************************************************
 * Copyright (c) 2017-2021 TypeFox and others.
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

 export function isNotNullish(data: unknown): data is Record<PropertyKey, unknown> {
    return data !== null && data !== undefined;
}

export function hasOwnProperty<K extends PropertyKey>(arg: unknown, key: K): arg is Record<K, unknown> {
    return isNotNullish(arg) && Object.prototype.hasOwnProperty.call(arg, key);
}

export function safeAssign<T>(target: T, partial: Partial<T>): T {
    return Object.assign(target, partial);
}

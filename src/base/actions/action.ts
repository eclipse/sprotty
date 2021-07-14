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

import { JsonAny } from '../../utils/json';
import { hasOwnProperty } from '../../utils/object';

/**
 * An action describes a change to the model declaratively.
 * It is a plain data structure, and as such transferable between server and client. An action must never contain actual
 * SModelElement instances, but either refer to them via their ids or contain serializable schema for model elements.
 */
export interface Action {
    readonly kind: string
}

export function isAction(object?: unknown): object is Action {
    return hasOwnProperty(object, 'kind') && typeof(object.kind) === 'string';
}

/**
 * A request action is tied to the expectation of receiving a corresponding response action.
 * The `requestId` property is used to match the received response with the original request.
 */
export interface RequestAction<Res extends ResponseAction> extends Action {
    readonly requestId: string
}

export function isRequestAction(object?: unknown): object is RequestAction<ResponseAction> {
    return isAction(object) && hasOwnProperty(object, 'requestId')
            && typeof(object.requestId) === 'string';
}

let nextRequestId = 1;
/**
 * Generate a unique `requestId` for a request action.
 */
export function generateRequestId(): string {
    return (nextRequestId++).toString();
}

/**
 * A response action is sent to respond to a request action. The `responseId` must match
 * the `requestId` of the preceding request. In case the `responseId` is empty or undefined,
 * the action is handled as standalone, i.e. it was fired without a preceding request.
 */
export interface ResponseAction extends Action {
    readonly responseId: string
}

export function isResponseAction(object?: unknown): object is ResponseAction {
    return isAction(object) && hasOwnProperty(object, 'responseId')
            && typeof(object.responseId) === 'string'
            && object.responseId !== '';
}

/**
 * A reject action is fired to indicate that a request must be rejected.
 */
export class RejectAction implements ResponseAction {
    static readonly KIND = 'rejectRequest';
    readonly kind = RejectAction.KIND;

    constructor(public readonly message: string,
                public readonly responseId: string,
                public readonly detail?: JsonAny) {}
}

/**
 * A list of actions with a label.
 * Labeled actions are used to denote a group of actions in a user-interface context, e.g.,
 * to define an entry in the command palette or in the context menu.
 */
export class LabeledAction {
    constructor(readonly label: string, readonly actions: Action[], readonly icon?: string) { }
}

export function isLabeledAction(element: unknown): element is LabeledAction {
    return element !== undefined
        && (<LabeledAction>element).label !== undefined
        && (<LabeledAction>element).actions !== undefined;
}

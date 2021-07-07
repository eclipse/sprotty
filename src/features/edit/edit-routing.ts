/********************************************************************************
 * Copyright (c) 2018 TypeFox and others.
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
import { Action } from "../../base/actions/action";
import { Command, CommandExecutionContext, CommandReturn } from "../../base/commands/command";
import { SModelElement, SModelRoot, SParentElement } from '../../base/model/smodel';
import { TYPES } from "../../base/types";
import { Point } from "../../utils/geometry";
import { SRoutableElement, SRoutingHandle } from "../routing/model";
import { EdgeRouterRegistry } from "../routing/routing";
import { canEditRouting } from './model';

export class SwitchEditModeAction implements Action {
    static readonly KIND: string = "switchEditMode";
    kind = SwitchEditModeAction.KIND;

    constructor(public readonly elementsToActivate: string[] = [],
                public readonly elementsToDeactivate: string[] = []) {
    }
}

@injectable()
export class SwitchEditModeCommand extends Command {
    static readonly KIND: string = SwitchEditModeAction.KIND;

    @inject(EdgeRouterRegistry) edgeRouterRegistry: EdgeRouterRegistry;

    protected elementsToActivate: SModelElement[] = [];
    protected elementsToDeactivate: SModelElement[] = [];
    protected handlesToRemove: { handle: SRoutingHandle, parent: SRoutableElement, point?: Point }[] = [];

    constructor(@inject(TYPES.Action) protected readonly action: SwitchEditModeAction) {
        super();
    }

    execute(context: CommandExecutionContext): CommandReturn {
        const index = context.root.index;
        this.action.elementsToActivate.forEach(id => {
            const element = index.getById(id);
            if (element !== undefined )
                this.elementsToActivate.push(element);
        });
        this.action.elementsToDeactivate.forEach(id => {
            const element = index.getById(id);
            if (element !== undefined)
                this.elementsToDeactivate.push(element);
            if (element instanceof SRoutingHandle && element.parent instanceof SRoutableElement) {
                const parent = element.parent;
                if (this.shouldRemoveHandle(element, parent)) {
                    this.handlesToRemove.push({ handle: element, parent });
                    this.elementsToDeactivate.push(parent);
                    this.elementsToActivate.push(parent);
                }
            }
        });
        return this.doExecute(context);
    }

    protected doExecute(context: CommandExecutionContext): SModelRoot {
        this.handlesToRemove.forEach(entry => {
            entry.point = entry.parent.routingPoints.splice(entry.handle.pointIndex, 1)[0];
        });
        this.elementsToDeactivate.forEach(element => {
            if (element instanceof SRoutableElement)
                element.removeAll(child => child instanceof SRoutingHandle);
            else if (element instanceof SRoutingHandle) {
                element.editMode = false;
                if (element.danglingAnchor) {
                    if (element.parent instanceof SRoutableElement && element.danglingAnchor.original)  {
                        if (element.parent.source === element.danglingAnchor)
                            element.parent.sourceId = element.danglingAnchor.original.id;
                        else if (element.parent.target === element.danglingAnchor)
                            element.parent.targetId = element.danglingAnchor.original.id;
                        element.danglingAnchor.parent.remove(element.danglingAnchor);
                        element.danglingAnchor = undefined;
                    }
                }
            }
        });
        this.elementsToActivate.forEach(element => {
            if (canEditRouting(element) && element instanceof SParentElement) {
                const router = this.edgeRouterRegistry.get(element.routerKind);
                router.createRoutingHandles(element);
            } else if (element instanceof SRoutingHandle)
                element.editMode = true;
        });
        return context.root;
    }

    protected shouldRemoveHandle(handle: SRoutingHandle, parent: SRoutableElement): boolean {
        if (handle.kind === 'junction') {
            const route = this.edgeRouterRegistry.route(parent);
            return route.find(rp => rp.pointIndex === handle.pointIndex) === undefined;
        }
        return false;
    }

    undo(context: CommandExecutionContext): CommandReturn {
        this.handlesToRemove.forEach(entry => {
            if (entry.point !== undefined)
                entry.parent.routingPoints.splice(entry.handle.pointIndex, 0, entry.point);
        });
        this.elementsToActivate.forEach(element => {
            if (element instanceof SRoutableElement)
                element.removeAll(child => child instanceof SRoutingHandle);
            else if (element instanceof SRoutingHandle)
                element.editMode = false;
        });
        this.elementsToDeactivate.forEach(element => {
            if (canEditRouting(element)) {
                const router = this.edgeRouterRegistry.get(element.routerKind);
                router.createRoutingHandles(element);
            } else if (element instanceof SRoutingHandle)
                element.editMode = true;
        });
        return context.root;
    }

    redo(context: CommandExecutionContext): CommandReturn {
        return this.doExecute(context);
    }
}

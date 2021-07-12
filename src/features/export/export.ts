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

import { injectable, inject } from "inversify";
import { VNode } from 'snabbdom';
import { CommandExecutionContext, HiddenCommand, CommandResult } from '../../base/commands/command';
import { IVNodePostprocessor } from '../../base/views/vnode-postprocessor';
import { isSelectable } from '../select/model';
import { Action, RequestAction, generateRequestId } from '../../base/actions/action';
import { SModelElement, SModelRoot } from '../../base/model/smodel';
import { KeyListener } from '../../base/views/key-tool';
import { matchesKeystroke } from '../../utils/keyboard';
import { isExportable } from './model';
import { SvgExporter, ExportSvgAction } from './svg-exporter';
import { isViewport } from '../viewport/model';
import { isHoverable } from '../hover/model';
import { TYPES } from '../../base/types';

@injectable()
export class ExportSvgKeyListener extends KeyListener {
    keyDown(element: SModelElement, event: KeyboardEvent): Action[] {
        if (matchesKeystroke(event, 'KeyE', 'ctrlCmd', 'shift'))
            return [ new RequestExportSvgAction() ];
        else
            return [];
    }
}

export class RequestExportSvgAction implements RequestAction<ExportSvgAction> {
    static readonly KIND = 'requestExportSvg';
    readonly kind = RequestExportSvgAction.KIND;

    constructor(public readonly requestId: string = '') {}

    /** Factory function to dispatch a request with the `IActionDispatcher` */
    static create(): RequestAction<ExportSvgAction> {
        return new RequestExportSvgAction(generateRequestId());
    }
}

export class ExportSvgCommand extends HiddenCommand {
    static readonly KIND = RequestExportSvgAction.KIND;

    constructor(@inject(TYPES.Action) protected action: RequestExportSvgAction) {
        super();
    }

    execute(context: CommandExecutionContext): CommandResult {
        if (isExportable(context.root)) {
            const root = context.modelFactory.createRoot(context.root);
            if (isExportable(root)) {
                if (isViewport(root)) {
                    root.zoom = 1;
                    root.scroll = { x: 0, y: 0 };
                }
                root.index.all().forEach(element => {
                    if (isSelectable(element) && element.selected)
                        element.selected = false;
                    if (isHoverable(element) && element.hoverFeedback)
                        element.hoverFeedback = false;
                });
                return {
                    model: root,
                    modelChanged: true,
                    cause: this.action
                };
            }
        }
        return {
            model: context.root,
            modelChanged: false
        };
    }
}

@injectable()
export class ExportSvgPostprocessor implements IVNodePostprocessor {

    root: SModelRoot;

    @inject(TYPES.SvgExporter) protected svgExporter: SvgExporter;

    decorate(vnode: VNode, element: SModelElement): VNode {
        if (element instanceof SModelRoot)
            this.root = element;
        return vnode;
    }

    postUpdate(cause?: Action): void {
        if (this.root && cause !== undefined && cause.kind === RequestExportSvgAction.KIND) {
            this.svgExporter.export(this.root, cause as RequestExportSvgAction);
        }
    }
}

/********************************************************************************
 * Copyright (c) 2019 EclipseSource and others.
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
import { AutocompleteResult, AutocompleteSettings } from "autocompleter";
import { inject, injectable } from "inversify";
import { Action, isAction } from "../../base/actions/action";
import { IActionDispatcherProvider } from "../../base/actions/action-dispatcher";
import { CommandExecutionContext } from "../../base/commands/command";
import { SModelElement } from "../../base/model/smodel";
import { findParentByFeature } from "../../base/model/smodel-utils";
import { TYPES } from "../../base/types";
import { AbstractUIExtension } from "../../base/ui-extensions/ui-extension";
import { HideUIExtensionAction, ShowUIExtensionAction } from "../../base/ui-extensions/ui-extension-registry";
import { KeyListener } from "../../base/views/key-tool";
import { ViewerOptions } from "../../base/views/viewer-options";
import { toArray } from "../../utils/iterable";
import { matchesKeystroke } from "../../utils/keyboard";
import { ILogger } from "../../utils/logging";
import { isBoundsAware } from "../bounds/model";
import { isSelectable } from "../select/model";
import { isViewport } from "../viewport/model";
import { ICommandPaletteActionProviderRegistry, LabeledAction } from "./action-providers";


// import of function autocomplete(...) doesn't work
// see also https://github.com/kraaden/autocomplete/issues/13
// this is a workaround to still get the function including type support
const configureAutocomplete: (settings: AutocompleteSettings<LabeledAction>) => AutocompleteResult = require("autocompleter");

@injectable()
export class CommandPalette extends AbstractUIExtension {
    static readonly ID = "command-palette";
    readonly id = CommandPalette.ID;

    readonly containerClass = "command-palette";
    readonly xOffset = 20;
    readonly yOffset = 30;
    readonly defaultWidth = 400;

    protected inputElement: HTMLInputElement;
    protected autoCompleteResult: AutocompleteResult;

    constructor(
        @inject(TYPES.ViewerOptions) protected options: ViewerOptions,
        @inject(TYPES.IActionDispatcherProvider) protected actionDispatcherProvider: IActionDispatcherProvider,
        @inject(TYPES.ICommandPaletteActionProviderRegistry) protected actionProvider: ICommandPaletteActionProviderRegistry,
        @inject(TYPES.ILogger) protected logger: ILogger) {
        super(options, logger);
    }

    show(context: CommandExecutionContext) {
        super.show(context);
        if (this.inputElement.value) {
            this.inputElement.setSelectionRange(0, this.inputElement.value.length);
        }
        this.autoCompleteResult = configureAutocomplete(this.autocompleteSettings(context));
        this.inputElement.focus();
    }

    protected initializeUIExtension(containerElement: HTMLElement) {
        containerElement.style.position = "absolute";
        this.inputElement = document.createElement('input');
        this.inputElement.style.width = '100%';
        containerElement.appendChild(this.inputElement);
        this.inputElement.onblur = () => window.setTimeout(() => this.hide(), 200);
    }

    protected updateBeforeBecomingVisible(containerElement: HTMLElement, context: CommandExecutionContext) {
        let x = this.xOffset;
        let y = this.yOffset;
        const selectedElements = toArray(context.root.index.all().filter(e => isSelectable(e) && e.selected));
        if (selectedElements.length === 1) {
            const firstElement = selectedElements[0];
            if (isBoundsAware(firstElement)) {
                const viewport = findParentByFeature(firstElement, isViewport);
                if (viewport) {
                    x += (firstElement.bounds.x - viewport.scroll.x) * viewport.zoom;
                    y += (firstElement.bounds.y - viewport.scroll.y) * viewport.zoom;
                } else {
                    x += firstElement.bounds.x;
                    y += firstElement.bounds.y;
                }
            }
        }
        containerElement.style.left = `${x}px`;
        containerElement.style.top = `${y}px`;
        containerElement.style.width = `${this.defaultWidth}px`;
    }

    private autocompleteSettings(context: CommandExecutionContext): AutocompleteSettings<LabeledAction> {
        return {
            input: this.inputElement,
            emptyMsg: "No commands available",
            className: "command-palette-suggestions",
            minLength: -1,
            fetch: (text: string, update: (items: LabeledAction[]) => void) => {
                this.actionProvider()
                    .then(provider => provider.getActions(context))
                    .then(actions => update(this.filterActions(text, actions)))
                    .catch((reason) => this.logger.error(this, "Failed to obtain actions from command palette action providers", reason));
            },
            onSelect: (item: LabeledAction) => {
                this.executeAction(item);
                this.hide();
            },
            customize: (input: HTMLInputElement, inputRect: ClientRect | DOMRect, container: HTMLDivElement, maxHeight: number) => {
                // move container into our command palette container as this is already positioned correctly
                if (this.containerElement) {
                    this.containerElement.appendChild(container);
                }
            }
        };
    }

    protected filterActions(filterText: string, actions: LabeledAction[]): LabeledAction[] {
        return toArray(actions.filter(action => {
            const label = action.label.toLowerCase();
            const searchWords = filterText.split(' ');
            return searchWords.every(word => label.indexOf(word.toLowerCase()) !== -1);
        }));
    }

    hide() {
        super.hide();
        if (this.autoCompleteResult) {
            this.autoCompleteResult.destroy();
        }
    }

    protected executeAction(input: LabeledAction | Action[] | Action) {
        this.actionDispatcherProvider()
            .then((actionDispatcher) => actionDispatcher.dispatchAll(toActionArray(input)))
            .catch((reason) => this.logger.error(this, 'No action dispatcher available to execute command palette action', reason));
    }
}

function toActionArray(input: LabeledAction | Action[] | Action): Action[] {
    if (input instanceof LabeledAction) {
        return input.actions;
    } else if (isAction(input)) {
        return [input];
    }
    return [];
}

export class CommandPaletteKeyListener extends KeyListener {
    keyDown(element: SModelElement, event: KeyboardEvent): Action[] {
        if (matchesKeystroke(event, 'Escape')) {
            return [new HideUIExtensionAction(CommandPalette.ID)];
        } else if (matchesKeystroke(event, 'Space', 'ctrl')) {
            return [new ShowUIExtensionAction(CommandPalette.ID)];
        }
        return [];
    }
}
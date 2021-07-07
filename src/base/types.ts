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

 /* eslint-disable @typescript-eslint/naming-convention */
export const TYPES = {
    Action: Symbol('Action'),
    IActionDispatcher: Symbol('IActionDispatcher'),
    IActionDispatcherProvider: Symbol('IActionDispatcherProvider'),
    IActionHandlerInitializer: Symbol('IActionHandlerInitializer'),
    ActionHandlerRegistration: Symbol('ActionHandlerRegistration'),
    ActionHandlerRegistryProvider: Symbol('ActionHandlerRegistryProvider'),
    IAnchorComputer: Symbol('IAnchor'),
    AnimationFrameSyncer: Symbol('AnimationFrameSyncer'),
    IButtonHandler: Symbol('IButtonHandler'),
    ICommandPaletteActionProvider: Symbol('ICommandPaletteActionProvider'),
    ICommandPaletteActionProviderRegistry: Symbol('ICommandPaletteActionProviderRegistry'),
    CommandRegistration: Symbol('CommandRegistration'),
    ICommandStack: Symbol('ICommandStack'),
    CommandStackOptions: Symbol('CommandStackOptions'),
    ICommandStackProvider: Symbol('ICommandStackProvider'),
    IContextMenuItemProvider: Symbol.for("IContextMenuProvider"),
    IContextMenuProviderRegistry: Symbol.for("IContextMenuProviderRegistry"),
    IContextMenuService: Symbol.for("IContextMenuService"),
    IContextMenuServiceProvider: Symbol.for("IContextMenuServiceProvider"),
    DOMHelper: Symbol('DOMHelper'),
    IDiagramLocker: Symbol('IDiagramLocker'),
    IEdgeRouter: Symbol('IEdgeRouter'),
    IEdgeRoutePostprocessor: Symbol('IEdgeRoutePostprocessor'),
    IEditLabelValidationDecorator: Symbol('IEditLabelValidationDecorator'),
    IEditLabelValidator: Symbol('IEditLabelValidator'),
    HiddenModelViewer: Symbol('HiddenModelViewer'),
    HiddenVNodePostprocessor: Symbol('HiddenVNodeDecorator'),
    HoverState: Symbol('HoverState'),
    KeyListener: Symbol('KeyListener'),
    LayoutRegistry: Symbol('LayoutRegistry'),
    Layouter: Symbol('Layouter'),
    LogLevel: Symbol('LogLevel'),
    ILogger: Symbol('ILogger'),
    IModelFactory: Symbol('IModelFactory'),
    IModelLayoutEngine: Symbol('IModelLayoutEngine'),
    ModelRendererFactory: Symbol('ModelRendererFactory'),
    ModelSource: Symbol('ModelSource'),
    ModelSourceProvider: Symbol('ModelSourceProvider'),
    ModelViewer: Symbol('ModelViewer'),
    MouseListener: Symbol('MouseListener'),
    PatcherProvider: Symbol('PatcherProvider'),
    IPopupModelProvider: Symbol('IPopupModelProvider'),
    PopupModelViewer: Symbol('PopupModelViewer'),
    PopupMouseListener: Symbol('PopupMouseListener'),
    PopupVNodePostprocessor: Symbol('PopupVNodeDecorator'),
    SModelElementRegistration: Symbol('SModelElementRegistration'),
    SModelRegistry: Symbol('SModelRegistry'),
    ISnapper: Symbol('ISnapper'),
    SvgExporter: Symbol('SvgExporter'),
    IToolManager: Symbol('IToolManager'),
    IUIExtension: Symbol('IUIExtension'),
    UIExtensionRegistry: Symbol('UIExtensionRegistry'),
    IVNodePostprocessor: Symbol('IVNodePostprocessor'),
    ViewRegistration: Symbol('ViewRegistration'),
    ViewRegistry: Symbol('ViewRegistry'),
    IViewer: Symbol('IViewer'),
    ViewerOptions: Symbol('ViewerOptions'),
    IViewerProvider: Symbol('IViewerProvider'),
};
/* eslint-enable */

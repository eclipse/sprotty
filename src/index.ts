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

// ------------------ Base ------------------

export * from './base/actions/action';
export * from './base/actions/action-dispatcher';
export * from './base/actions/action-handler';
export * from './base/actions/diagram-locker';

export * from './base/animations/animation-frame-syncer';
export * from './base/animations/animation';
export * from './base/animations/easing';

export * from './base/commands/command';
export * from './base/commands/command-registration';
export * from './base/commands/command-stack-options';
export * from './base/commands/command-stack';

export * from './base/features/initialize-canvas';
export * from './base/features/set-model';

export * from './base/model/smodel-extension';
export * from './base/model/smodel-factory';
export * from './base/model/smodel-utils';
export * from './base/model/smodel';

export * from './base/tool-manager/tool-manager';
export * from './base/tool-manager/tool';

export * from './base/ui-extensions/ui-extension-registry';
export * from './base/ui-extensions/ui-extension';

export * from './base/views/key-tool';
export * from './base/views/mouse-tool';
export * from './base/views/thunk-view';
export * from './base/views/view';
export * from './base/views/viewer-cache';
export * from './base/views/viewer-options';
export * from './base/views/viewer';
export * from './base/views/vnode-postprocessor';
export * from './base/views/vnode-utils';

export * from './base/types';

import defaultModule from './base/di.config';
export { defaultModule };


// ------------------ Features ------------------

export * from "./features/bounds/bounds-manipulation";
export * from "./features/bounds/hidden-bounds-updater";
export * from "./features/bounds/layout";
export * from "./features/bounds/model";
export * from "./features/bounds/vbox-layout";
export * from "./features/bounds/hbox-layout";
export * from "./features/bounds/stack-layout";
export * from "./features/bounds/views";

export * from "./features/button/button-handler";
export * from "./features/button/model";

export * from "./features/command-palette/action-providers";
export * from "./features/command-palette/command-palette";

export * from "./features/context-menu/context-menu-service";
export * from "./features/context-menu/menu-providers";
export * from "./features/context-menu/mouse-listener";

export * from "./features/edge-layout/di.config";
export * from "./features/edge-layout/edge-layout";
export * from "./features/edge-layout/model";

export * from "./features/edit/create";
export * from "./features/edit/create-on-drag";
export * from "./features/edit/di.config";
export * from "./features/edit/delete";
export * from "./features/edit/edit-label";
export * from "./features/edit/edit-label-ui";
export * from "./features/edit/edit-routing";
export * from "./features/edit/model";
export * from "./features/edit/reconnect";

export * from "./features/expand/expand";
export * from "./features/expand/model";
export * from "./features/expand/views";

export * from "./features/export/export";
export * from "./features/export/model";
export * from "./features/export/svg-exporter";

export * from "./features/fade/fade";
export * from "./features/fade/model";

export * from "./features/hover/hover";
export * from "./features/hover/model";

export * from "./features/decoration/model";
export * from "./features/decoration/views";
export * from "./features/decoration/decoration-placer";

export * from "./features/edge-intersection/di.config";
export * from "./features/edge-intersection/intersection-finder";
export * from "./features/edge-intersection/sweepline";

export * from "./features/move/model";
export * from "./features/move/move";
export * from "./features/move/snap";

export * from "./features/nameable/model";

export * from "./features/open/open";
export * from "./features/open/model";

export * from "./features/routing/anchor";
export * from "./features/routing/linear-edge-router";
export * from "./features/routing/manhattan-anchors";
export * from "./features/routing/manhattan-edge-router";
export * from "./features/routing/model";
export * from "./features/routing/polyline-anchors";
export * from "./features/routing/polyline-edge-router";
export * from "./features/routing/routing";
export * from "./features/routing/views";

export * from "./features/select/model";
export * from "./features/select/select";

export * from "./features/undo-redo/undo-redo";

export * from "./features/update/model-matching";
export * from "./features/update/update-model";

export * from "./features/viewport/center-fit";
export * from "./features/viewport/model";
export * from "./features/viewport/scroll";
export * from "./features/viewport/viewport-root";
export * from "./features/viewport/viewport";
export * from "./features/viewport/zoom";

export * from "./features/zorder/zorder";

import graphModule from "./graph/di.config";

import boundsModule from "./features/bounds/di.config";
import buttonModule from "./features/button/di.config";
import commandPaletteModule from "./features/command-palette/di.config";
import contextMenuModule from "./features/context-menu/di.config";
import decorationModule from "./features/decoration/di.config";
import edgeLayoutModule from "./features/edge-layout/di.config";
import expandModule from "./features/expand/di.config";
import exportModule from "./features/export/di.config";
import fadeModule from "./features/fade/di.config";
import hoverModule from "./features/hover/di.config";
import moveModule from "./features/move/di.config";
import openModule from "./features/open/di.config";
import routingModule from "./features/routing/di.config";
import selectModule from "./features/select/di.config";
import undoRedoModule from "./features/undo-redo/di.config";
import updateModule from "./features/update/di.config";
import viewportModule from "./features/viewport/di.config";
import zorderModule from './features/zorder/di.config';

export {
    graphModule, boundsModule, buttonModule, commandPaletteModule, contextMenuModule, decorationModule,
    edgeLayoutModule, expandModule, exportModule, fadeModule, hoverModule, moveModule, openModule,
    routingModule, selectModule, undoRedoModule, updateModule, viewportModule, zorderModule
};

// ------------------ Graph ------------------

export * from "./graph/sgraph-factory";
export * from "./graph/sgraph";
export * from "./graph/views";


// ------------------ Library ------------------

export * from "./lib/modules";
export * from "./lib/generic-views";
export * from "./lib/html-views";
export * from "./lib/model";
export * from "./lib/svg-views";


// ------------------ Model Source ------------------

export * from "./model-source/commit-model";
export * from "./model-source/diagram-server";
export * from "./model-source/local-model-source";
export * from "./model-source/logging";
export * from "./model-source/model-source";
export * from "./model-source/websocket";

import modelSourceModule from "./model-source/di.config";
export { modelSourceModule };


// ------------------ Utilities ------------------

export * from "./utils/browser";
export * from "./utils/color";
export * from "./utils/geometry";
export * from "./utils/inversify";
export * from "./utils/json";
export * from "./utils/logging";
export * from "./utils/registry";

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

/** @jsx svg */
import { svg } from '../../lib/jsx';

import { VNode } from 'snabbdom';
import { IView, RenderingContext } from '../../base/views/view';
import { SIssueMarker, SIssueSeverity } from './model';
import { setClass } from '../../base/views/vnode-utils';
import { injectable } from 'inversify';

@injectable()
export class IssueMarkerView implements IView {
    render(marker: SIssueMarker, context: RenderingContext): VNode {
        const scale = 16 / 1792;
        const trafo = `scale(${scale}, ${scale})`;
        const maxSeverity = this.getMaxSeverity(marker);
        const group = <g class-sprotty-issue={true}>
            <g transform={trafo}>
                <path d={this.getPath(maxSeverity)} />
            </g>
        </g>;
        setClass(group, 'sprotty-' + maxSeverity, true);
        return group;
    }

    protected getMaxSeverity(marker: SIssueMarker): SIssueSeverity {
        let currentSeverity: SIssueSeverity = 'info';
        for (const severity of marker.issues.map(s => s.severity)) {
            if (severity === 'error' || (severity === 'warning' && currentSeverity === 'info'))
                currentSeverity = severity;
        }
        return currentSeverity;
    }

    protected getPath(severity: SIssueSeverity) {
        switch (severity) {
            case 'error':
            case 'warning':
                // eslint-disable-next-line max-len
                return "M768 128q209 0 385.5 103t279.5 279.5 103 385.5-103 385.5-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103zm128 1247v-190q0-14-9-23.5t-22-9.5h-192q-13 0-23 10t-10 23v190q0 13 10 23t23 10h192q13 0 22-9.5t9-23.5zm-2-344l18-621q0-12-10-18-10-8-24-8h-220q-14 0-24 8-10 6-10 18l17 621q0 10 10 17.5t24 7.5h185q14 0 23.5-7.5t10.5-17.5z";
            case 'info':
                // eslint-disable-next-line max-len
                return "M1024 1376v-160q0-14-9-23t-23-9h-96v-512q0-14-9-23t-23-9h-320q-14 0-23 9t-9 23v160q0 14 9 23t23 9h96v320h-96q-14 0-23 9t-9 23v160q0 14 9 23t23 9h448q14 0 23-9t9-23zm-128-896v-160q0-14-9-23t-23-9h-192q-14 0-23 9t-9 23v160q0 14 9 23t23 9h192q14 0 23-9t9-23zm640 416q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z";
        }
    }
}

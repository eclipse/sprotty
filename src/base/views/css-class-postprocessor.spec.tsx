/********************************************************************************
 * Copyright (c) 2019 TypeFox and others.
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

import "mocha";
import { expect } from "chai";
import { CssClassPostprocessor } from './css-class-postprocessor';
import { SModelElement } from '../model/smodel';

describe('CssClassPostprocessor', () => {
    it('classes are not overwritten', () => {
        const vnode = <g class-foo={true}/>;
        expect(vnode.data!.class!.foo).to.be.true;
        expect(vnode.data!.class!.bar).to.be.undefined;
        const snode = new SModelElement()
        snode.cssClasses = ['bar']
        new CssClassPostprocessor().decorate(vnode, snode)
        expect(vnode.data!.class!.foo).to.be.true;
        expect(vnode.data!.class!.bar).to.be.true;
    });
    it('subtype is appended as class', () => {
        const vnode = <g/>;
        const snode = new SModelElement();
        snode.type = "type:subtype";
        new CssClassPostprocessor().decorate(vnode, snode);
        expect(vnode.data!.class!.subtype).to.be.true;
    });
    it('type is not appended as class', () => {
        const vnode = <g/>;
        const snode = new SModelElement();
        snode.type = "type";
        new CssClassPostprocessor().decorate(vnode, snode);
        expect(vnode.data!.class).to.be.undefined;
    });
});

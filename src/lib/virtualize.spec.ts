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

/*

The test code was copied from "snabbdom-virtualize".

https://github.com/appcues/snabbdom-virtualize

*/

"use strict";

import { expect } from 'chai';
import { describe, it } from 'mocha';

import virtualize from './virtualize';
import { h, vnode } from 'snabbdom';

import setup from './test-helper';

describe("virtualize", () => {

    before(() => {
        setup();
    });

    it("should handle a single node string with no children", () => {
        expect(virtualize('<span class="foo" style="background-color: blue; padding-left: 5px;" dir="rtl" data-test-attr="test" />'))
            .to.deep.equal(
                h('span', {
                    class: { foo: true },
                    style: {
                        backgroundColor: 'blue',
                        paddingLeft: '5px'
                    },
                    attrs: {
                        dir: 'rtl',
                        'data-test-attr': 'test'
                    }
                })
            );

        expect(virtualize('<span>This is something.</span>'))
            .to.deep.equal(
                h('span', [
                    vnode(undefined, undefined, undefined, 'This is something.', undefined)
                ])
            );
    });
/*
    it("should handle a single text node", () => {
        expect(virtualize('Text content!')).to.throw();
    });
*/
    it("should return null when given nothing", () => {
        expect(virtualize()).to.be.null;
        expect(virtualize('')).to.be.null;
    });
/*
    it("should handle multiple top-level nodes, returning them as an array", () => {
        const actual = virtualize('<div><h1>Something</h1></div><span>Something more</span>');
        expect(actual).to.deep.equal([
            h('div', [
                h('h1', ['Something'])
            ]),
            h('span', ['Something more'])
        ]);
    });
*/
});


describe("#virtualizeString", () => {
    before(() => {
        setup();
    });

    it("should convert nodes with children", () => {
        expect(
            virtualize("<ul><li>One</li><li>Fish</li><li>Two</li><li>Fish</li></ul>")
        ).to.deep.equal(
            h('ul', [
                h('li', ['One']),
                h('li', ['Fish']),
                h('li', ['Two']),
                h('li', ['Fish'])
            ])
        );
    });

    it("should convert a single node with no children", () => {
        expect(virtualize("<div />")).to.deep.equal(
            h('div')
        );
    });

    it("should convert nodes with children", () => {
        expect(
            virtualize("<ul><li>One</li><li>Fish</li><li>Two</li><li>Fish</li></ul>")
        ).to.deep.equal(
            h('ul', [
                h('li', ['One']),
                h('li', ['Fish']),
                h('li', ['Two']),
                h('li', ['Fish'])
            ])
        );
    });

    it("should handle attributes on nodes", () => {
        expect(virtualize("<div title='This is it!' data-test-attr='cool' />"))
            .to.deep.equal(
                h('div', {
                    attrs: {
                        title: 'This is it!',
                        'data-test-attr': 'cool'
                    }
                })
            );
    });

    it("should handle control characters in attribute values", () => {
        const input = "<textarea placeholder='Hey Usher, \n\nAre these modals for real?!' class='placeholder-value'></textarea>";
        expect(virtualize(input)).to.deep.equal(h('textarea', {
            attrs: {
                placeholder: 'Hey Usher, \n\nAre these modals for real?!'
            },
            class: {
                'placeholder-value': true
            }
        }))
    });

    it("should handle the special style attribute on nodes", () => {
        expect(virtualize("<div title='This is it!' style='display: none' />")).to.deep.equal(
            h('div', {
                attrs: {
                    title: 'This is it!'
                },
                style: {
                    display: 'none'
                }
            })
        );

        expect(virtualize("<div style='display: none ; z-index: 17; top: 0px;' />")).to.deep.equal(
            h('div', {
                style: {
                    display: 'none',
                    zIndex: '17',
                    top: '0px'
                }
            })
        );

        expect(virtualize("<div style='' />")).to.deep.equal(h('div'));
    });

    it("should remove !important value from style values", () => {
        expect(virtualize("<div style='display: none !important; z-index: 17' />")).to.deep.equal(
            h('div', {
                style: {
                    display: 'none',
                    zIndex: '17'
                }
            })
        );
    });

    it("should handle the special class attribute on nodes", () => {
        expect(virtualize("<div class='class1 class2 class3 ' />")).to.deep.equal(
            h('div', {
                class: {
                    class1: true,
                    class2: true,
                    class3: true
                }
            })
        );

        expect(virtualize("<div class='class1' />")).to.deep.equal(
            h('div', {
                class: {
                    class1: true
                }
            })
        );

        expect(virtualize("<div class='' />")).to.deep.equal(h('div'));
    });

    it("should handle comments in HTML strings", () => {
        expect(
            virtualize('<div> <!-- First comment --> <span>Hi</span> <!-- Another comment --> Something</div>')
        ).to.deep.equal(
            h('div', [
                ' ',
                ' ',
                h('span', ['Hi']),
                ' ',
                ' Something'
            ])
        );
    });

/*
    it("should decode HTML entities, since VNodes just deal with text content", () => {
        expect(virtualize("<div>&amp; is an ampersand! and &frac12; is 1/2! and &#xA9; is copyright!</div>")).to.deep.equal(
            h('div', ['& is an ampersand! and ﾂｽ is 1/2! and ﾂｩ is copyright!'])
        );
        expect(virtualize("<a href='http://example.com?test=true&amp;something=false'>Test</a>")).to.deep.equal(
            h('a', {
                attrs: {
                    href: 'http://example.com?test=true&something=false'
                }
            }, [
                'Test'
            ])
        );
    });

    it("should keep whitespace that is between elements", () => {
        const vnodes = virtualize("<span>foo</span> <span>bar</span>");
        expect(Array.isArray(vnodes) && vnodes.length).to.equal(3)
    })
*/
});

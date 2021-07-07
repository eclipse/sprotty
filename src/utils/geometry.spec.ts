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

import "mocha";
import { expect } from "chai";
import { almostEquals, euclideanDistance, manhattanDistance, Bounds, combine, includes, ORIGIN_POINT, angleBetweenPoints, PointToPointLine } from "./geometry";

describe('geometry', () => {
    describe('euclideanDistance', () => {
        it('works as expected', () => {
            expect(euclideanDistance({x: 0, y: 0}, {x: 3, y: 4})).to.equal(5);
        });
    });

    describe('manhattanDistance', () => {
        it('works as expected', () => {
            expect(manhattanDistance({x: 0, y: 0}, {x: 3, y: 4})).to.equal(7);
        });
    });

    describe('almostEquals', () => {
        it('returns false for clearly different values', () => {
            expect(almostEquals(3, 17)).to.be.false;
        });
        it('returns true for almost equal values', () => {
            expect(almostEquals(3.12895, 3.12893)).to.be.true;
        });
    });

    describe('combine', () => {
        it('includes all corner points of the input bounds', () => {
            const b0: Bounds = { x: 2, y: 2, width: 4, height: 6 };
            const b1: Bounds = { x: 5, y: 3, width: 5, height: 10 };
            const b2 = combine(b0, b1);
            expect(includes(b2, b0)).to.be.true;
            expect(includes(b2, b1)).to.be.true;
            expect(includes(b2, { x: b0.x + b0.width, y: b0.y + b0.height })).to.be.true;
            expect(includes(b2, { x: b1.x + b1.width, y: b1.y + b1.height })).to.be.true;
            expect(includes(b2, ORIGIN_POINT)).to.be.false;
            expect(includes(b2, { x: 100, y: 100 })).to.be.false;
        });
    });

    describe('angleBetweenPoints', () => {
        it('computes a 90° angle correctly', () => {
            expect(angleBetweenPoints({ x: 2, y: 0 }, { x: 0, y: 3 })).to.equal(Math.PI / 2);
            expect(angleBetweenPoints({ x: 2, y: 0 }, { x: 0, y: -3 })).to.equal(Math.PI / 2);
        });
        it('computes a 180° angle correctly', () => {
            expect(angleBetweenPoints({ x: 2, y: 0 }, { x: -3, y: 0 })).to.equal(Math.PI);
            expect(angleBetweenPoints({ x: 0, y: 2 }, { x: 0, y: -3 })).to.equal(Math.PI);
        });
    });

    describe('PointToPointLine', () => {
        describe('angle', () => {
            it('computes a 45° angle correctly', () => {
                expect(almostEquals(new PointToPointLine({ x: 0, y: 0 }, { x: 1, y: 1 }).angle, Math.PI / 4)).to.be.true;
            });
            it('computes a 90° angle correctly', () => {
                expect(almostEquals(new PointToPointLine({ x: 0, y: 0 }, { x: 0, y: 1 }).angle, Math.PI / 2)).to.be.true;
                expect(almostEquals(new PointToPointLine({ x: 0, y: 0 }, { x: 0, y: -1 }).angle, -Math.PI / 2)).to.be.true;
            });
            it('computes a 180° angle correctly', () => {
                expect(almostEquals(new PointToPointLine({ x: 0, y: 0 }, { x: 1, y: 0 }).angle, 0)).to.be.true;
                expect(almostEquals(new PointToPointLine({ x: 0, y: 0 }, { x: -1, y: 0 }).angle, -Math.PI)).to.be.true;
            });
        });
        describe('intersection', () => {
            it('finds intersection of crossing lines', () => {
                const lineA = new PointToPointLine({ x: 0, y: 0 }, { x: 1, y: 1 });
                const lineB = new PointToPointLine({ x: 1, y: 0 }, { x: 0, y: 1 });
                const intersection = lineA.intersection(lineB);
                expect(intersection!.x).to.equal(0.5);
                expect(intersection!.y).to.equal(0.5);
            });
            it('returns `undefined` for parallel lines', () => {
                const lineA = new PointToPointLine({ x: 0, y: 0 }, { x: 1, y: 0 });
                const lineB = new PointToPointLine({ x: 0, y: 1 }, { x: 1, y: 1 });
                const intersection = lineA.intersection(lineB);
                expect(intersection).to.be.undefined;
            });
        });
    });
});

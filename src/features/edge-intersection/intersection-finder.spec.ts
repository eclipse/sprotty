/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
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

import { expect } from "chai";
import "mocha";
import "reflect-metadata";
import { EdgeRouting } from "../routing/routing";
import { IntersectionFinder } from "./intersection-finder";

describe('IntersectionFinder', () => {

    it('finds no intersection between two horizontally parallel lines', () => {
        const edgeRoutes = new EdgeRouting();
        edgeRoutes.set("1", [{ kind: "source", x: 0, y: 0 }, { kind: "target", x: 1, y: 0 }]);
        edgeRoutes.set("2", [{ kind: "source", x: 0, y: 1 }, { kind: "target", x: 1, y: 1 }]);

        const finder = new IntersectionFinder();
        const intersections = finder.find(edgeRoutes);

        expect(intersections).to.have.lengthOf(0);
    });

    it('finds no intersection between two vertically parallel lines', () => {
        const edgeRoutes = new EdgeRouting();
        edgeRoutes.set("1", [{ kind: "source", x: 0, y: 0 }, { kind: "target", x: 0, y: 1 }]);
        edgeRoutes.set("2", [{ kind: "source", x: 1, y: 0 }, { kind: "target", x: 1, y: 1 }]);

        const finder = new IntersectionFinder();
        const intersections = finder.find(edgeRoutes);

        expect(intersections).to.have.lengthOf(0);
    });

    it('finds no intersection between two lines with the same starting point', () => {
        const edgeRoutes = new EdgeRouting();
        edgeRoutes.set("1", [{ kind: "source", x: 0, y: 0 }, { kind: "target", x: 0, y: 1 }]);
        edgeRoutes.set("2", [{ kind: "source", x: 0, y: 0 }, { kind: "target", x: 1, y: 1 }]);

        const finder = new IntersectionFinder();
        const intersections = finder.find(edgeRoutes);

        expect(intersections).to.have.lengthOf(0);
    });

    it('finds no intersection between two lines with the same end point', () => {
        const edgeRoutes = new EdgeRouting();
        edgeRoutes.set("1", [{ kind: "source", x: 0, y: 1 }, { kind: "target", x: 0, y: 0 }]);
        edgeRoutes.set("2", [{ kind: "source", x: 1, y: 1 }, { kind: "target", x: 0, y: 0 }]);

        const finder = new IntersectionFinder();
        const intersections = finder.find(edgeRoutes);

        expect(intersections).to.have.lengthOf(0);
    });

    it('finds an intersection between two polylines with one segment', () => {
        const edgeRoutes = new EdgeRouting();
        edgeRoutes.set("1", [{ kind: "source", x: 0, y: 0 }, { kind: "target", x: 1, y: 1 }]);
        edgeRoutes.set("2", [{ kind: "source", x: 0, y: 1 }, { kind: "target", x: 1, y: 0 }]);

        const finder = new IntersectionFinder();
        const intersections = finder.find(edgeRoutes);

        expect(intersections).to.have.lengthOf(1);
        expect(intersections[0].routable1).to.be.equal("2");
        expect(intersections[0].routable2).to.be.equal("1");
        expect(intersections[0].segmentIndex1).to.be.equal(0);
        expect(intersections[0].segmentIndex2).to.be.equal(0);
        expect(intersections[0].intersectionPoint.x).to.be.equal(0.5);
        expect(intersections[0].intersectionPoint.y).to.be.equal(0.5);
    });

    it('finds three intersection between two polylines with three segments, each crossing', () => {
        const edgeRoutes = new EdgeRouting();
        edgeRoutes.set("1", [{ kind: "source", x: 0, y: 0 }, { kind: "linear", x: 1, y: 1 }, { kind: "linear", x: 0, y: 2 }, { kind: "target", x: 1, y: 3 }]);
        edgeRoutes.set("2", [{ kind: "source", x: 1, y: 0 }, { kind: "linear", x: 0, y: 1 }, { kind: "linear", x: 1, y: 2 }, { kind: "target", x: 0, y: 3 }]);

        const finder = new IntersectionFinder();
        const intersections = finder.find(edgeRoutes);

        expect(intersections).to.have.lengthOf(3);

        expect(intersections[0].segmentIndex1).to.be.equal(0);
        expect(intersections[0].segmentIndex2).to.be.equal(0);
        expect(intersections[0].intersectionPoint.x).to.be.equal(0.5);
        expect(intersections[0].intersectionPoint.y).to.be.equal(0.5);

        expect(intersections[1].segmentIndex1).to.be.equal(1);
        expect(intersections[1].segmentIndex2).to.be.equal(1);
        expect(intersections[1].intersectionPoint.x).to.be.equal(0.5);
        expect(intersections[1].intersectionPoint.y).to.be.equal(1.5);

        expect(intersections[2].segmentIndex1).to.be.equal(2);
        expect(intersections[2].segmentIndex2).to.be.equal(2);
        expect(intersections[2].intersectionPoint.x).to.be.equal(0.5);
        expect(intersections[2].intersectionPoint.y).to.be.equal(2.5);
    });

    it('finds an intersection among three polylines whereas only two segments intersect ("1" and "3" at (2,2))', () => {
        const edgeRoutes = new EdgeRouting();
        edgeRoutes.set("1", [{ kind: "source", x: 0, y: 0 }, { kind: "linear", x: 2, y: 0 }, { kind: "target", x: 2, y: 3 }]);
        edgeRoutes.set("2", [{ kind: "source", x: 0, y: 4 }, { kind: "target", x: 4, y: 4 }]);
        edgeRoutes.set("3", [{ kind: "source", x: 0, y: 2 }, { kind: "target", x: 4, y: 2 }]);

        const finder = new IntersectionFinder();
        const intersections = finder.find(edgeRoutes);

        expect(intersections).to.have.lengthOf(1);
        expect(intersections[0].routable1).to.be.equal("1");
        expect(intersections[0].routable2).to.be.equal("3");
        expect(intersections[0].segmentIndex1).to.be.equal(1);
        expect(intersections[0].segmentIndex2).to.be.equal(0);
        expect(intersections[0].intersectionPoint.x).to.be.equal(2);
        expect(intersections[0].intersectionPoint.y).to.be.equal(2);
    });

});

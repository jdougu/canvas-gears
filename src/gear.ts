import { Matrix, reflectZ, transform } from './matrix';
import { normalize, R4 } from './vector';

const { cos, sin, PI } = Math;

export type Face = {
    centroid: R4;
    normal: R4;
    paths: R4[][];
    color: R4;
};

export function gear(innerRadius: number, outerRadius: number, width: number, teeth: number, toothDepth: number, color: R4): Face[] {
    const r0 = innerRadius;
    const r1 = outerRadius - toothDepth / 2;
    const r2 = outerRadius + toothDepth / 2;
    const dTheta = 2 * PI / teeth / 4;

    const outer: R4[] = [];
    const inner: R4[] = [];

    for (let i = 0; i < teeth; i++) {
        const theta = i * 2 * PI / teeth;
        outer.push([r1 * cos(theta), r1 * sin(theta), width / 2, 1]);
        outer.push([r2 * cos(theta + dTheta), r2 * sin(theta + dTheta), width / 2, 1]);
        outer.push([r2 * cos(theta + 2 * dTheta), r2 * sin(theta + 2 * dTheta), width / 2, 1]);
        outer.push([r1 * cos(theta + 3 * dTheta), r1 * sin(theta + 3 * dTheta), width / 2, 1]);
        inner.push([r0 * cos(theta), r0 * sin(theta), width / 2, 1]);
    }

    const upperFace: Face = {
        centroid: [0, 0, width / 2, 0],
        normal: [0, 0, 1, 0],
        paths: [outer.reverse(), inner],
        color,
    }

    const lowerFace = transformFace(upperFace, reflectZ());

    const bore: Face[] = [];
    for (let i = 0; i < inner.length - 1; i++) {
        bore.push(quad(inner[i], inner[i + 1], width, color));
    }
    bore.push(quad(inner[inner.length - 1], inner[0], width, color));

    const gearSides: Face[] = [];
    for (let i = 0; i< outer.length - 1; i++) {
        gearSides.push(quad(outer[i], outer[i + 1], width, color));
    }
    gearSides.push(quad(outer[outer.length - 1], outer[0], width, color));

    return [
        upperFace,
        lowerFace,
        ...bore,
        ...gearSides,
    ];
}

export function transformFace(face: Face, a: Matrix): Face {
    return {
        centroid: transform(a, face.centroid),
        normal: transform(a, face.normal),
        paths: face.paths.map((path) => path.map((v) => transform(a, v))),
        color: face.color,
    }
}

function quad(a: R4, b: R4, width: number, color: R4): Face {
    return {
        centroid: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0, 1],
        normal: normalize([-(b[1] - a[1]), (b[0] - a[0]), 0, 0]),
        paths: [[
            [a[0], a[1], -width / 2, 1],
            [a[0], a[1], width / 2, 1],
            [b[0], b[1], width / 2, 1],
            [b[0], b[1], -width / 2, 1],
        ]],
        color,

    }; 
}

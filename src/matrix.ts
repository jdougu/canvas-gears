import { R4 } from './vector';

export type Matrix = [
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
];

export function frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix {
    return [
        (2 * near) / (right - left), 0, (right + left) / (right - left), 0,
        0, (2 * near) / (top - bottom), (top + bottom) / (top - bottom), 0,
        0, 0, (near + far) / (near - far), (2 * near * far) / (near - far),
        0, 0, -1, 0,
    ];
}

export function multiply(a: Matrix, b: Matrix): Matrix {
    return [
        a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12],
        a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13],
        a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14],
        a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15],

        a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12],
        a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13],
        a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14],
        a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15],

        a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12],
        a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13],
        a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14],
        a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15],

        a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12],
        a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13],
        a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14],
        a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15],
    ];
}

export function multiplyAll(...matrices: [Matrix, Matrix, ...Matrix[]]): Matrix {
    let result = multiply(matrices[0], matrices[1]);
    for (let i = 2; i < matrices.length; i++) {
        result = multiply(result, matrices[i]);
    }
    return result;
}

export function reflectZ(): Matrix {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, -1, 0,
        0, 0, 0, 1,
    ];
}

export function rotateAboutX(theta: number): Matrix {
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    return [
        1, 0, 0, 0,
        0, c, -s, 0,
        0, s, c, 0,
        0, 0, 0, 1,
    ];
}

export function rotateAboutY(theta: number): Matrix {
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    return [
        c, 0, s, 0,
        0, 1, 0, 0,
        -s, 0, c, 0,
        0, 0, 0, 1,
    ];
}

export function rotateAboutZ(theta: number): Matrix {
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    return [
        c, -s, 0, 0,
        s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ];
}

export function scale(x: number, y: number, z: number): Matrix {
    return [
        x, 0, 0, 0,
        0, y, 0, 0,
        0, 0, z, 0,
        0, 0, 0, 1,
    ];
}

export function transform(a: Matrix, v: R4): R4 {
    return [
        a[0] * v[0] + a[1] * v[1] + a[2] * v[2] + a[3] * v[3],
        a[4] * v[0] + a[5] * v[1] + a[6] * v[2] + a[7] * v[3],
        a[8] * v[0] + a[9] * v[1] + a[10] * v[2] + a[11] * v[3],
        a[12] * v[0] + a[13] * v[1] + a[14] * v[2] + a[15] * v[3],
    ];
}

export function translate(x: number, y: number, z: number): Matrix {
    return [
        1, 0, 0, x,
        0, 1, 0, y,
        0, 0, 1, z,
        0, 0, 0, 1,
    ];
}

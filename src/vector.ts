export type R4 = [number, number, number, number];

export function add(u: R4, v: R4): R4 {
    return [u[0] + v[0], u[1] + v[1], u[2] + v[2], 0];
}

export function dot(u: R4, v: R4) {
    return u[0] * v[0] + u[1] * v[1] + u[2] * v[2] + u[3] * v[3];
}

export function normalize(v: R4): R4 {
    const length = Math.hypot(v[0], v[1], v[2]);
    return [v[0] / length, v[1] / length, v[2] / length, 0];
}

export function scalarMultiply(a: number, v: R4): R4 {
    return [a * v[0], a * v[1], a * v[2], 0];
}

export function subtract(u: R4, v: R4): R4 {
    return [u[0] - v[0], u[1] - v[1], u[2] - v[2], 0];
}

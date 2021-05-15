import { Face, gear, transformFace } from './gear';
import { frustum, Matrix, multiply, multiplyAll, rotateAboutX, rotateAboutY, rotateAboutZ, transform, translate } from './matrix';
import { add, dot, normalize, R4, scalarMultiply, subtract } from './vector';

const red: R4 = [0.8, 0.1, 0.0, 1];
const green: R4 = [0.0, 0.8, 0.2, 1];
const blue: R4 = [0.2, 0.2, 1, 1];

const gear1 = gear(1, 4, 1, 20, 0.7, red);
const gear2 = gear(0.5, 2, 2, 10, 0.7, green);
const gear3 = gear(1.3, 2, 0.5, 10, 0.7, blue);

const lightPosition: R4 = [5, 5, 10, 0];
let projectedLightPosition: R4;

let xRotation = 20 / 180 * Math.PI;
let yRotation = 30 / 180 * Math.PI;
const rotationIncrement = Math.PI * 5 / 180;

let projectionMatrix: Matrix;
const modelViewMatrix = translate(0, 0, -40);

let wireframe: boolean = false;

let pointerPosition: [number, number] | undefined;

function makeScene(theta: number) {
    let scene = [
        ...gear1.map((face) => transformFace(face, multiply(translate(-3, -2, 0), rotateAboutZ(theta),))),
        ...gear2.map((face) => transformFace(face, multiply(translate(3.1, -2, 0), rotateAboutZ(-2 * theta - 9),))),
        ...gear3.map((face) => transformFace(face, multiply(translate(-3.1, 4.2, 0), rotateAboutZ(-2 * theta - 25),))),
    ];

    const a = multiplyAll(
        projectionMatrix,
        modelViewMatrix,
        rotateAboutX(xRotation),
        rotateAboutY(yRotation),
    );

    const b = multiply(projectionMatrix, modelViewMatrix);
    projectedLightPosition = transform(b, lightPosition);

    scene = scene.map((face) => transformFace(face, a));
    scene = scene.filter((face) => dot(face.normal, [0, 0, 1, 0]) < 0);
    scene.sort((a, b) => a.centroid[2] > b.centroid[2] ? -1 : 1);
    
    return scene;
}

function toDevice(v: R4, width: number, height: number): R4 {
    return [(v[0] / v[3] + 1) * (width / 2), ((v[1] * -1) / v[3] + 1) * (height / 2), 0, 0];
}

function clamp(x: number): number {
    return x < 0 ? 0 : x > 255 ? 255 : Math.round(x);
}

function calculateColor(face: Face): string {
    const toLight = normalize(subtract(projectedLightPosition, face.centroid));
    let d = dot(toLight, normalize(face.normal));
    d = d < 0 ? 0 : d * 2;
    const diffuse: R4 = scalarMultiply(d, face.color);
    const ambient = scalarMultiply(0.2, face.color);
    const total = add(ambient, diffuse);
    const r = clamp(total[0] * 255);
    const g = clamp(total[1] * 255);
    const b = clamp(total[2] * 255);
    return `rgba(${r},${g},${b},1)`;
}

function drawScene(context: CanvasRenderingContext2D, scene: Face[]) {
    const { width, height } = context.canvas;
    
    scene.forEach((face) => {
        context.strokeStyle = context.fillStyle = calculateColor(face);
        context.beginPath();
        for (let path of face.paths) {
            const start = toDevice(path[0], width, height);
            context.moveTo(start[0], start[1]);
            for (let i = 1; i < path.length; i++) {
                const next = toDevice(path[i], width, height);
                context.lineTo(next[0], next[1]);
            }
            context.closePath();
        }
        if (!wireframe) {
            context.fill();
        }
        context.stroke();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementsByTagName('canvas')[0];
    resize(canvas);
    window.addEventListener('resize', () => resize(canvas));
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('pointerdown', (ev) => pointerPosition = [ev.x, ev.y]);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', () => pointerPosition = undefined);

    const context = canvas.getContext('2d', { alias: false }) as CanvasRenderingContext2D;
    let mSeconds = Date.now();
    const fpsBuffer = [0];

    let theta = 0;

    function animate() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        let scene = makeScene(theta);
        drawScene(context, scene);

        const mSecondsDelta = Date.now() - mSeconds;
        mSeconds = Date.now();

        const fps = Math.round(1000 / mSecondsDelta);
        fpsBuffer.push(fps);
        if (fpsBuffer.length > 30) {
            fpsBuffer.shift();
        }
        const average = fpsBuffer.reduce((a, c) => a + c, 0) / fpsBuffer.length;
        document.getElementById('fps')!.innerText = Math.floor(average).toString();

        theta += (mSecondsDelta / 1000) * 1.22;

        window.requestAnimationFrame(animate);
    }

    window.requestAnimationFrame(animate);
});

function handleKeyDown(ev: KeyboardEvent) {
    switch (ev.key) {
        case 'ArrowLeft':
            yRotation += rotationIncrement;
            break;
        case 'ArrowRight':
            yRotation -= rotationIncrement;
            break;
        case 'ArrowUp':
            xRotation += rotationIncrement;
            break;
        case 'ArrowDown':
            xRotation -= rotationIncrement;
            break;
        case 'w':
            wireframe = !wireframe;
            break;
    }
}

function resize(canvas: HTMLCanvasElement) {
    const { width, height } = canvas.parentElement!.getBoundingClientRect();

    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    const h = height / width;
    projectionMatrix = frustum(-1, 1, -h, h, 5, 60);
}

function handlePointerMove(ev: PointerEvent) {
    if (pointerPosition) {
        const deltaX = ev.x - pointerPosition[0];
        const deltaY = ev.y - pointerPosition[1];
        yRotation += deltaX / 200;
        xRotation += deltaY / 200;
        pointerPosition = [ev.x, ev.y];
    }
}

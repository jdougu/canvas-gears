(() => {
  // src/matrix.ts
  function frustum(left, right, bottom, top, near, far) {
    return [
      2 * near / (right - left),
      0,
      (right + left) / (right - left),
      0,
      0,
      2 * near / (top - bottom),
      (top + bottom) / (top - bottom),
      0,
      0,
      0,
      (near + far) / (near - far),
      2 * near * far / (near - far),
      0,
      0,
      -1,
      0
    ];
  }
  function multiply(a, b) {
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
      a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15]
    ];
  }
  function multiplyAll(...matrices) {
    let result = multiply(matrices[0], matrices[1]);
    for (let i = 2; i < matrices.length; i++) {
      result = multiply(result, matrices[i]);
    }
    return result;
  }
  function reflectZ() {
    return [
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      -1,
      0,
      0,
      0,
      0,
      1
    ];
  }
  function rotateAboutX(theta) {
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    return [
      1,
      0,
      0,
      0,
      0,
      c,
      -s,
      0,
      0,
      s,
      c,
      0,
      0,
      0,
      0,
      1
    ];
  }
  function rotateAboutY(theta) {
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    return [
      c,
      0,
      s,
      0,
      0,
      1,
      0,
      0,
      -s,
      0,
      c,
      0,
      0,
      0,
      0,
      1
    ];
  }
  function rotateAboutZ(theta) {
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    return [
      c,
      -s,
      0,
      0,
      s,
      c,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ];
  }
  function transform(a, v) {
    return [
      a[0] * v[0] + a[1] * v[1] + a[2] * v[2] + a[3] * v[3],
      a[4] * v[0] + a[5] * v[1] + a[6] * v[2] + a[7] * v[3],
      a[8] * v[0] + a[9] * v[1] + a[10] * v[2] + a[11] * v[3],
      a[12] * v[0] + a[13] * v[1] + a[14] * v[2] + a[15] * v[3]
    ];
  }
  function translate(x, y, z) {
    return [
      1,
      0,
      0,
      x,
      0,
      1,
      0,
      y,
      0,
      0,
      1,
      z,
      0,
      0,
      0,
      1
    ];
  }

  // src/vector.ts
  function add(u, v) {
    return [u[0] + v[0], u[1] + v[1], u[2] + v[2], 0];
  }
  function dot(u, v) {
    return u[0] * v[0] + u[1] * v[1] + u[2] * v[2] + u[3] * v[3];
  }
  function normalize(v) {
    const length = Math.hypot(v[0], v[1], v[2]);
    return [v[0] / length, v[1] / length, v[2] / length, 0];
  }
  function scalarMultiply(a, v) {
    return [a * v[0], a * v[1], a * v[2], 0];
  }
  function subtract(u, v) {
    return [u[0] - v[0], u[1] - v[1], u[2] - v[2], 0];
  }

  // src/gear.ts
  var {cos, sin, PI} = Math;
  function gear(innerRadius, outerRadius, width, teeth, toothDepth, color) {
    const r0 = innerRadius;
    const r1 = outerRadius - toothDepth / 2;
    const r2 = outerRadius + toothDepth / 2;
    const dTheta = 2 * PI / teeth / 4;
    const outer = [];
    const inner = [];
    for (let i = 0; i < teeth; i++) {
      const theta = i * 2 * PI / teeth;
      outer.push([r1 * cos(theta), r1 * sin(theta), width / 2, 1]);
      outer.push([r2 * cos(theta + dTheta), r2 * sin(theta + dTheta), width / 2, 1]);
      outer.push([r2 * cos(theta + 2 * dTheta), r2 * sin(theta + 2 * dTheta), width / 2, 1]);
      outer.push([r1 * cos(theta + 3 * dTheta), r1 * sin(theta + 3 * dTheta), width / 2, 1]);
      inner.push([r0 * cos(theta), r0 * sin(theta), width / 2, 1]);
    }
    const upperFace = {
      centroid: [0, 0, width / 2, 0],
      normal: [0, 0, 1, 0],
      paths: [outer.reverse(), inner],
      color
    };
    const lowerFace = transformFace(upperFace, reflectZ());
    const bore = [];
    for (let i = 0; i < inner.length - 1; i++) {
      bore.push(quad(inner[i], inner[i + 1], width, color));
    }
    bore.push(quad(inner[inner.length - 1], inner[0], width, color));
    const gearSides = [];
    for (let i = 0; i < outer.length - 1; i++) {
      gearSides.push(quad(outer[i], outer[i + 1], width, color));
    }
    gearSides.push(quad(outer[outer.length - 1], outer[0], width, color));
    return [
      upperFace,
      lowerFace,
      ...bore,
      ...gearSides
    ];
  }
  function transformFace(face, a) {
    return {
      centroid: transform(a, face.centroid),
      normal: transform(a, face.normal),
      paths: face.paths.map((path) => path.map((v) => transform(a, v))),
      color: face.color
    };
  }
  function quad(a, b, width, color) {
    return {
      centroid: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0, 1],
      normal: normalize([-(b[1] - a[1]), b[0] - a[0], 0, 0]),
      paths: [[
        [a[0], a[1], -width / 2, 1],
        [a[0], a[1], width / 2, 1],
        [b[0], b[1], width / 2, 1],
        [b[0], b[1], -width / 2, 1]
      ]],
      color
    };
  }

  // src/index.ts
  var red = [0.8, 0.1, 0, 1];
  var green = [0, 0.8, 0.2, 1];
  var blue = [0.2, 0.2, 1, 1];
  var gear1 = gear(1, 4, 1, 20, 0.7, red);
  var gear2 = gear(0.5, 2, 2, 10, 0.7, green);
  var gear3 = gear(1.3, 2, 0.5, 10, 0.7, blue);
  var lightPosition = [5, 5, 10, 0];
  var projectedLightPosition;
  var xRotation = 20 / 180 * Math.PI;
  var yRotation = 30 / 180 * Math.PI;
  var rotationIncrement = Math.PI * 5 / 180;
  var projectionMatrix;
  var modelViewMatrix = translate(0, 0, -40);
  var wireframe = false;
  var pointerPosition;
  var numberOfGears = 1;
  function makeScene(theta) {
    let scene = [];
    for (let i = 0; i < numberOfGears; i++) {
      scene.push(...[
        ...gear1.map((face) => transformFace(face, multiply(translate(-3, -2, i * -3), rotateAboutZ(theta)))),
        ...gear2.map((face) => transformFace(face, multiply(translate(3.1, -2, i * -3), rotateAboutZ(-2 * theta - 9)))),
        ...gear3.map((face) => transformFace(face, multiply(translate(-3.1, 4.2, i * -3), rotateAboutZ(-2 * theta - 25))))
      ]);
    }
    const a = multiplyAll(projectionMatrix, modelViewMatrix, rotateAboutX(xRotation), rotateAboutY(yRotation));
    const b = multiply(projectionMatrix, modelViewMatrix);
    projectedLightPosition = transform(b, lightPosition);
    scene = scene.map((face) => transformFace(face, a));
    scene = scene.filter((face) => dot(face.normal, [0, 0, 1, 0]) < 0);
    scene.sort((a2, b2) => a2.centroid[2] > b2.centroid[2] ? -1 : 1);
    return scene;
  }
  function toDevice(v, width, height) {
    return [(v[0] / v[3] + 1) * (width / 2), (v[1] * -1 / v[3] + 1) * (height / 2), 0, 0];
  }
  function clamp(x) {
    return x < 0 ? 0 : x > 255 ? 255 : Math.round(x);
  }
  function calculateColor(face) {
    const toLight = normalize(subtract(projectedLightPosition, face.centroid));
    let d = dot(toLight, normalize(face.normal));
    d = d < 0 ? 0 : d * 2;
    const diffuse = scalarMultiply(d, face.color);
    const ambient = scalarMultiply(0.2, face.color);
    const total = add(ambient, diffuse);
    const r = clamp(total[0] * 255);
    const g = clamp(total[1] * 255);
    const b = clamp(total[2] * 255);
    return `rgba(${r},${g},${b},1)`;
  }
  function drawScene(context, scene) {
    const {width, height} = context.canvas;
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
  document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementsByTagName("canvas")[0];
    resize(canvas);
    window.addEventListener("resize", () => resize(canvas));
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", (ev) => pointerPosition = [ev.x, ev.y]);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", () => pointerPosition = void 0);
    const context = canvas.getContext("2d", {alias: false});
    let mSeconds = Date.now();
    const fpsBuffer = [0];
    let theta = 0;
    function animate() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      let scene = makeScene(theta);
      drawScene(context, scene);
      const mSecondsDelta = Date.now() - mSeconds;
      mSeconds = Date.now();
      const fps = Math.round(1e3 / mSecondsDelta);
      fpsBuffer.push(fps);
      if (fpsBuffer.length > 30) {
        fpsBuffer.shift();
      }
      const average = fpsBuffer.reduce((a, c) => a + c, 0) / fpsBuffer.length;
      document.getElementById("fps").innerText = Math.floor(average).toString();
      theta += mSecondsDelta / 1e3 * 1.22;
      window.requestAnimationFrame(animate);
    }
    window.requestAnimationFrame(animate);
  });
  function handleKeyDown(ev) {
    switch (ev.key) {
      case "ArrowLeft":
        yRotation += rotationIncrement;
        break;
      case "ArrowRight":
        yRotation -= rotationIncrement;
        break;
      case "ArrowUp":
        xRotation += rotationIncrement;
        break;
      case "ArrowDown":
        xRotation -= rotationIncrement;
        break;
      case "w":
        wireframe = !wireframe;
        break;
      case "=":
        numberOfGears++;
        break;
      case "-":
        if (numberOfGears > 1) {
          numberOfGears--;
        }
        break;
    }
  }
  function resize(canvas) {
    const {width, height} = canvas.parentElement.getBoundingClientRect();
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    const h = height / width;
    projectionMatrix = frustum(-1, 1, -h, h, 5, 60);
  }
  function handlePointerMove(ev) {
    if (pointerPosition) {
      const deltaX = ev.x - pointerPosition[0];
      const deltaY = ev.y - pointerPosition[1];
      yRotation += deltaX / 200;
      xRotation += deltaY / 200;
      pointerPosition = [ev.x, ev.y];
    }
  }
})();

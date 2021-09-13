//gl context initilized
const canvas = document.getElementById('gl-canvas');
const gl = canvas.getContext('webgl2');



//Shader para posiciones
const vertexShader = `#version 300 es
precision mediump float;

in vec3 position;
in vec3 iColor;
out vec3 oColor;
uniform float iTime;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

void main()
{
    gl_Position = projectionMatrix * viewMatrix * (modelMatrix * vec4(position, 1));
    oColor = iColor;
}
`;

//shader para color
const fragmentShader = `#version 300 es
precision mediump float;

out vec4 fragColor;
in vec3 oColor;

void main()
{
    fragColor = vec4(oColor, 1);
}
`;

const vs = gl.createShader(gl.VERTEX_SHADER);
const fs = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(vs, vertexShader);
gl.shaderSource(fs, fragmentShader);

gl.compileShader(vs);
gl.compileShader(fs);

if(!gl.getShaderParameter(vs, gl.COMPILE_STATUS)){
    console.error(gl.getShaderInfoLog(vs));
}
if(!gl.getShaderParameter(fs, gl.COMPILE_STATUS)){
    console.error(gl.getShaderInfoLog(fs));
}

const program = gl.createProgram();
gl.attachShader(program, vs);
gl.attachShader(program, fs);
gl.linkProgram(program);

if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
    console.error(gl.getProgramInfoLog(program));
}

gl.useProgram(program);

//Cube vertices
const cubeCoords = [
    //cabeza
    0,6,1, 10,6,1, 10,10,1, 0,10,1, //conexion ojos
    0,5,2, 10,5,2, 10,9,2, 0,9,2, //fondo conexion ojos
    -6,3,1, 2,3,1, 2,13,1, -6,13,1, //cuenco ojo izq
    8,3,1, 16,3,1, 16,13,1, 8,13,1, //cuenco ojo der
    1,-6,1, 9,-6,1, 9,10,1, 1,10,1, //cara
    -5,4,1, 1,4,1, 1,12,1, -5,12,1, //fondo ojo izq
    9,4,1, 15,4,1, 15,12,1, 9,12,1, //fondo ojo der
    -4,5,2, 0,5,2, 0,11,2, -4,11,2, //ojo izq
    9.5,5,2, 13.5,5,2, 13.5,11,2, 9.5,11,2, //ojo der
    -2.5,7.5,3, -1.5,7.5,3, -1.5,8.5,3, -2.5,8.5,3, //pupila izq
    11,7.5,2, 12,7.5,2, 12,8.5,2, 11,8.5,2, //pipula der
    1.5,-5,1, 8.5,-5,1, 8.5,-1,1, 1.5,-1,1, //fondo dientes
    1.7,-4.7,1, 8.3,-4.7,1, 8.3,-1.3,1, 1.7,-1.3,1, //dientes
    1.5,-3.2,1, 8.5,-3.2,1, 8.5,-2.9,1, 1.5,-2.9,1, //separacion media dientes
    3.1,-5,1, 3.4,-5,1, 3.4,-1,1, 3.1,-1,1, //separacion izq dientes
    5,-5,1, 5.3,-5,1, 5.3,-1,1, 5,-1,1, //separacion mid dientes
    6.7,-5,1, 7,-5,1, 7,-1,1, 6.7,-1,1, //separacion der dientes
    -8,-20.8,-1, 2,-20.8,-1, 2,-5,-1, -8,-5,-1, //torso
    -5,-5,-1, -1,-5,-1, -1,-2,-1, -5,-2,-1, //base cuello
    -4,-5,-1, -2,-5,-1, -2,0,-1, -4,0,-1, //cuello 1
    -4,-2,-1, 2,-2,-1, 2,0,-1, -4,0,-1, //cuello 2
    -16,-11,-2, -7,-11,-2, -7,-8,-2, -16,-8,-2, //brazo izq 1
    -16,-20,-2, -13,-20,-2, -13,-8,-2, -16,-8,-2, //brazo izq 2
    2,-11,-2, 11,-11,-2, 11,-8,-2, 2,-8,-2, //brazo der 1
    11,-20,-2, 8,-20,-2, 8,-8,-2, 11,-8,-2, //brazo der 2
    22,-22,-4, -22,-22,-4, -22,22,-4, 22,22,-4, //fondo
    0,4,-3, 10,4,-3, 10,11.4,-3, 0,11.4,-3, //outline conexion ojos
    -7.1,2.6,-3, 2.8,2.6,-3, 2.8,14.7,-3, -7.1,14.7,-3, //outline cuenco ojo izq
    7.9,2.6,-3, 17.9,2.6,-3, 17.9,14.7,-3, 7.9,14.7,-3, //outline cuenco ojo der
    0.5,-6.7,0, 9.7,-6.7,0, 9.7,10,0, 0.5,10,0, //outline cara
    -4.7,-2.7,-3, 2,-2.7,-3, 2,0.6,-3, -4.7,0.6,-3, //outline cuello
    -5.8,-6,-3, -0.5,-6,-3, -0.5,-1.5,-3, -5.8,-1.5,-3, //outline base cuello
    -9,-22,-3, 2.7,-22,-3, 2.7,-4.6,-3, -9,-4.6,-3, //outline torso
    -16.9,-11.9,-3, -7,-11.9,-3, -7,-7.5,-3, -16.9,-7.5,-3, //outline brazo izq 1
    -16.9,-21,-3, -12.6,-21,-3, -12.6,-8,-3, -16.9,-8,-3, //outline brazo izq 2
    2,-11.9,-3, 11.8,-11.9,-3, 11.8,-7.5,-3, 2,-7.5,-3, //outline brazo der 1
    11.8,-21,-3, 7.5,-21,-3, 7.5,-8,-3, 11.8,-8,-3, //outline brazo der 2
    
];

const vertexColorArray = [
    //cabeza
    1,0.2,0, 1,0.2,0, 1,0.2,0, 1,0.2,0, //color conexion ojos
    0,0,0, 0,0,0, 0,0,0, 0,0,0, //color fondo conexion ojos
    1,0.2,0, 1,0.2,0, 1,0.2,0, 1,0.2,0, //color cuenco ojo izq
    1,0.2,0, 1,0.2,0, 1,0.2,0, 1,0.2,0, //color cuenco ojo der
    1,0.2,0, 1,0.2,0, 1,0.2,0, 1,0.2,0, //color cara
    0,0,0, 0,0,0, 0,0,0, 0,0,0, //color fondo ojo izq
    0,0,0, 0,0,0, 0,0,0, 0,0,0, //color fondo ojo der
    1,0.7,0.2, 1,0.7,0.2, 1,0.7,0.2, 1,0.7,0.2, //color ojo izq
    1,0.7,0.2, 1,0.7,0.2, 1,0.7,0.2, 1,0.7,0.2, //color ojo der
    0,0,0, 0,0,0, 0,0,0, 0,0,0, //color pupila izq
    0,0,0, 0,0,0, 0,0,0, 0,0,0, //color pupila der
    0,0,0, 0,0,0, 0,0,0, 0,0,0, //color fondo dientes
    0,0.5,0.2, 0,0.5,0.2, 0,0.5,0.2, 0,0.5,0.2, //color dientes
    0,0,0, 0,0,0, 0,0,0, 0,0,0, //color separacion media dientes
    0,0,0, 0,0,0, 0,0,0, 0,0,0, //color separacion izq dientes
    0,0,0, 0,0,0, 0,0,0, 0,0,0, //color separacion mid dientes
    0,0,0, 0,0,0, 0,0,0, 0,0,0, //color separacion der dientes
    0.8,0.2,0, 0.8,0.2,0, 0.8,0.2,0, 0.8,0.2,0, //color torso
    0.8,0.2,0, 0.8,0.2,0, 0.8,0.2,0, 0.8,0.2,0, //color base cuello
    0.5,0.2,0, 0.5,0.2,0, 0.5,0.2,0, 0.5,0.2,0, //color cuello 1
    0.5,0.2,0, 0.5,0.2,0, 0.5,0.2,0, 0.5,0.2,0, //color cuello 2
    0.5,0.2,0, 0.5,0.2,0, 0.5,0.2,0, 0.5,0.2,0, //color brazo izq 1
    0.5,0.2,0, 0.5,0.2,0, 0.5,0.2,0, 0.5,0.2,0, //color brazo izq 2
    0.5,0.2,0, 0.5,0.2,0, 0.5,0.2,0, 0.5,0.2,0, //color brazo der 1
    0.5,0.2,0, 0.5,0.2,0, 0.5,0.2,0, 0.5,0.2,0, //color brazo der 2
    1,1,1, 1,1,1, 1,1,1, 1,1,1, //color fondo
    0,0,0, 0,0,0, 0,0,0, 0,0,0, //color outline conexion ojos
    0,0,0, 0,0,0, 0,0,0, 0,0,0, //color outline cuenco ojo izq
    0,0,0, 0,0,0, 0,0,0, 0,0,0, //color outline cuenco ojo der
    0,0,0, 0,0,0, 0,0,0, 0,0,0, //color outline cara
    0,0,0, 0,0,0, 0,0,0, 0,0,0, //color outline cuello
    0,0,0, 0,0,0, 0,0,0, 0,0,0, //color outline base cuello
    0,0,0, 0,0,0, 0,0,0, 0,0,0, //color outline torso
    0,0,0, 0,0,0, 0,0,0, 0,0,0, //color outline brazo izq 1
    0,0,0, 0,0,0, 0,0,0, 0,0,0, //color outline brazo izq 2
    0,0,0, 0,0,0, 0,0,0, 0,0,0, //color outline brazo der 1
    0,0,0, 0,0,0, 0,0,0, 0,0,0, //color outline brazo der 2

];

const indexArray = [
    //cabeza
    0,1,2, 0,2,3, //conexion ojos
    4,5,6, 4,6,7, //fondo conexion ojos
    8,9,10, 8,10,11, //cuenco ojo izq
    12,13,14, 12,14,15, //cuenco ojo der
    16,17,18, 16,18,19, //cara
    20,21,22, 20,22,23, //fondo ojo izq
    24,25,26, 24,26,27, //fondo ojo der
    28,29,30, 28,30,31, //ojo izq
    32,33,34, 32,34,35, //ojo der
    36,37,38, 36,38,39, //pupila izq
    40,41,42, 40,42,43, //pupila der
    44,45,46, 44,46,47, //fondo dientes
    48,49,50, 48,50,51, //dientes
    52,53,54, 52,54,55, //separacion media dientes
    56,57,58, 56,58,59, //separacion izq dientes
    60,61,62, 60,62,63, //separacion mid dientes
    64,65,66, 64,66,67, //separacion der dientes
    68,69,70, 68,70,71, //torso
    72,73,74, 72,74,75, //base cuello
    76,77,78, 76,78,79, //cuello 1
    80,81,82, 80,82,83, //cuello 2
    84,85,86, 84,86,87, //brazo izq 1
    88,89,90, 88,90,91, //brazo izq 2
    92,93,94, 92,94,95, //brazo der 1
    96,97,98, 96,98,99, //brazo der 2
    100,101,102, 100,102,103, //fondo
    104,105,106, 104,106,107, //outline conexion ojos
    108,109,110, 108,110,111, //outline cuenco ojo izq
    112,113,114, 112,114,115, //outline cuenco ojo der
    116,117,118, 116,118,119, //outline cara
    120,121,122, 120,122,123, //outline cuello
    124,125,126, 124,126,127, //outline base cuello
    128,129,130, 128,130,131, //outline torso
    132,133,134, 132,134,135, //outline brazo izq 1
    136,137,138, 136,138,139, //outline brazo izq 2
    140,141,142, 140,142,143, //outline brazo der 1
    144,145,146, 144,146,147, //outline brazo der 2
];

const indexArrayBuffer = gl.createBuffer();
const vertexColorBuffer = gl.createBuffer();
const positionBuffer = gl.createBuffer();

let now = Date.now();

const uniformTime = gl.getUniformLocation(program, 'iTime');
const uModelMatrix = gl.getUniformLocation(program, 'modelMatrix');
const uViewMatrix = gl.getUniformLocation(program, 'viewMatrix');
const uProjectionMatrix = gl.getUniformLocation(program, 'projectionMatrix');
const attribVertexColor = gl.getAttribLocation(program, 'iColor');
const attribPosition = gl.getAttribLocation(program, 'position');

const modelMatrix = mat4.create();
const viewMatrix = mat4.create();
const projectionMatrix = mat4.create();

const axis = {
    x:0,
    y:0
};

const ArrowKeys = ()=>{
    addEventListener('keydown', ({key}) => {
        console.log(key);
        axis.x = key === 'a' ? -1 : key === 'd' ? 1 : 0;
        axis.y = key === 's' ? -1 : key === 'w' ? 1 : 0;
        //console.log(axis);
    });
    addEventListener('keyup', ({key}) => {
        console.log(key);
        axis.x = (key === 'a' || key === 'd') ? 0 : axis.x;
        axis.y = (key === 's' || key === 'w') ? 0 : axis.y;
        //console.log(axis);
    });
};



ArrowKeys();

mat4.scale(
    modelMatrix,
    modelMatrix,
    [0.1, 0.1, 0.1]
);

mat4.translate(
    modelMatrix,
    modelMatrix,
    [0, 0, -50]
);



const update = ()=> {
    //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexArrayBuffer);

    const deltaTime = (Date.now() - now) / 1000;
    now = Date.now();
    //console.log(deltaTime/1000);

    /* mat4.rotate(
        modelMatrix,
        modelMatrix,
        deltaTime * 1,
        [1, 1, 0]
    ); */

    mat4.translate(
        modelMatrix,
        modelMatrix,
        [axis.x * deltaTime, axis.y * deltaTime, 0]
    );
    
    
    mat4.perspective(
        projectionMatrix,
        45 * (Math.PI / 180),
        canvas.clientWidth / canvas.clientHeight,
        1,
        1000
    );
    

    //clear screen
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    
    gl.uniform1f(uniformTime, deltaTime / 1000);

    gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(uViewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);

    //Color
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColorArray), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(attribVertexColor);
    gl.vertexAttribPointer(attribVertexColor, 3, gl.FLOAT, gl.FALSE, 0, 0);

    //Reservamos memoria en la tarjeta de video (Vram)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeCoords), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(attribPosition);
    gl.vertexAttribPointer(attribPosition, 3, gl.FLOAT, gl.FALSE, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexArrayBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArray), gl.STATIC_DRAW);

    gl.drawElements(gl.TRIANGLES, indexArray.length, gl.UNSIGNED_SHORT, 0);
    //gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(update);
};

requestAnimationFrame(update);
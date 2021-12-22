varying vec2 _uv;
varying vec3 _normal;
varying vec3 _cameraP;
varying vec3 _eyeP;

void main() {
    _uv = uv;
    _normal = normal;
    _cameraP = cameraPosition;

    vec4 worldP = modelViewMatrix * vec4(position, 1.0);
    _eyeP = normalize(worldP.xyz - abs(cameraPosition));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

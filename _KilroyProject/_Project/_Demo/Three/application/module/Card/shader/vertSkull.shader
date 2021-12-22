varying vec2 _uv;
varying vec3 _normal;
varying vec3 _position;
varying vec3 _cameraP;
varying vec3 _eyeP;

void main() {
    _uv = uv;
    _normal = normal;
    _position = position;
    _cameraP = cameraPosition;

    vec4 worldPosition = modelViewMatrix * vec4(position, 1.0);
    _eyeP = normalize(worldPosition.xyz - cameraPosition);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

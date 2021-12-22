#define NUM_OCTAVES 5

varying vec2 _uv;
varying vec3 _normal;
varying vec3 _position;
varying vec3 _cameraP;
varying vec3 _eyeP;

uniform vec3 _color_1;
uniform vec3 _color_2;
uniform float _time;

float Fract(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float Noise(vec2 p){
    vec2 ip = floor(p);
    vec2 u = fract(p);

    u = u * u * (3.0 - 2.0 * u);

    float res = mix(
    mix(Fract(ip), Fract(ip + vec2(1.0, 0.0)), u.x),
    mix(Fract(ip + vec2(0.0, 1.0)), Fract(ip + vec2(1.0, 1.0)), u.x), u.y);

    return res*res;
}

float FBM(vec2 x) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));

    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * Noise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
    }

    return v;
}

float SetOpacity(float r, float g, float b) {
    float tone = (r + g + b) / 3.0;
    float alpha = 1.0;
    if (tone < 0.69) alpha = 0.0;
    return alpha;
}

vec3 ColorRGB(float r, float g, float b) {
    return vec3(r / 255.0, g / 255.0, b / 255.0);
}

float Fresnel(vec3 _eyeP, vec3 worldNormal) {
    return pow(1.0 + dot(_eyeP, worldNormal), 3.0);
}

void main() {
    vec2 uv = _uv;
    float f = Fresnel(_eyeP, _normal);
    float gradient2 = f * (0.3 - _position.y);
    float scale = 10.0;

    uv.y -= _time;

    vec2 p = uv * scale;
    float noise = FBM(p + _time);

    vec3 newCam = vec3(0.0, 5.0, 10.0);
    float gradient = dot(0.0 -  normalize(newCam), normalize(_normal));

    vec3 viewDirectionW = normalize(_cameraP - _position);
    float fresnelTerm = dot(viewDirectionW, _normal);
    fresnelTerm = clamp(1.0 - fresnelTerm, 0.0, 1.0);

    vec3 color1 = vec3(noise) + gradient;
    vec3 color2 = color1 - 0.2;

    float noisetone1 = SetOpacity(color1.r, color1.g, color1.b);
    float noisetone2 = SetOpacity(color2.r, color2.g, color2.b);

    vec4 backColor = vec4(color1, 1.0);
    backColor.rgb = ColorRGB(_color_1.r, _color_1.g, _color_1.b) * noisetone1;

    vec4 frontColor = vec4(color2, 1.0);
    frontColor.rgb = ColorRGB(_color_2.r, _color_2.g, _color_2.b) * noisetone1;

    if (noisetone2 > 0.0) {
        gl_FragColor = frontColor;
    } else {
        gl_FragColor = backColor;
    }
}

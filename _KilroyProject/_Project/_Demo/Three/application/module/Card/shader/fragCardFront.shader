varying vec2 _uv;
varying vec3 _normal;
varying vec3 _cameraP;
varying vec3 _eyeP;

uniform sampler2D _content;
uniform sampler2D _border_1;
uniform sampler2D _border_2;
uniform sampler2D _color;
uniform sampler2D _noise_1;
uniform sampler2D _noise_2;

float Fresnel(vec3 eyePosition, vec3 worldNormal) {
    return pow(1.0 + dot(eyePosition, worldNormal), 1.8);
}

void main() {
    vec4 contentT = texture2D(_content, _uv);
    vec4 border_1T = texture2D(_border_1, _uv);
    vec4 noise_2T = texture2D(_noise_2, mod(_uv * 2.0, 1.0));
    float fresnel = Fresnel(_eyeP, _normal);

    gl_FragColor = border_1T;

    if (gl_FragColor.g >= 0.5 && gl_FragColor.r < 0.6) {
        gl_FragColor = fresnel + contentT;
        gl_FragColor += noise_2T / 5.0;
    } else {
        vec2 uv1 = _uv;
        vec2 uv2 = _uv;
        float iTime = 1.0 * 0.004;
        float result = 0.0;
        vec4 border_2T = texture2D(_border_2, _uv);
        float tone = pow(dot(normalize(_cameraP), normalize(border_2T.rgb)), 1.0);
        vec4 colorT = texture2D(_color, vec2(tone, 0.0));

        uv1.y += iTime / 10.0;
        uv1.x -= (sin(iTime / 10.0) / 2.0);
        uv2.y += iTime / 14.0;
        uv2.x += (sin(iTime / 10.0) / 9.0);

        result += texture2D(_noise_1, mod(uv1 * 4.0, 1.0) * 0.6 + vec2(iTime * -0.003)).r;
        result *= texture2D(_noise_1, mod(uv2 * 4.0, 1.0) * 0.9 + vec2(iTime * 0.002)).b;
        result = pow(result, 10.0);

        gl_FragColor *= colorT;
        gl_FragColor += vec4(sin((tone + _uv.x + _uv.y / 10.0) * 10.0)) / 8.0;
    }

    gl_FragColor.a = border_1T.a;
}

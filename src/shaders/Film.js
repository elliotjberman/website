import THREE from 'three';
THREE.Film = {
  uniforms: {
    "tDiffuse": { type: "t", value: 0.0 },
		"time": { type: "f", value: 0.0},

		"noiseIntensity": { type: "f", value: 0.5 },
		"scanlineIntensity": { type: "f", value: 0.1 },
		"scanlineCount": { type: "f", value: 3000.0 },

		"grayscaleIntensity": { type: "f", value: 1.0 }
  },
  vertexShader: [
    "varying vec2 vUv;",
    "void main() {",
      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "}"
  ].join("\n"),
  fragmentShader: [
		"uniform sampler2D tDiffuse;",
		"uniform float time;",

		"varying vec2 vUv;",

		"uniform float noiseIntensity;",

		"uniform float scanlineIntensity;",
		"uniform float scanlineCount;",

		"uniform float grayscaleIntensity;",

		"const vec3 LUM_COEFF = vec3(0.299, 0.587, 0.114);",


		"void main() {",

			"vec4 texel = texture2D(tDiffuse, vUv);",
			"vec3 color = texel.rgb;",

			"float x = vUv.x * vUv.y * time * 1000.0;",
			"x = mod(x, 13.0) * mod(x, 123.0);",
			"x = mod(x, 0.01);",

			"color += texel.rgb * clamp(0.1 + x * 100.0, 0.0, 1.0) * noiseIntensity;",

			"vec2 sl = vec2(sin(vUv.y * scanlineCount), cos(vUv.y * scanlineCount));",
			"color += texel.rgb * vec3(sl.x, sl.y, sl.x) * scanlineIntensity;",


			"color = mix(color, vec3(dot(color, LUM_COEFF)), grayscaleIntensity);",

			"gl_FragColor = vec4(clamp(color, 0.0, 1.0), texel.a);",

		"}"
  ].join("\n")
};


import * as THREE from 'three';

export const FoliageShader = {
  uniforms: {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uColorBase: { value: new THREE.Color('#043927') },
    uColorGold: { value: new THREE.Color('#D4AF37') },
    uPointSize: { value: 2.5 }
  },
  vertexShader: `
    uniform float uTime;
    uniform float uProgress;
    uniform float uPointSize;
    
    attribute vec3 aChaos;
    attribute vec3 aTarget;
    attribute float aRandom;

    varying float vDistance;
    varying float vRandom;

    void main() {
      vRandom = aRandom;
      
      // Interpolate between chaos and tree shape
      vec3 pos = mix(aChaos, aTarget, uProgress);
      
      // Subtle organic sway
      float sway = sin(uTime * 0.5 + pos.y * 0.5) * 0.1 * (1.0 - uProgress);
      pos.x += sway;
      pos.z += sin(uTime * 0.7 + pos.y * 0.3) * 0.1;

      // Add a swirling effect during transition
      float angle = (1.0 - uProgress) * pos.y * 0.2;
      float s = sin(angle);
      float c = cos(angle);
      mat2 rot = mat2(c, -s, s, c);
      pos.xz = rot * pos.xz;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      
      // Perspective size attenuation
      gl_PointSize = uPointSize * (20.0 / -mvPosition.z) * (0.8 + 0.4 * aRandom);
      gl_Position = projectionMatrix * mvPosition;
      
      vDistance = length(pos.xz);
    }
  `,
  fragmentShader: `
    uniform vec3 uColorBase;
    uniform vec3 uColorGold;
    uniform float uProgress;
    
    varying float vDistance;
    varying float vRandom;

    void main() {
      // Circular point
      float d = distance(gl_PointCoord, vec2(0.5));
      if (d > 0.5) discard;

      // Color variation based on depth and randomness
      vec3 color = mix(uColorBase, uColorGold, vRandom * 0.4);
      
      // Enhance gold shimmer for formed state
      if (vRandom > 0.9) {
        color = mix(color, uColorGold, uProgress);
      }

      // Soft edges
      float alpha = smoothstep(0.5, 0.4, d);
      gl_FragColor = vec4(color, alpha);
    }
  `
};

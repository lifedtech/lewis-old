/* eslint-disable react-hooks/purity, react-hooks/immutability */
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const NUM_NEURONS = 70
const CONNECTION_DISTANCE = 3.5
const BOUNDARY = 9
const SPEED = 0

function NeuralNetwork() {
  const pointsRef = useRef()
  const linesRef = useRef()

  // Generate initial random positions and velocities for neurons
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(NUM_NEURONS * 3)
    const vel = []
    for (let i = 0; i < NUM_NEURONS; i++) {
      pos[i * 3] = (Math.random() - 0.5) * BOUNDARY * 2
      pos[i * 3 + 1] = (Math.random() - 0.5) * BOUNDARY * 2
      pos[i * 3 + 2] = (Math.random() - 0.5) * BOUNDARY * 2
      
      vel.push(new THREE.Vector3(
        (Math.random() - 0.5) * SPEED,
        (Math.random() - 0.5) * SPEED,
        (Math.random() - 0.5) * SPEED
      ))
    }
    return { positions: pos, velocities: vel }
  }, [])

  // Create buffers for maximum possible connections between neurons
  const maxLines = (NUM_NEURONS * (NUM_NEURONS - 1)) / 2
  const linePositions = useMemo(() => new Float32Array(maxLines * 6), [maxLines])
  const lineOpacities = useMemo(() => new Float32Array(maxLines * 2), [maxLines])

  useFrame((state, delta) => {
    if (!pointsRef.current || !linesRef.current) return

    const pos = pointsRef.current.geometry.attributes.position.array
    
    // Update positions based on velocities and gently bounce off invisible boundaries
    for (let i = 0; i < NUM_NEURONS; i++) {
      const v = velocities[i]
      
      pos[i * 3] += v.x * delta
      pos[i * 3 + 1] += v.y * delta
      pos[i * 3 + 2] += v.z * delta

      if (Math.abs(pos[i * 3]) > BOUNDARY) v.x *= -1
      if (Math.abs(pos[i * 3 + 1]) > BOUNDARY) v.y *= -1
      if (Math.abs(pos[i * 3 + 2]) > BOUNDARY) v.z *= -1
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true

    // Calculate connections (synapses)
    let lineCount = 0
    for (let i = 0; i < NUM_NEURONS; i++) {
      for (let j = i + 1; j < NUM_NEURONS; j++) {
        const dx = pos[i * 3] - pos[j * 3]
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1]
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < CONNECTION_DISTANCE) {
          // Opacity increases as they get closer
          const alpha = 1.0 - (dist / CONNECTION_DISTANCE)
          
          linePositions[lineCount * 6] = pos[i * 3]
          linePositions[lineCount * 6 + 1] = pos[i * 3 + 1]
          linePositions[lineCount * 6 + 2] = pos[i * 3 + 2]
          
          linePositions[lineCount * 6 + 3] = pos[j * 3]
          linePositions[lineCount * 6 + 4] = pos[j * 3 + 1]
          linePositions[lineCount * 6 + 5] = pos[j * 3 + 2]

          lineOpacities[lineCount * 2] = alpha
          lineOpacities[lineCount * 2 + 1] = alpha
          
          lineCount++
        }
      }
    }

    linesRef.current.geometry.setDrawRange(0, lineCount * 2)
    linesRef.current.geometry.attributes.position.needsUpdate = true
    linesRef.current.geometry.attributes.opacity.needsUpdate = true
  })

  // Material for the connections (Axons)
  const lineMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color('#00ae9d') } // Lewis Teal
    },
    vertexShader: `
      attribute float opacity;
      varying float vOpacity;
      void main() {
        vOpacity = opacity;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      varying float vOpacity;
      void main() {
        gl_FragColor = vec4(color, vOpacity * 0.25);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }), [])

  // Material for the Neurons (Somas)
  const nodeMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color('#5fbb46') }, // Lewis Green
      time: { value: 0 }
    },
    vertexShader: `
      uniform float time;
      void main() {
        // Expanding and pulsing animation based on time and position
        float pulse = sin(time * 1.5 + position.x * 5.0) * 0.5 + 0.5;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        // Base size is 18.0, pulse adds up to 10.0
        gl_PointSize = (18.0 + pulse * 10.0) * (10.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      void main() {
        vec2 xy = gl_PointCoord.xy - vec2(0.5);
        float ll = length(xy);
        // Circular soft dot
        if (ll > 0.5) discard;
        // Soft glowing edge gradient
        float alpha = pow(1.0 - (ll * 2.0), 1.5);
        gl_FragColor = vec4(color, alpha * 0.85);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }), [])

  useFrame((state) => {
    nodeMaterial.uniforms.time.value = state.clock.elapsedTime
  })

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <primitive object={nodeMaterial} attach="material" />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-opacity"
            count={lineOpacities.length}
            array={lineOpacities}
            itemSize={1}
          />
        </bufferGeometry>
        <primitive object={lineMaterial} attach="material" />
      </lineSegments>
    </group>
  )
}

export default function Background3D() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'transparent' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 55 }} dpr={[1, 2]}>
        <NeuralNetwork />
      </Canvas>
    </div>
  )
}

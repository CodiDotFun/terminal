
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Sphere, Line, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface DeploymentStep {
  id: string;
  title: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  position: [number, number, number];
}

interface DeploymentVisualizerProps {
  steps: DeploymentStep[];
  currentStep: number;
}

const DeploymentNode: React.FC<{ 
  step: DeploymentStep; 
  isActive: boolean; 
  isCompleted: boolean;
}> = ({ step, isActive, isCompleted }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      if (isActive) {
        meshRef.current.rotation.y += 0.02;
        meshRef.current.rotation.x += 0.01;
      }
      
      // Floating animation
      meshRef.current.position.y = step.position[1] + Math.sin(state.clock.elapsedTime + step.position[0]) * 0.1;
    }
  });

  const getColor = () => {
    if (step.status === 'error') return '#ff4444';
    if (step.status === 'completed') return '#44ff44';
    if (step.status === 'running') return '#ffaa44';
    return '#666666';
  };

  const getEmissive = () => {
    if (isActive) return '#97ff5f';
    if (isCompleted) return '#44ff44';
    return '#000000';
  };

  return (
    <group position={step.position}>
      <Sphere
        ref={meshRef}
        args={[0.3, 32, 32]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <meshStandardMaterial
          color={getColor()}
          emissive={getEmissive()}
          emissiveIntensity={isActive ? 0.5 : 0.2}
          roughness={0.3}
          metalness={0.7}
        />
      </Sphere>
      
      {/* Particles for active nodes */}
      {isActive && (
        <Particles count={20} position={step.position} />
      )}
      
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.2}
        color={isActive ? '#97ff5f' : '#ffffff'}
        anchorX="center"
        anchorY="middle"
      >
        {step.title}
      </Text>
    </group>
  );
};

const Particles: React.FC<{ count: number; position: [number, number, number] }> = ({ count, position }) => {
  const points = useRef<THREE.Points>(null);
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    return positions;
  }, [count]);

  useFrame(() => {
    if (points.current) {
      points.current.rotation.y += 0.01;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#97ff5f" />
    </points>
  );
};

const ConnectionLines: React.FC<{ steps: DeploymentStep[]; currentStep: number }> = ({ steps, currentStep }) => {
  const lines = useMemo(() => {
    const connections = [];
    for (let i = 0; i < steps.length - 1; i++) {
      const start = steps[i].position;
      const end = steps[i + 1].position;
      const isActive = i < currentStep;
      
      connections.push({
        start: new THREE.Vector3(...start),
        end: new THREE.Vector3(...end),
        color: isActive ? '#97ff5f' : '#333333'
      });
    }
    return connections;
  }, [steps, currentStep]);

  return (
    <>
      {lines.map((line, index) => (
        <Line
          key={index}
          points={[line.start, line.end]}
          color={line.color}
          lineWidth={2}
          dashed={index >= currentStep}
        />
      ))}
    </>
  );
};

const DeploymentVisualizer: React.FC<DeploymentVisualizerProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full h-96 bg-black/50 rounded-lg overflow-hidden border border-codi/30">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#97ff5f" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ffffff" />
        
        <Stars radius={100} depth={50} count={1000} factor={4} saturation={0.5} fade />
        
        <ConnectionLines steps={steps} currentStep={currentStep} />
        
        {steps.map((step, index) => (
          <DeploymentNode
            key={step.id}
            step={step}
            isActive={index === currentStep}
            isCompleted={index < currentStep}
          />
        ))}
        
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={15}
        />
      </Canvas>
    </div>
  );
};

export default DeploymentVisualizer;

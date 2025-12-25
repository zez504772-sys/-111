
import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { TREE_CONFIG, ORNAMENT_COLORS, COLORS } from '../constants';
import { OrnamentData } from '../types';

interface OrnamentsProps {
  progress: number;
}

const Ornaments: React.FC<OrnamentsProps> = ({ progress }) => {
  const ballMeshRef = useRef<THREE.InstancedMesh>(null);
  const giftMeshRef = useRef<THREE.InstancedMesh>(null);
  const lightMeshRef = useRef<THREE.InstancedMesh>(null);

  const data = useMemo(() => {
    const balls: OrnamentData[] = [];
    const gifts: OrnamentData[] = [];
    const lights: OrnamentData[] = [];

    const createData = (count: number, type: OrnamentData['type'], list: OrnamentData[], weight: number) => {
      for (let i = 0; i < count; i++) {
        // Chaos
        const chaos: [number, number, number] = [
          (Math.random() - 0.5) * TREE_CONFIG.CHAOS_RADIUS * 2,
          (Math.random() - 0.5) * TREE_CONFIG.CHAOS_RADIUS * 2,
          (Math.random() - 0.5) * TREE_CONFIG.CHAOS_RADIUS * 2,
        ];

        // Target (Surface of the tree cone)
        const y = Math.random() * TREE_CONFIG.HEIGHT;
        const t = Math.random() * Math.PI * 2;
        const currentRadius = (1 - y / TREE_CONFIG.HEIGHT) * TREE_CONFIG.RADIUS;
        const target: [number, number, number] = [
          currentRadius * Math.cos(t),
          y - TREE_CONFIG.HEIGHT / 2,
          currentRadius * Math.sin(t),
        ];

        list.push({
          id: i,
          chaosPosition: chaos,
          targetPosition: target,
          type,
          color: ORNAMENT_COLORS[Math.floor(Math.random() * ORNAMENT_COLORS.length)],
          weight,
          rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
          scale: type === 'gift' ? 0.3 + Math.random() * 0.4 : 0.15 + Math.random() * 0.1,
        });
      }
    };

    createData(TREE_CONFIG.BALL_COUNT, 'ball', balls, 0.5);
    createData(TREE_CONFIG.GIFT_COUNT, 'gift', gifts, 1.0);
    createData(TREE_CONFIG.LIGHT_COUNT, 'light', lights, 0.1);

    return { balls, gifts, lights };
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempPos = useMemo(() => new THREE.Vector3(), []);
  const lerpProgressRef = useRef(0);

  useFrame(() => {
    lerpProgressRef.current = THREE.MathUtils.lerp(lerpProgressRef.current, progress, 0.05);

    const updateInstance = (mesh: THREE.InstancedMesh, list: OrnamentData[]) => {
      list.forEach((item, i) => {
        const cp = new THREE.Vector3(...item.chaosPosition);
        const tp = new THREE.Vector3(...item.targetPosition);
        
        // Custom weight-based lag for a "physical" feel
        const individualProgress = Math.pow(lerpProgressRef.current, 1 + item.weight);
        
        tempPos.lerpVectors(cp, tp, individualProgress);
        
        // Add a bit of "floating" motion in chaos state
        if (lerpProgressRef.current < 0.9) {
           const time = performance.now() * 0.001;
           tempPos.y += Math.sin(time + item.id) * 0.2 * (1 - individualProgress);
        }

        dummy.position.copy(tempPos);
        dummy.rotation.set(...item.rotation);
        if (item.type === 'gift') {
           dummy.rotation.y += performance.now() * 0.001 * (1 - individualProgress);
        }
        dummy.scale.setScalar(item.scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    };

    if (ballMeshRef.current) updateInstance(ballMeshRef.current, data.balls);
    if (giftMeshRef.current) updateInstance(giftMeshRef.current, data.gifts);
    if (lightMeshRef.current) updateInstance(lightMeshRef.current, data.lights);
  });

  // Apply colors to instances on mount
  useEffect(() => {
    const applyColors = (mesh: THREE.InstancedMesh, list: OrnamentData[]) => {
      list.forEach((item, i) => {
        mesh.setColorAt(i, new THREE.Color(item.color));
      });
      mesh.instanceColor!.needsUpdate = true;
    };
    if (ballMeshRef.current) applyColors(ballMeshRef.current, data.balls);
    if (giftMeshRef.current) applyColors(giftMeshRef.current, data.gifts);
    if (lightMeshRef.current) applyColors(lightMeshRef.current, data.lights);
  }, [data]);

  return (
    <>
      <instancedMesh ref={ballMeshRef} args={[undefined, undefined, TREE_CONFIG.BALL_COUNT]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial metalness={0.9} roughness={0.1} />
      </instancedMesh>

      <instancedMesh ref={giftMeshRef} args={[undefined, undefined, TREE_CONFIG.GIFT_COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial metalness={0.6} roughness={0.3} />
      </instancedMesh>

      <instancedMesh ref={lightMeshRef} args={[undefined, undefined, TREE_CONFIG.LIGHT_COUNT]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial transparent opacity={0.8} />
      </instancedMesh>
    </>
  );
};

export default Ornaments;

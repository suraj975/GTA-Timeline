"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { clampProgress } from "@/lib/animation/progress";

type EvolutionSceneProps = { progress: number };

const blocks = [
  [-4.4, -4.5, 2.4, 2.4], [4.2, -4.8, 2.8, 3], [-4.5, -0.8, 3, 2.2],
  [4.5, -0.7, 2.4, 2.8], [-4.3, 3.3, 2.7, 2.2], [4.4, 3.4, 3.1, 2.4],
] as const;

function City({ progress }: EvolutionSceneProps) {
  const { camera } = useThree();
  const top = useMemo(() => new THREE.Vector3(0, 15, 0.01), []);
  const street = useMemo(() => new THREE.Vector3(0, 3.2, 8.5), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const p = clampProgress(progress);

  useFrame(() => {
    camera.position.lerpVectors(top, street, p);
    target.set(0, 0.7 * p, -2.5 * p);
    camera.lookAt(target);
  });

  return (
    <>
      <color attach="background" args={[p > 0.65 ? "#14242d" : "#07100e"]} />
      <fog attach="fog" args={["#14242d", 7, 28]} />
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 10, 6]} intensity={1.2} color="#b9e7ff" />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 38]} />
        <meshStandardMaterial color="#252d2e" roughness={1} />
      </mesh>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.3, 38]} />
        <meshStandardMaterial color="#080b0c" roughness={0.9} />
      </mesh>
      {blocks.map(([x, z, width, depth], index) => {
        const height = 0.15 + p * (2.6 + (index % 3) * 1.15);
        return (
          <mesh key={`${x}-${z}`} position={[x, height / 2, z]}>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial color={index % 2 ? "#53656b" : "#3e5057"} roughness={0.82} />
          </mesh>
        );
      })}
      <group position={[0, 0.35, 2.5 - p * 7]}>
        <mesh>
          <boxGeometry args={[1.15, 0.42, 2.15]} />
          <meshStandardMaterial color="#d6ff3f" roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.34, -0.05]}>
          <boxGeometry args={[0.8, 0.35, 1.05]} />
          <meshStandardMaterial color="#17252b" roughness={0.35} />
        </mesh>
      </group>
    </>
  );
}

export function EvolutionScene({ progress }: EvolutionSceneProps) {
  return (
    <div className="webgl-canvas" aria-hidden="true">
      <Canvas
        camera={{ fov: 48, near: 0.1, far: 60, position: [0, 15, 0.01] }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <City progress={progress} />
      </Canvas>
    </div>
  );
}

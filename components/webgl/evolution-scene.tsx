"use client";

/* eslint-disable react-hooks/immutability -- R3F animation frames intentionally mutate Three.js scene objects. */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { clampProgress } from "@/lib/animation/progress";

type EvolutionSceneProps = { progress: number };

const ease = (value: number, from: number, to: number) => {
  const normalized = THREE.MathUtils.clamp((value - from) / (to - from), 0, 1);
  return normalized * normalized * (3 - 2 * normalized);
};

const buildingData = Array.from({ length: 72 }, (_, index) => {
  const row = Math.floor(index / 2);
  const side = index % 2 ? 1 : -1;
  const lane = row % 3;
  return {
    x: side * (4.1 + lane * 2.25),
    z: 18 - row * 2.3,
    width: 1.65 + ((row * 7) % 8) * 0.18,
    depth: 1.55 + ((row * 5) % 7) * 0.17,
    height: 2.2 + ((row * 11 + lane * 3) % 9) * 0.65,
    delay: (row % 8) * 0.018,
  };
});

function InstancedCity({ progress }: EvolutionSceneProps) {
  const buildings = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    if (!buildings.current) return;
    const colors = ["#2f484d", "#3d555c", "#52646a", "#35434d"];
    buildingData.forEach((_, index) => buildings.current?.setColorAt(index, new THREE.Color(colors[index % colors.length])));
    if (buildings.current.instanceColor) buildings.current.instanceColor.needsUpdate = true;
  }, []);

  useFrame(() => {
    const p = clampProgress(progress);
    buildingData.forEach((building, index) => {
      const rise = ease(p, 0.12 + building.delay, 0.48 + building.delay);
      const height = 0.025 + building.height * rise;
      dummy.position.set(building.x, height / 2, building.z);
      dummy.scale.set(building.width, height, building.depth);
      dummy.rotation.y = (index % 4 - 1.5) * 0.015 * rise;
      dummy.updateMatrix();
      buildings.current?.setMatrixAt(index, dummy.matrix);
    });
    if (buildings.current) buildings.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={buildings} args={[undefined, undefined, buildingData.length]} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.72} metalness={0.08} />
    </instancedMesh>
  );
}

const windowData = buildingData.flatMap((building, buildingIndex) => [0.34, 0.66].map((level, levelIndex) => ({
  ...building,
  buildingIndex,
  level,
  levelIndex,
})));

function CityWindows({ progress }: EvolutionSceneProps) {
  const windows = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    windowData.forEach((window, index) => {
      const lit = (window.buildingIndex + window.levelIndex * 3) % 5 !== 0;
      windows.current?.setColorAt(index, new THREE.Color(lit ? (index % 3 ? "#ffd274" : "#73e8ff") : "#182428"));
    });
    if (windows.current?.instanceColor) windows.current.instanceColor.needsUpdate = true;
  }, []);

  useFrame(() => {
    const p = clampProgress(progress);
    windowData.forEach((window, index) => {
      const rise = ease(p, 0.16 + window.delay, 0.5 + window.delay);
      const height = window.height * rise;
      const side = window.x > 0 ? -1 : 1;
      dummy.position.set(window.x + side * (window.width / 2 + .018), Math.max(.03, height * window.level), window.z);
      dummy.scale.set(.035, .27 * rise, Math.max(.25, window.depth * .62));
      dummy.updateMatrix();
      windows.current?.setMatrixAt(index, dummy.matrix);
    });
    if (windows.current) windows.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={windows} args={[undefined, undefined, windowData.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial emissive="#6bbec4" emissiveIntensity={1.5} roughness={.42} />
    </instancedMesh>
  );
}

function HeroCar({ progress }: EvolutionSceneProps) {
  const car = useRef<THREE.Group>(null);
  const bodyGeometry = useMemo(() => {
    const geometry = new THREE.BoxGeometry(1.5, .42, 2.78, 2, 1, 5);
    const positions = geometry.attributes.position as THREE.BufferAttribute;
    for (let index = 0; index < positions.count; index += 1) {
      const z = positions.getZ(index);
      const taper = THREE.MathUtils.lerp(1, .72, Math.pow(Math.abs(z) / 1.39, 2.4));
      positions.setX(index, positions.getX(index) * taper);
      if (Math.abs(z) > 1.05 && positions.getY(index) > 0) positions.setY(index, positions.getY(index) - .09);
    }
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  useFrame(() => {
    const p = clampProgress(progress);
    const mapDrive = ease(p, 0, .58);
    const chase = ease(p, 0.58, 1);
    const carZ = p < .58 ? THREE.MathUtils.lerp(8, 1, mapDrive) : THREE.MathUtils.lerp(1, -20, chase);
    const depth = ease(p, 0.18, 0.58);
    if (car.current) {
      car.current.position.set(Math.sin(mapDrive * Math.PI * 2) * .72 * (1 - chase) + Math.sin(p * Math.PI * 3) * .18 * chase, 0.32, carZ);
      car.current.scale.set(1, 0.18 + depth * 0.82, 1);
      car.current.rotation.y = Math.sin(mapDrive * Math.PI * 2) * .12 * (1 - chase) + Math.sin(p * Math.PI * 2) * .025 * chase;
    }
  });

  const wheelPositions = [[-.73, -.08, -.88], [.73, -.08, -.88], [-.73, -.08, .88], [.73, -.08, .88]] as const;

  return (
    <group ref={car}>
      <mesh castShadow position={[0, 0, 0]}>
        <primitive object={bodyGeometry} attach="geometry" />
        <meshStandardMaterial color="#dfff36" roughness={0.25} metalness={0.36} />
      </mesh>
      <mesh castShadow position={[0, .34, .18]}>
        <boxGeometry args={[1.05, .42, 1.18]} />
        <meshPhysicalMaterial color="#13242c" roughness={0.08} metalness={0.3} transmission={.12} clearcoat={1} />
      </mesh>
      <mesh position={[0, .39, -.43]} rotation={[-.28, 0, 0]}><boxGeometry args={[.96, .34, .035]} /><meshPhysicalMaterial color="#76b5c6" roughness={.05} metalness={.18} transparent opacity={.65} /></mesh>
      <mesh position={[0, .38, .8]} rotation={[.24, 0, 0]}><boxGeometry args={[.96, .31, .035]} /><meshPhysicalMaterial color="#477c8c" roughness={.08} transparent opacity={.58} /></mesh>
      <mesh castShadow position={[0, .18, -1.05]}>
        <boxGeometry args={[1.3, .18, .58]} />
        <meshStandardMaterial color="#bcd92f" roughness={0.3} />
      </mesh>
      <mesh position={[0, .23, -1.06]}><boxGeometry args={[.08, .025, .92]} /><meshBasicMaterial color="#f7ffb1" toneMapped={false} /></mesh>
      <mesh position={[-.77, .31, -.12]}><boxGeometry args={[.18, .08, .25]} /><meshStandardMaterial color="#bcd92f" metalness={.42} /></mesh>
      <mesh position={[.77, .31, -.12]}><boxGeometry args={[.18, .08, .25]} /><meshStandardMaterial color="#bcd92f" metalness={.42} /></mesh>
      <mesh position={[0, .12, 1.42]}>
        <boxGeometry args={[1.48, .16, .13]} />
        <meshStandardMaterial color="#151817" metalness={0.5} />
      </mesh>
      <mesh position={[-.43, .19, -1.39]}><boxGeometry args={[.32, .15, .06]} /><meshBasicMaterial color="#e8fbff" toneMapped={false} /></mesh>
      <mesh position={[.43, .19, -1.39]}><boxGeometry args={[.32, .15, .06]} /><meshBasicMaterial color="#e8fbff" toneMapped={false} /></mesh>
      <mesh position={[-.43, .19, 1.39]}><boxGeometry args={[.32, .15, .06]} /><meshBasicMaterial color="#ff2b37" toneMapped={false} /></mesh>
      <mesh position={[.43, .19, 1.39]}><boxGeometry args={[.32, .15, .06]} /><meshBasicMaterial color="#ff2b37" toneMapped={false} /></mesh>
      <group>
        {wheelPositions.map(([x, y, z]) => (
          <mesh castShadow key={`${x}-${z}`} position={[x, y, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[.3, .3, .2, 12]} />
            <meshStandardMaterial color="#080909" roughness={.82} />
          </mesh>
        ))}
      </group>
      <pointLight color="#e2fbff" intensity={3} distance={7} position={[0, .3, -1.5]} />
      <pointLight color="#ff2735" intensity={2.4} distance={4} position={[0, .25, 1.5]} />
      <pointLight color="#b7ff3d" intensity={1.6} distance={3.2} position={[0, -.18, 0]} />
    </group>
  );
}

function Traffic({ progress }: EvolutionSceneProps) {
  const cars = useRef<Array<THREE.Group | null>>([]);
  useFrame(({ clock }) => {
    const depth = ease(progress, .18, .58);
    cars.current.forEach((car, index) => {
      if (!car) return;
      const direction = index % 2 ? 1 : -1;
      car.position.z = THREE.MathUtils.euclideanModulo(clock.elapsedTime * direction * (1.3 + index * .08) + index * 11, 86) - 62;
      car.position.x = direction > 0 ? -1.05 : 1.05;
      car.rotation.y = direction > 0 ? Math.PI : 0;
      car.scale.set(.62, .12 + depth * .5, .62);
    });
  });

  return (
    <>
      {Array.from({ length: 12 }, (_, index) => (
        <group key={index} ref={(node) => { cars.current[index] = node; }} position={[0, .23, 0]}>
          <mesh castShadow><boxGeometry args={[.85, .34, 1.65]} /><meshStandardMaterial color={index % 3 === 0 ? "#ce4a3c" : index % 3 === 1 ? "#4d79a8" : "#d5c07a"} roughness={.55} /></mesh>
          <mesh position={[0, .27, .1]}><boxGeometry args={[.62, .26, .72]} /><meshStandardMaterial color="#17242a" /></mesh>
          <mesh position={[-.25, .05, -0.84]}><boxGeometry args={[.18, .09, .04]} /><meshBasicMaterial color="#fff1c2" toneMapped={false} /></mesh>
          <mesh position={[.25, .05, -0.84]}><boxGeometry args={[.18, .09, .04]} /><meshBasicMaterial color="#fff1c2" toneMapped={false} /></mesh>
        </group>
      ))}
    </>
  );
}

function MapMarkers({ progress }: EvolutionSceneProps) {
  const markers = useRef<Array<THREE.Group | null>>([]);
  const markerPositions = [[-4.2, 8], [4.5, 3], [-6.3, -3], [5.8, -11], [-4.5, -17]] as const;
  useFrame(({ clock }) => {
    const fade = 1 - ease(progress, .3, .52);
    markers.current.forEach((marker, index) => {
      if (!marker) return;
      const pulse = 1 + Math.sin(clock.elapsedTime * 3 + index) * .18;
      marker.visible = fade > .03;
      marker.scale.set(pulse, pulse, pulse);
      marker.rotation.z = clock.elapsedTime * .35 * (index % 2 ? 1 : -1);
    });
  });
  return (
    <>
      {markerPositions.map(([x, z], index) => (
        <group key={`${x}-${z}`} ref={(node) => { markers.current[index] = node; }} position={[x, .12, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh><torusGeometry args={[.42, .08, 8, 24]} /><meshBasicMaterial color={index % 2 ? "#55e8ff" : "#dfff36"} toneMapped={false} /></mesh>
          <mesh><circleGeometry args={[.13, 12]} /><meshBasicMaterial color="#ffffff" transparent opacity={.85} /></mesh>
        </group>
      ))}
    </>
  );
}

function StreetDetails({ progress }: EvolutionSceneProps) {
  const rise = ease(progress, .36, .62);
  return (
    <group scale={[1, rise, 1]}>
      {Array.from({ length: 34 }, (_, index) => {
        const z = 18 - index * 2.6;
        return (
          <group key={index}>
            <mesh position={[-2.35, 1.15, z]}><cylinderGeometry args={[.045, .065, 2.3, 8]} /><meshStandardMaterial color="#202829" metalness={.7} /></mesh>
            <mesh position={[2.35, 1.15, z]}><cylinderGeometry args={[.045, .065, 2.3, 8]} /><meshStandardMaterial color="#202829" metalness={.7} /></mesh>
            <mesh position={[-2.35, 2.28, z]}><sphereGeometry args={[.12, 8, 8]} /><meshBasicMaterial color="#ffd980" toneMapped={false} /></mesh>
            <mesh position={[2.35, 2.28, z]}><sphereGeometry args={[.12, 8, 8]} /><meshBasicMaterial color="#ffd980" toneMapped={false} /></mesh>
          </group>
        );
      })}
    </group>
  );
}

function Tunnel({ progress }: EvolutionSceneProps) {
  const reveal = ease(progress, .63, .78);
  return (
    <group position={[0, 0, -9]} scale={[1, reveal, 1]}>
      <mesh position={[-3, 2.2, 0]}><boxGeometry args={[1.2, 4.4, 8]} /><meshStandardMaterial color="#121719" roughness={.95} /></mesh>
      <mesh position={[3, 2.2, 0]}><boxGeometry args={[1.2, 4.4, 8]} /><meshStandardMaterial color="#121719" roughness={.95} /></mesh>
      <mesh position={[0, 4.05, 0]}><boxGeometry args={[5, .7, 8]} /><meshStandardMaterial color="#101516" roughness={.9} /></mesh>
      {Array.from({ length: 7 }, (_, index) => (
        <group key={index} position={[0, 3.65, 3.2 - index * 1.05]}>
          <mesh><boxGeometry args={[4.8, .08, .08]} /><meshStandardMaterial color="#2d3b3d" /></mesh>
          <mesh position={[0, -.08, 0]}><boxGeometry args={[1.1, .04, .16]} /><meshBasicMaterial color={index > 4 ? "#69caff" : "#ffe39b"} toneMapped={false} /></mesh>
        </group>
      ))}
    </group>
  );
}

function Rain({ progress }: EvolutionSceneProps) {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.PointsMaterial>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(900);
    for (let index = 0; index < values.length; index += 3) {
      const seed = index * 12.9898;
      values[index] = (Math.sin(seed) * 10) % 10;
      values[index + 1] = 1 + Math.abs(Math.sin(seed * 1.7)) * 11;
      values[index + 2] = -22 + Math.abs(Math.cos(seed * .83)) * 44;
    }
    return values;
  }, []);

  useFrame((_, delta) => {
    if (!points.current || !material.current) return;
    material.current.opacity = ease(progress, .56, .78) * .5;
    const attribute = points.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let index = 1; index < attribute.array.length; index += 3) {
      attribute.array[index] = Number(attribute.array[index]) - delta * 8;
      if (Number(attribute.array[index]) < .1) attribute.array[index] = 12;
    }
    attribute.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial ref={material} color="#bfe9ff" size={.035} transparent opacity={0} depthWrite={false} />
    </points>
  );
}

function CityWorld({ progress }: EvolutionSceneProps) {
  const { camera, scene, pointer } = useThree();
  const fog = useRef<THREE.Fog>(null);
  const topColor = useMemo(() => new THREE.Color("#06100c"), []);
  const futureColor = useMemo(() => new THREE.Color("#101e29"), []);
  const currentColor = useMemo(() => new THREE.Color(), []);
  const cameraCurve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 19, .01),
    new THREE.Vector3(7.5, 14, 10),
    new THREE.Vector3(6, 8, 12),
    new THREE.Vector3(2.8, 4.3, 10),
    new THREE.Vector3(0, 2.75, 7),
  ]), []);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const p = clampProgress(progress);
    const chase = ease(p, .58, 1);
    const mapDrive = ease(p, 0, .58);
    const carZ = p < .58 ? THREE.MathUtils.lerp(8, 1, mapDrive) : THREE.MathUtils.lerp(1, -20, chase);
    const cameraPhase = ease(p, .08, .66);
    if (p < .66) {
      camera.position.copy(cameraCurve.getPointAt(cameraPhase));
      target.set(0, THREE.MathUtils.lerp(0, .75, cameraPhase), THREE.MathUtils.lerp(0, -1.5, cameraPhase));
    } else {
      camera.position.set(0, 2.72, carZ + 6.4);
      target.set(0, .65, carZ - 4.1);
    }
    camera.position.x += pointer.x * THREE.MathUtils.lerp(.65, .16, chase);
    camera.position.y += pointer.y * THREE.MathUtils.lerp(.22, .08, chase);
    camera.lookAt(target);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(44, 55, ease(p, .52, .78));
      camera.updateProjectionMatrix();
    }
    currentColor.lerpColors(topColor, futureColor, ease(p, .48, .9));
    scene.background = currentColor;
    if (fog.current) {
      fog.current.color.copy(currentColor);
      fog.current.near = THREE.MathUtils.lerp(16, 5, ease(p, .52, .82));
      fog.current.far = THREE.MathUtils.lerp(58, 44, ease(p, .52, .82));
    }
  });

  return (
    <>
      <fog ref={fog} attach="fog" args={["#06100c", 16, 58]} />
      <ambientLight intensity={1.05} color="#92b7ae" />
      <directionalLight
        castShadow
        position={[6, 13, 8]}
        intensity={2.2}
        color="#c8efff"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <hemisphereLight intensity={.7} color="#8bd5ff" groundColor="#07100d" />
      <mesh receiveShadow position={[0, 0, -27]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[42, 140]} /><meshStandardMaterial color="#17211f" roughness={1} /></mesh>
      <mesh receiveShadow position={[0, .025, -27]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[4.1, 140]} /><meshStandardMaterial color="#080b0c" roughness={.84} /></mesh>
      <mesh receiveShadow position={[-2.75, .05, -27]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.25, 140]} /><meshStandardMaterial color="#515552" roughness={1} /></mesh>
      <mesh receiveShadow position={[2.75, .05, -27]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.25, 140]} /><meshStandardMaterial color="#515552" roughness={1} /></mesh>
      {[18, 10, 2, -6, -14, -22, -30, -38, -46, -54, -62, -70, -78].map((z) => <mesh receiveShadow key={z} position={[0, .035, z]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[42, 2.6]} /><meshStandardMaterial color="#0b0f10" roughness={.9} /></mesh>)}
      {Array.from({ length: 61 }, (_, index) => <mesh key={index} position={[0, .065, 28 - index * 2.05]}><boxGeometry args={[.08, .02, .75]} /><meshBasicMaterial color="#e6d36a" /></mesh>)}
      <InstancedCity progress={progress} />
      <CityWindows progress={progress} />
      <StreetDetails progress={progress} />
      <Traffic progress={progress} />
      <MapMarkers progress={progress} />
      <Tunnel progress={progress} />
      <HeroCar progress={progress} />
      <Rain progress={progress} />
    </>
  );
}

export function EvolutionScene({ progress }: EvolutionSceneProps) {
  return (
    <div className="webgl-canvas" aria-hidden="true">
      <Canvas
        shadows
        camera={{ fov: 44, near: .1, far: 80, position: [0, 19, .01] }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <CityWorld progress={progress} />
      </Canvas>
    </div>
  );
}

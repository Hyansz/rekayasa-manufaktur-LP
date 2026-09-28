"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import * as THREE from "three";

function EnvironmentMap() {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envMap;
    return () => {
      scene.environment = null;
      envMap.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  return null;
}

// ---- Material presets: aluminium/steel industrial look ----
const MAT_ALU = {
  color: "#c9cbce",
  metalness: 0.88,
  roughness: 0.22,
  clearcoat: 0.3,
  clearcoatRoughness: 0.4,
  envMapIntensity: 1.15,
};
const MAT_STEEL_DARK = {
  color: "#3a3d40",
  metalness: 0.8,
  roughness: 0.35,
  clearcoat: 0.2,
  clearcoatRoughness: 0.5,
  envMapIntensity: 1,
};
const MAT_STEEL_LIGHT = {
  color: "#eef0f0",
  metalness: 1,
  roughness: 0.12,
  clearcoat: 0.5,
  clearcoatRoughness: 0.2,
  envMapIntensity: 1.3,
};

// ---- Elemen manufaktur individual ----

function GearShape({ radius = 0.6, thickness = 0.18, teeth = 12 }) {
  const teethMeshes = useMemo(() => {
    const arr: { x: number; z: number; angle: number }[] = [];
    for (let i = 0; i < teeth; i++) {
      const angle = (i / teeth) * Math.PI * 2;
      arr.push({
        x: Math.cos(angle) * (radius + 0.06),
        z: Math.sin(angle) * (radius + 0.06),
        angle,
      });
    }
    return arr;
  }, [radius, teeth]);

  return (
    // Seluruh gear (disc + gigi + hub) dibangun dulu di orientasi
    // natural cylinder (axis Y, lingkaran di bidang X-Z), baru
    // di-rotate SEKALIGUS lewat group ini supaya semuanya tetap
    // align satu sama lain saat menghadap kamera.
    <group rotation={[Math.PI / 2, 0, 0]}>
      {/* Piringan utama gear */}
      <mesh>
        <cylinderGeometry args={[radius, radius, thickness, 48]} />
        <meshPhysicalMaterial {...MAT_ALU} />
      </mesh>
      {/* Gigi gear di sekeliling rim */}
      {teethMeshes.map((t, i) => (
        <mesh key={i} position={[t.x, 0, t.z]} rotation={[0, -t.angle, 0]}>
          <boxGeometry args={[0.1, thickness, 0.12]} />
          <meshPhysicalMaterial {...MAT_ALU} />
        </mesh>
      ))}
      {/* Hub tengah — kesan lubang poros */}
      <mesh position={[0, 0.001, 0]}>
        <cylinderGeometry args={[radius * 0.28, radius * 0.28, thickness + 0.02, 24]} />
        <meshPhysicalMaterial {...MAT_STEEL_DARK} />
      </mesh>
    </group>
  );
}

function BoltedPlateShape({ width = 1.2, height = 0.85 }) {
  const corners: [number, number][] = [
    [width / 2 - 0.14, height / 2 - 0.14],
    [-(width / 2 - 0.14), height / 2 - 0.14],
    [width / 2 - 0.14, -(height / 2 - 0.14)],
    [-(width / 2 - 0.14), -(height / 2 - 0.14)],
  ];
  return (
    <group>
      <mesh>
        <boxGeometry args={[width, height, 0.06]} />
        <meshPhysicalMaterial {...MAT_STEEL_LIGHT} />
      </mesh>
      {corners.map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.09, 6]} />
          <meshPhysicalMaterial {...MAT_STEEL_DARK} />
        </mesh>
      ))}
    </group>
  );
}

function HexBoltShape({ headRadius = 0.16, headHeight = 0.14, shaftLength = 0.5 }) {
  return (
    <group>
      <mesh position={[0, headHeight / 2, 0]}>
        <cylinderGeometry args={[headRadius, headRadius, headHeight, 6]} />
        <meshPhysicalMaterial {...MAT_STEEL_DARK} />
      </mesh>
      <mesh position={[0, -shaftLength / 2, 0]}>
        <cylinderGeometry args={[headRadius * 0.42, headRadius * 0.42, shaftLength, 20]} />
        <meshPhysicalMaterial {...MAT_STEEL_LIGHT} />
      </mesh>
    </group>
  );
}

const PARTS = {
  gear: GearShape,
  plate: BoltedPlateShape,
  bolt: HexBoltShape,
};

type PartType = keyof typeof PARTS;

function PartPiece({
  position,
  type,
  rotation = [0, 0, 0],
  scale = 1,
  spins = false,
  bobAmount = 0.09,
}: {
  position: [number, number, number];
  type: PartType;
  rotation?: [number, number, number];
  scale?: number;
  spins?: boolean;
  bobAmount?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const spinSpeed = useMemo(() => 0.25 + Math.random() * 0.15, []);
  const bobSpeed = useMemo(() => 0.3 + Math.random() * 0.15, []);
  const bobPhase = useMemo(() => Math.random() * Math.PI * 2, []);
  const baseY = position[1];
  const Part = PARTS[type];

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    // Cuma gear yang boleh muter kontinu — objek lain (plat, baut)
    // cuma melayang, gak ikut rotasi otomatis. Gear menghadap kamera
    // (axis-nya = world Z), jadi spin pakai rotation.z biar muter
    // di tempat kayak gear sungguhan, bukan jungkit di sumbu Y.
    if (spins) {
      groupRef.current.rotation.z = rotation[2] + t * spinSpeed;
    }
    groupRef.current.position.y = baseY + Math.sin(t * bobSpeed + bobPhase) * bobAmount;
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <Part />
    </group>
  );
}

// Parallax halus: seluruh scene bergeser dikit mengikuti posisi mouse,
// jadi ada gerakan utama yang bukan "muter". Pointer di-track di level
// window (bukan cuma di atas canvas), supaya parallax tetap merespons
// walau kursor lagi di atas blok teks hero — bukan cuma di luar
// container-brand.
function ParallaxRig({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const { gl } = useThree();
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [gl]);

  useFrame(() => {
    if (!groupRef.current) return;
    const targetY = pointer.current.x * 0.35;
    const targetX = -pointer.current.y * 0.2;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetY,
      0.04
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      0.04
    );
  });

  return <group ref={groupRef}>{children}</group>;
}

function SceneContent() {
  return (
    <ParallaxRig>
      <EnvironmentMap />
      {/* Kiri-atas */}
      <PartPiece
        position={[-3.5, 1.7, -0.3]}
        type="gear"
        scale={0.9}
        spins
      />
      {/* Kanan-atas */}
      <PartPiece
        position={[3.5, 1.7, -0.3]}
        type="plate"
        scale={0.85}
        rotation={[0, -0.3, 0]}
      />
      {/* Kiri-bawah */}
      <PartPiece
        position={[-3.4, -1.7, -0.2]}
        type="plate"
        scale={0.85}
        rotation={[0, 0.3, 0]}
      />
      {/* Kanan-bawah */}
      <PartPiece
        position={[3.4, -1.7, -0.2]}
        type="bolt"
        scale={0.9}
      />
    </ParallaxRig>
  );
}

export default function HeroScene() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={`absolute inset-0 z-0 transition-opacity duration-300 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.65} />
        <spotLight position={[0, 10, 7]} angle={0.55} penumbra={1} intensity={1.3} />
        <spotLight position={[0, -6, 8]} angle={0.6} penumbra={1} intensity={0.5} />
        <pointLight position={[-5, 2, 5]} intensity={0.4} />
        <pointLight position={[5, 2, 5]} intensity={0.4} />
        {mounted && <SceneContent />}
      </Canvas>
    </div>
  );
}
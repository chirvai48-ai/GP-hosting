"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { RefObject, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { forwardRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
interface MatProps {
  color: string;
  metalness?: number;
  roughness?: number;
}

type OriginalPositions = {
  mesh1?: { x: number; y: number; z: number };
  mesh2?: { x: number; y: number; z: number };
  mesh3?: { x: number; y: number; z: number };
  mesh4?: { x: number; y: number; z: number };
  mesh5?: { x: number; y: number; z: number };
};

type MeshRefs = {
  mesh1?: THREE.Mesh | null;
  mesh2?: THREE.Mesh | null;
  mesh3?: THREE.Mesh | null;
  mesh4?: THREE.Mesh | null;
  mesh5?: THREE.Mesh | null;
};

const Mat = ({ color, metalness = 0.4, roughness = 0.4 }: MatProps) => (
  <meshStandardMaterial
    color={color}
    metalness={metalness}
    roughness={roughness}
  />
);

function gsapAnimationStart(identifier: number, ref: MeshRefs) {
  const { mesh1, mesh2, mesh3, mesh4, mesh5 } = ref;

  if (identifier === 1) {
    if (!mesh1 || !mesh2 || !mesh3) return;
    gsap.to(mesh1.position, {
      y: -2,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
    });
    gsap.to(mesh2.position, {
      x: 2,
      duration: 1,
      repeat: -1,
      yoyo: true,
    });
    gsap.to(mesh3.position, {
      y: 2,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
    });
  }
  if (identifier === 2) {
    if (!mesh1 || !mesh2 || !mesh3 || !mesh4 || !mesh5) return;
    
    gsap.to(mesh1.position, { y: -2.2, duration: 0.45, repeat: -1, yoyo: true, ease: "power1.inOut" });
    gsap.to(mesh1.rotation, { z: Math.PI, duration: 0.9, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(mesh2.rotation, { z: 0.6, duration: 0.7, repeat: -1, yoyo: true, ease: "power2.inOut" });
    gsap.to(mesh3.position, { x: -0.5, z: 1.5, duration: 0.8, repeat: -1, yoyo: true });
    gsap.to(mesh4.position, { y: 2.8, x: -0.5, duration: 0.6, repeat: -1, yoyo: true });
    gsap.to(mesh5.position, { y: 0.3, x: 2.2, z: 0.8, duration: 0.75, repeat: -1, yoyo: true });
  }
  if (identifier === 3) {
    if (!mesh1 || !mesh2 || !mesh3 || !mesh4) return;
    // More interesting: pentagon torus spins, sphere pulses outward, cylinder flips, top sphere orbits
    gsap.to(mesh1.position, { y: -2.5, x: 0.8, duration: 0.65, repeat: -1, yoyo: true, ease: "power2.inOut" });
    gsap.to(mesh1.rotation, { x: Math.PI, duration: 1.0, repeat: -1, yoyo: true });
    gsap.to(mesh2.position, { z: 1.5, x: 1.0, duration: 0.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(mesh3.position, { x: -2.0, y: 0.3, duration: 0.9, repeat: -1, yoyo: true });
    gsap.to(mesh3.rotation, { z: 0, duration: 0.9, repeat: -1, yoyo: true });
    gsap.to(mesh4.position, { y: 2.8, x: 0.7, z: 0.5, duration: 0.55, repeat: -1, yoyo: true, ease: "power1.inOut" });
  }
}

function gsapAnimationStop(ref: MeshRefs, origins: OriginalPositions) {
  const pairs = (
    [
      [ref.mesh1, origins.mesh1],
      [ref.mesh2, origins.mesh2],
      [ref.mesh3, origins.mesh3],
      [ref.mesh4, origins.mesh4],
      [ref.mesh5, origins.mesh5],
    ] as [
      THREE.Mesh | null | undefined,
      { x: number; y: number; z: number } | undefined,
    ][]
  ).filter(([mesh, origin]) => !!mesh && !!origin) as [
    THREE.Mesh,
    { x: number; y: number; z: number },
  ][];

  gsap.killTweensOf(pairs.map(([mesh]) => mesh.position));
  gsap.killTweensOf(pairs.map(([mesh]) => mesh.rotation));

  pairs.forEach(([mesh, origin]) => {
    gsap.to(mesh.position, {
      x: origin.x,
      y: origin.y,
      z: origin.z,
      duration: 1.0,
      ease: "power2.inOut",
    });
  });
}


const StaticBackground = ({
  color,
  x = 0,
}: {
  color: string;
  x?: number;
}) => {
  return (
    <mesh position={[x, 0, -2]} renderOrder={-1}>
      <planeGeometry args={[7, 7]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.18}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
};

const QuarterCutDisc = () => {
  const shape = new THREE.Shape();
  const startAngle = Math.PI / 2;
  const endAngle = Math.PI / 2 + (3 * Math.PI) / 2;
  shape.moveTo(0, 0);
  shape.absarc(0, 0, 1.5, startAngle, endAngle, false);
  shape.lineTo(0, 0);
  return (
    <mesh>
      <extrudeGeometry args={[shape, { depth: 0.5, bevelEnabled: false }]} />
      <Mat color="#8888ff" metalness={0.3} roughness={0.4} />
    </mesh>
  );
};

const Group1 = forwardRef<THREE.Group>((_, ref) => {
  const meshRefs = useRef<MeshRefs>({
    mesh1: null,
    mesh2: null,
    mesh3: null,
  });

  const originalPositions = useRef<OriginalPositions | null>(null);

  const captureOriginsIfNeeded = () => {
    if (originalPositions.current) return;
    const { mesh1, mesh2, mesh3 } = meshRefs.current;
    if (!mesh1 || !mesh2 || !mesh3) return;

    originalPositions.current = {
      mesh1: { x: mesh1.position.x, y: mesh1.position.y, z: mesh1.position.z },
      mesh2: { x: mesh2.position.x, y: mesh2.position.y, z: mesh2.position.z },
      mesh3: { x: mesh3.position.x, y: mesh3.position.y, z: mesh3.position.z },
    };
  };

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.5;
  });

  return (
    <group
      ref={ref}
      onPointerEnter={() => {
        captureOriginsIfNeeded();
        gsapAnimationStart(1, meshRefs.current);
      }}
      onPointerLeave={() => {
        if (!originalPositions.current) return;
        gsapAnimationStop(meshRefs.current, originalPositions.current);
      }}
    >
      {/* Invisible enlarged hit area */}
      <mesh visible={false}>
        <boxGeometry args={[6, 6, 4]} />
        <meshBasicMaterial />
      </mesh>

      <mesh position={[0, -1.8, 0]} ref={(el) => (meshRefs.current.mesh1 = el)}>
        <coneGeometry args={[0.5, 0.8, 9, 32]} />
        <Mat color="#ff8844" />
      </mesh>

      <QuarterCutDisc />

      <mesh
        position={[0.5, 0.5, 0.32]}
        ref={(el) => (meshRefs.current.mesh2 = el)}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <Mat color="#00ffcc" metalness={0.6} roughness={0.2} />
      </mesh>

      <mesh
        position={[0.85, 1.25, 0.18]}
        ref={(el) => (meshRefs.current.mesh3 = el)}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <Mat color="#ffffff" metalness={0.8} roughness={0.1} />
      </mesh>

      <Html position={[0, -3.2, 0]} center>
        <div style={{
          color: "#1a1a2e",
          fontWeight: 700,
          fontSize: "14px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          background: "rgba(255,200,100,0.92)",
          padding: "5px 14px",
          borderRadius: "20px",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          userSelect: "none",
        }}>
          For Recruiters
        </div>
      </Html>
    </group>
  );
});

const Group2 = forwardRef<THREE.Group>((_, ref) => {
  const meshRefs = useRef<MeshRefs>({
    mesh1: null,
    mesh2: null,
    mesh3: null,
    mesh4: null,
    mesh5: null,
  });

  const originalPositions = useRef<OriginalPositions | null>(null);

  const captureOriginsIfNeeded = () => {
    if (originalPositions.current) return;
    const { mesh1, mesh2, mesh3, mesh4, mesh5 } = meshRefs.current;
    if (!mesh1 || !mesh2 || !mesh3 || !mesh4 || !mesh5) return;

    originalPositions.current = {
      mesh1: { x: mesh1.position.x, y: mesh1.position.y, z: mesh1.position.z },
      mesh2: { x: mesh2.position.x, y: mesh2.position.y, z: mesh2.position.z },
      mesh3: { x: mesh3.position.x, y: mesh3.position.y, z: mesh3.position.z },
      mesh4: { x: mesh4.position.x, y: mesh4.position.y, z: mesh4.position.z },
      mesh5: { x: mesh5.position.x, y: mesh5.position.y, z: mesh5.position.z },
    };
  };

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.6;
  });
  return (
    <group
      ref={ref}
      onPointerEnter={() => {
        captureOriginsIfNeeded();
        gsapAnimationStart(2, meshRefs.current);
      }}
      onPointerLeave={() => {
        if (!originalPositions.current) return;
        gsapAnimationStop(meshRefs.current, originalPositions.current);
      }}
    >
      {/* Invisible enlarged hit area */}
      <mesh visible={false}>
        <boxGeometry args={[6, 6, 4]} />
        <meshBasicMaterial />
      </mesh>

      <mesh position={[0, -0.9, 0]} ref={(el) => (meshRefs.current.mesh1 = el)}>
        <torusGeometry args={[0.4, 0.2, 16, 64]} />
        <Mat color="#ffaa00" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh
        position={[0, -0.1, 0]}
        rotation={[0, 0, -1]}
        ref={(el) => (meshRefs.current.mesh2 = el)}
      >
        <cylinderGeometry args={[0.08, 0.08, 4, 16]} />
        <Mat color="#aaaaaa" metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh
        position={[-1.9, -0.7, 0]}
        ref={(el) => (meshRefs.current.mesh3 = el)}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <Mat color="#ff4466" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh
        position={[1.2, 1.8, 0]}
        ref={(el) => (meshRefs.current.mesh4 = el)}
      >
        <sphereGeometry args={[0.25, 32, 32]} />
        <Mat color="#4488ff" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh
        position={[1.3, 1.2, 0]}
        ref={(el) => (meshRefs.current.mesh5 = el)}
      >
        <sphereGeometry args={[0.38, 32, 32]} />
        <Mat color="#aa44ff" metalness={0.5} roughness={0.3} />
      </mesh>

      <Html position={[0, -3.2, 0]} center>
        <div style={{
          color: "#1a1a2e",
          fontWeight: 700,
          fontSize: "14px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          background: "rgba(100,200,255,0.92)",
          padding: "5px 14px",
          borderRadius: "20px",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          userSelect: "none",
        }}>
          For Individuals
        </div>
      </Html>
    </group>
  );
});

const Group3 = forwardRef<THREE.Group>((_, ref) => {
  const meshRefs = useRef<MeshRefs>({
    mesh1: null,
    mesh2: null,
    mesh3: null,
    mesh4: null,
  });

  const originalPositions = useRef<OriginalPositions | null>(null);
  const captureOriginsIfNeeded = () => {
    if (originalPositions.current) return;
    const { mesh1, mesh2, mesh3, mesh4 } = meshRefs.current;
    if (!mesh1 || !mesh2 || !mesh3 || !mesh4) return;

    originalPositions.current = {
      mesh1: { x: mesh1.position.x, y: mesh1.position.y, z: mesh1.position.z },
      mesh2: { x: mesh2.position.x, y: mesh2.position.y, z: mesh2.position.z },
      mesh3: { x: mesh3.position.x, y: mesh3.position.y, z: mesh3.position.z },
      mesh4: { x: mesh4.position.x, y: mesh4.position.y, z: mesh4.position.z },
    };
  };
  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.3;
  });
  return (
    <group
      ref={ref}
      onPointerEnter={() => {
        captureOriginsIfNeeded();
        gsapAnimationStart(3, meshRefs.current);
      }}
      onPointerLeave={() => {
        if (!originalPositions.current) return;
        gsapAnimationStop(meshRefs.current, originalPositions.current);
      }}
    >
      {/* Invisible enlarged hit area */}
      <mesh visible={false}>
        <boxGeometry args={[6, 6, 4]} />
        <meshBasicMaterial />
      </mesh>

      <mesh position={[0, -1, 0]} ref={(el) => (meshRefs.current.mesh1 = el)}>
        <torusGeometry args={[0.55, 0.2, 5, 64]} />
        <Mat color="#ff4499" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.1, 0]} ref={(el) => (meshRefs.current.mesh2 = el)}>
        <sphereGeometry args={[0.38, 32, 32]} />
        <Mat color="#00ccff" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh
        position={[0, 0.75, 0]}
        rotation={[0, 0, -1.55]}
        ref={(el) => (meshRefs.current.mesh3 = el)}
      >
        <cylinderGeometry args={[0.25, 0.25, 1, 32]} />
        <Mat color="#ffcc00" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.3, 0]} ref={(el) => (meshRefs.current.mesh4 = el)}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <Mat color="#88ff44" metalness={0.6} roughness={0.2} />
      </mesh>

      <Html position={[0, -3.2, 0]} center>
        <div style={{
          color: "#1a1a2e",
          fontWeight: 700,
          fontSize: "14px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          background: "rgba(150,255,150,0.92)",
          padding: "5px 14px",
          borderRadius: "20px",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          userSelect: "none",
        }}>
          Contact Us
        </div>
      </Html>
    </group>
  );
});


const SceneController = ({
  refs,
}: {
  refs: [
    RefObject<THREE.Group>,
    RefObject<THREE.Group>,
    RefObject<THREE.Group>,
  ];
}) => {
  const [ref1, ref2, ref3] = refs;
  const distance = 12;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!ref1.current || !ref2.current || !ref3.current) return;

    gsap.set(ref1.current.position, { x: 0 });
    gsap.set(ref2.current.position, { x: distance });
    gsap.set(ref3.current.position, { x: distance * 2 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#scroll-container",
        start: "top top",
        end: "300% top",
        scrub: true,
        pin: true,
      },
    });

    tl.to(ref1.current.position, { x: -distance, duration: 1 }, 0)
      .to(ref2.current.position, { x: 0, duration: 1 }, 0)
      .to(ref3.current.position, { x: distance, duration: 1 }, 0);

    tl.to(ref1.current.position, { x: -distance * 2, duration: 1 }, 1)
      .to(ref2.current.position, { x: -distance, duration: 1 }, 1)
      .to(ref3.current.position, { x: 0, duration: 1 }, 1);

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
};

// Backgrounds sit outside all groups so they never inherit group rotation
const StaticBackgrounds = ({
  refs,
}: {
  refs: [RefObject<THREE.Group>, RefObject<THREE.Group>, RefObject<THREE.Group>];
}) => {
  const bg1 = useRef<THREE.Mesh>(null);
  const bg2 = useRef<THREE.Mesh>(null);
  const bg3 = useRef<THREE.Mesh>(null);
  const distance = 12;

  useFrame(() => {
    const [r1, r2, r3] = refs;
    if (r1.current && bg1.current) {
      bg1.current.position.x = r1.current.position.x;
      bg1.current.position.y = 0;
    }
    if (r2.current && bg2.current) {
      bg2.current.position.x = r2.current.position.x;
      bg2.current.position.y = 0;
    }
    if (r3.current && bg3.current) {
      bg3.current.position.x = r3.current.position.x;
      bg3.current.position.y = 0;
    }
  });

  return (
    <>
      <mesh ref={bg1} position={[0, 0, -2]} renderOrder={-1}>
        <planeGeometry args={[7, 7]} />
        <meshStandardMaterial color="#ff8844" transparent opacity={0.13} depthWrite={false} />
      </mesh>
      <mesh ref={bg2} position={[distance, 0, -2]} renderOrder={-1}>
        <planeGeometry args={[7, 7]} />
        <meshStandardMaterial color="#4488ff" transparent opacity={0.13} depthWrite={false} />
      </mesh>
      <mesh ref={bg3} position={[distance * 2, 0, -2]} renderOrder={-1}>
        <planeGeometry args={[7, 7]} />
        <meshStandardMaterial color="#88ff44" transparent opacity={0.13} depthWrite={false} />
      </mesh>
    </>
  );
};

const Logo = () => {
  const ref1 = useRef<THREE.Group>(null);
  const ref2 = useRef<THREE.Group>(null);
  const ref3 = useRef<THREE.Group>(null);


  return (
    <div id="scroll-container" className="w-screen h-screen">
      <Canvas orthographic camera={{ zoom: 50, position: [0, 0, 6] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <pointLight position={[-3, -3, 3]} intensity={1} />
        <pointLight position={[4, -2, 4]} intensity={0.6} color="#8888ff" />
        <StaticBackgrounds refs={[ref1, ref2, ref3]} />
        <Group1 ref={ref1} />
        <Group2 ref={ref2} />
        <Group3 ref={ref3} />
        <SceneController refs={[ref1, ref2, ref3]} />
      </Canvas>
    </div>
  );
};

export default Logo;
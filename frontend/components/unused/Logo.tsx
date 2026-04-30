"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useEffect, useState } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { Bounds, Center } from "@react-three/drei";

type MeshData = {
    geometry: THREE.BufferGeometry,
    material: THREE.Material
}

function LogothreeD() {
  const logoref = useRef<THREE.Group | null>(null);
   const state = useThree()

useEffect(() => {
  console.log(state)
})
  const [svgdata, setSvgdata] = useState<any>(null);
  useEffect(() => {
    async function loadSVG() {
      const loader = new SVGLoader();
      const data = await loader.loadAsync("/logowhite.svg");
      setSvgdata(data);
    }
    loadSVG();
  }, []);

  const meshes = useMemo(() => {
    if (!svgdata) return []
    const temp:MeshData[] = []
    svgdata.paths.forEach((path: any) => {
      const shapes = SVGLoader.createShapes(path);
      
      shapes.forEach((shape) => {
        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: 20,
          bevelEnabled: true,
          bevelThickness: 2,
          bevelSize: 1.5,
          bevelSegments: 5,
        });
        
        const material = new THREE.MeshStandardMaterial({
          color: "green"
        });

        temp.push({ geometry, material });
      });
    });

    return temp
  }, [svgdata]);

  useFrame((_, delta) => {
    if(!logoref.current) return null;
    logoref.current.rotation.y += 2 * delta
  })
  return (
    <group ref={logoref} rotation={[Math.PI, 0, 0]}>
        {
            meshes.map((mesh,index) => (
                <mesh key={index} geometry={mesh.geometry} material={mesh.material} />
            ))
        }

    </group>
  );
}


function Logo() {
  return(
    <div className="w-screen h-screen">
      <Canvas camera={{ position: [0, 0, 500], fov: 50 }}  >
           <ambientLight intensity={1} />
            <directionalLight position={[10, 10, 10]} />
            <Bounds fit clip observe margin={1.2}>
              <LogothreeD />
            </Bounds>

      </Canvas>
    </div>
  )
}

export default Logo;
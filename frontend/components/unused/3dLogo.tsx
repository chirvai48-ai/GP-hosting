"use client";
import { useRef, useMemo, useEffect, useState } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";

type MeshData = {
    geometry: THREE.BufferGeometry,
    material: THREE.Material
}

function LogothreeD() {
  const [svgdata, setSvgdata] = useState<any>(null);
  useEffect(() => {
    async function loadSVG() {
      const loader = new SVGLoader();
      const data = await loader.loadAsync("/bitmap.svg");
      setSvgdata(data);
    }
    loadSVG();
  }, []);

  const meshes = useMemo(() => {
    if (!svgdata) return [];
    const temp:MeshData[] = []
    svgdata.paths.forEach((path: any) => {
      const shapes:THREE.Shape[] = path.toShapes(true);
      shapes.forEach((shape) => {
        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: 10,
          bevelEnabled: true,
          bevelThickness: 1,
          bevelSize: 1,
          bevelSegments: 2,
          curveSegments:32,
        });

        geometry.computeVertexNormals();


        const material = new THREE.MeshStandardMaterial({
          color: path.color || "white",
        });

        temp.push({ geometry, material });
      });
    });

    return temp
  }, [svgdata]);

  return (
    <group>
        {
            meshes.map((mesh,index) => (
                <mesh key={index} geometry={mesh.geometry} material={mesh.material} />
            ))
        }
    </group>
  );
}
export default LogothreeD;

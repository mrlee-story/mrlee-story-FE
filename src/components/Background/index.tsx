import { Sphere, useScroll } from "@react-three/drei";
import { ThreeElements, useFrame, useLoader } from "@react-three/fiber";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export const Background = () => {
    const texture = useLoader(THREE.TextureLoader, 'image-3d/background-with-simple-white-wall.jpg');
    const ref = useRef<THREE.Mesh>();
    const material = useRef<THREE.MeshBasicMaterial>(null);
    const color = useRef({
        color: "#b9bcff",
    });

    const data = useScroll() as any;

    const tl = useRef<any>(null);

    useFrame(() => {
        tl.current?.progress(data.scroll.current);
        const materialCurrent = material.current;
        if (materialCurrent!=null) {
            materialCurrent.color = new THREE.Color(color.current.color);
        }
    });

    useEffect(() => {
        if (!ref?.current) return;
        ref.current.scale.set(30, 30, 30);

        tl.current = gsap.timeline();
        tl.current.to(color.current, {
        color: "#888888",
        });
        tl.current.to(color.current, {
        color: "#7a7ca5",
        });
        tl.current.to(color.current, {
        color: "#9b96dd",
        });
    }, []);

    return (
        <group>
            <mesh ref={ref}>
                <meshBasicMaterial map={texture} />
            </mesh>
        <Sphere scale={[30, 30, 30]}>
            <meshBasicMaterial ref={material} side={THREE.BackSide} toneMapped={false} />
        </Sphere>
        </group>
    );
};
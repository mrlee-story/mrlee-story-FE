import { Html } from '@react-three/drei';
import { MeshProps, useFrame } from '@react-three/fiber';
import { useSpring } from 'framer-motion';
import React, { LegacyRef, useRef, useState } from 'react'
import * as THREE from 'three';
import { motion as motion3d } from 'framer-motion-3d';

interface BubbleCircleProps {
    percentage: number;
    label: string;
    position: THREE.Vector3;
}
export default function BubbleCircle(props:BubbleCircleProps) {
    const [hovered, setHovered] = useState(false);
    const ref = useRef<any>(null);
  
    const { percentage, label, position } = props;
    const size = percentage / 100;
    const colorValue = (1-size) * 0.5;
    const color = new THREE.Color(`hsl(0, 0%, ${colorValue * 100}%`);

    return (
        <motion3d.mesh
            ref={ref}
            position={position}
            scale={hovered ? [size + 0.2, size + 0.2, size + 0.2] : [size, size, size]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            transition={{
            type: 'spring',
            stiffness: 300,
            damping: 10,
            bounce:50
            }}
        >
            <circleGeometry args={[1, 64]} />
            <meshBasicMaterial color={color} />
            {hovered && (
            <Html center style={{ pointerEvents: 'none' }}>
                <div style={{ background: 'white', padding: '5px', borderRadius: '5px' }}>
                {label}: {percentage}%
                </div>
            </Html>
            )}
        </motion3d.mesh>
        );
}
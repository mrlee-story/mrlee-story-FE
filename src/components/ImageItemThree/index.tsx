import { useIntersect } from '@react-three/drei';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import React, { useRef, useState } from 'react'
import * as THREE from 'three';
import { getRandomCoefficient } from 'utils';

interface ImageItemProps {
    url: string;
    scaleRatio: number;
    position: any;
    isBubbleEffect?:boolean;
    bubbleEffectRatioY?:number[];
    bubbleEffectRatioT?:number[];
    isUnsetMotion?:boolean;

    hoverZoomRatio?:number;
}

export default function ImageItem(props:ImageItemProps) {
    const { url, scaleRatio, position, isBubbleEffect, bubbleEffectRatioY, bubbleEffectRatioT, isUnsetMotion, hoverZoomRatio } = props;

    const texture = useLoader(THREE.TextureLoader, url);
    const visible = useRef(false);
    const [hovered, setHovered] = useState(false);

    const { viewport } = useThree();
    const aspect = texture.image.width / texture.image.height;
    const maxDimension = Math.min(viewport.width, viewport.height);
    const width = aspect>=1 ? maxDimension : maxDimension * aspect;
    const height = aspect>=1 ? maxDimension / aspect : maxDimension;

    const ref = useIntersect((isVisible) => (visible.current = isVisible)) as React.MutableRefObject<THREE.Mesh>;
    const materialRef = useRef<THREE.MeshBasicMaterial>();
    // const { height } = useThree((state) => state.viewport);

    // Bubble 효과 관련
    const time = useRef(0);

    const randomCoefficientY:number = bubbleEffectRatioY ? getRandomCoefficient(bubbleEffectRatioY[0], bubbleEffectRatioY[1]) : getRandomCoefficient(0.01, 0.1);
    const randomCoefficientTime:number = bubbleEffectRatioT? getRandomCoefficient(bubbleEffectRatioT[0], bubbleEffectRatioT[1]) : getRandomCoefficient(0.05, 0.1);
    
    const originalRenderOrder = useRef(0);

    useFrame((state, delta) => {
        if (ref?.current) {
            // 초기 효과
            if (!isUnsetMotion) {
                ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, visible.current ? 0 : -height / 3 + 1, 4, delta);
                ref.current.position.z = 0.001;
            }
            // bubble 효과
            if (isBubbleEffect) {
                time.current += getRandomCoefficient(-0.01, 0.01) >= 0 ? randomCoefficientTime : -randomCoefficientTime;
                ref.current.position.y = ref.current.position.y + Math.sin(time.current) * randomCoefficientY;
            }
            // hover 효과
            ref.current.scale.set(
                width * scaleRatio * (hovered ? (hoverZoomRatio? hoverZoomRatio : 1.15) : 1),
                height * scaleRatio * (hovered ? (hoverZoomRatio? hoverZoomRatio : 1.15) : 1),
                1
            );

        }

        if (materialRef?.current) {
            if (hovered) {
                materialRef.current.color.set(0xDDDDDD);
            } else {
                materialRef.current.color.set(0xffffff);
            }
        }
    });
    return (
        <group position={position}>
            {
                <mesh ref={ref}  scale={[width*scaleRatio, height*scaleRatio, 1]} 
                        onPointerOver={() => {setHovered(true); originalRenderOrder.current = ref.current.renderOrder; ref.current.renderOrder = 9999;}} 
                        onPointerOut={() => {setHovered(false); ref.current.renderOrder = originalRenderOrder.current;}}
                        >
                    <planeGeometry args={[1,1]} />
                    <meshBasicMaterial ref={materialRef} map={texture} transparent={true} />
                </mesh>
            }
        </group>
    );
}
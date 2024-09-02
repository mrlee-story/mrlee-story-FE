import { ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { atom, useAtom } from 'jotai';
import React, { useEffect, useRef, useState } from 'react'
import useNotionAPICacheStore, { MilestoneInfo } from 'store/notion-api-cache-store';
import { motion } from 'framer-motion-3d';
import { animate, useMotionValue } from 'framer-motion';
import * as THREE from 'three';
import { Image, OrthographicCamera, Text, useCamera } from '@react-three/drei';
import { NavigateFunction } from 'react-router-dom';
import { MILESTONES_PATH } from 'constant';

interface ProjectGalleryProps {
    projects: MilestoneInfo[];
    currentProject:number;
    navigator:NavigateFunction;
    isMobile:boolean;
}


export default function ProjectsGallery({projects, currentProject, navigator, isMobile}:ProjectGalleryProps) {

    const { viewport, camera } = useThree();
    const wControlUnit = (viewport.width / 100);
    const hControlUnit = -viewport.height//(((0*h))/SECTION_COUNT);

    const groupRef = useRef<THREE.Group>();

    const position = isMobile? new THREE.Vector3(0, hControlUnit*0, wControlUnit*70) : new THREE.Vector3(0, hControlUnit*0.25, wControlUnit*50);

    return (
        <>
            <group ref={groupRef} dispose={null} scale={isMobile? 100 : 180} position={position} 
                rotation={[(Math.PI/-180)*0, (Math.PI/-180)*-90, (Math.PI/-180)*2]}
            >
            { projects && projects.map((project, index) => (
                <motion.group
                key={"project_" + index}
                // position={[0, 0, 0]}
                // rotation={[3.127, 0.018, -3.141]}
                animate={{
                    x: (0 + (index-currentProject)*1.5),
                    y: currentProject === index ? 0.8 : -0.1,
                    z: currentProject === index ? -2 : -3,
                    rotateX: currentProject === index ? 0 : -Math.PI / 3,
                    rotateZ: currentProject === index ? 0 : -0.1 * Math.PI,
                }}
                >
                <Project project={project} highlighted={index === currentProject} navigator={navigator} />
                </motion.group>
            ))}
            </group>
        </>
    );
};

interface ProjectProps {
    project:MilestoneInfo;
    highlighted:boolean;
    navigator:NavigateFunction;
}

const Project = ({project, highlighted, navigator}:ProjectProps) => {

    const background = useRef<THREE.Mesh>();
    const bgOpacity = useMotionValue(0.4);
    const [hovered, setHovered] = useState<boolean>(false);

    useEffect(() => {
        return (() => {
            document.body.style.cursor = 'default';
        })
    }, []);

    useEffect(() => {
        animate(bgOpacity, highlighted ? 0.7 : 0.4);
    }, [highlighted]);

    useFrame(() => {
        if (!background?.current) return;

        (background.current.material as THREE.MeshBasicMaterial).opacity = bgOpacity.get();
    });

    const onPointerOverEffect = (e:ThreeEvent<PointerEvent>) => {
        e.stopPropagation(); 
        document.body.style.cursor = 'pointer';
        background.current.position.z = 0.007;
        setHovered(true);
    }
    const onPointerOutEffect = (e:ThreeEvent<PointerEvent>) => {
        e.stopPropagation(); 
        document.body.style.cursor = 'default';
        background.current.position.z = -0.05;
        setHovered(false);
    }
    const onClickEffect = (e:ThreeEvent<MouseEvent>) => {
        navigator(MILESTONES_PATH());
    }

    return (
        <group scale={highlighted? 1 : 0.7}>
            <mesh
                position-z={-0.05}
                onClick={highlighted && onClickEffect}
                ref={background}
                onPointerOver={highlighted && onPointerOverEffect}
                onPointerOut={highlighted && onPointerOutEffect}
            >
                <planeGeometry args={[2.2, 2]} />
                <meshBasicMaterial color="black" transparent opacity={0.4} />
                {
                    hovered && 
                    <Text
                        maxWidth={2}
                        anchorX={"center"}
                        anchorY={"middle"}
                        fontSize={0.2}
                        position={[0, 0, 0.009]}
                    >
                        이 프로젝트를 자세히 보고싶다면 클릭하세요.
                    </Text>
                }
            </mesh>
            <Image
                scale={[2, 1.2]}
                url={project.thumbnailUrl}
                toneMapped={false}
                position-y={0.4}
            />
            <Text
                maxWidth={2}
                anchorX={"left"}
                anchorY={"top"}
                fontSize={0.2}
                position={[-1, -0.4, 0]}
            >
                {project.name.toUpperCase()}
            </Text>
        </group>
    );
};

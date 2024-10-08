/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.18 .\ironman-super-hero-landing.glb 
*/

import React, { useEffect, useRef, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { GLTF } from 'three-stdlib';
import * as THREE from 'three';
import { useControls } from 'leva';
import { GLTFResult, ModelProps } from 'types/interface';
import { useFrame, useThree } from '@react-three/fiber';
import ImageItem from 'components/ImageItemThree';

export function Ironman(props:ModelProps) {
  const { animation, wireframe, section, copySection, isMobile } = props;
  const group = useRef<THREE.Group>(null);
  const imageRef = useRef<THREE.Group>(null);
  const { nodes, materials, animations } = useGLTF('/models-3d/ironman-super-hero-landing.glb') as GLTFResult;
  const { actions } = useAnimations(animations, group)
  const { camera } = useThree();

  const actionNames = 'SUPER-HERO-LANDING';

  const [ isVisible, setVisible ] = useState<boolean>(true);
  // const [ isImageVisible, setImageVisible ] = useState<boolean>(false);
  const fadeDuration = 2; // fade duration in seconds
  const startTimeRef = useRef<number>(-2);

  useEffect(() => {
    
    // 아이언맨 투명도 초기화
    if (copySection!==4) {
      setVisible(true);
      startTimeRef.current = -1;
      const action = actions[actionNames];
      action?.reset();
      action.time = 1;
      action.play();
      action.clampWhenFinished = true;
      action.loop = THREE.LoopOnce;
    }

    // 아바타 투명도 초기화
    imageRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        (child.material as THREE.MeshBasicMaterial).opacity = 0;
        (child.material as THREE.MeshBasicMaterial).transparent = true;
      }
    });
    imageRef.current.visible=false;
  }, [])
  
  useEffect(() => {
    const action = actions[actionNames];

    if (action) {
      action?.reset();
      action.time = 1;
      action.play();
      action.clampWhenFinished = true;
      action.loop = THREE.LoopOnce;
    }

    return () => {
      action?.reset().stop();
    }
  }, [actionNames]);

  useEffect(() => {
    const action = actions[actionNames];
    if (copySection==4) {
      action.reset().play().fadeOut(0.5);
      
      if (isVisible) {
        setVisible(false);
        startTimeRef.current = -1;
      }
      return;
    } else {
      setVisible(true);
      startTimeRef.current = -1;
      const action = actions[actionNames];
      action?.reset();
      action.time = 1;
      action.play();
      action.clampWhenFinished = true;
      action.loop = THREE.LoopOnce;

      if (!imageRef?.current) return;
      // 아바타 투명도 초기화
      imageRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          (child.material as THREE.MeshBasicMaterial).opacity = 0;
          (child.material as THREE.MeshBasicMaterial).transparent = true;
        }
      });
      imageRef.current.visible=false;
    }

    
  }, [section]);

  useEffect(() => {
    if (startTimeRef.current == -2 ) return;

    startTimeRef.current = 0;
  }, [isVisible])

  useFrame( ({clock}) => {
    if (startTimeRef.current<0) return;
    if (isVisible) {
      //  Fade Out Ironman
        const elapsed = clock.getElapsedTime();
        const progress = (elapsed - startTimeRef.current) / fadeDuration;
        // Fade In
        if (elapsed >= startTimeRef.current + fadeDuration) {
          const fadeInProgress = Math.min((elapsed - (startTimeRef.current + fadeDuration)) / fadeDuration, 1);
          group.current.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              (child.material as THREE.MeshBasicMaterial).opacity = fadeInProgress;
              (child.material as THREE.MeshBasicMaterial).transparent = true;
            }
          });


          if (fadeInProgress>=1) {
            group.current.visible = true;
            startTimeRef.current = -1;
          }
        }
    } else {
      // Fade In Ironman
      if (group.current) {
        // 시작 시간을 기록
        if (startTimeRef.current === 0) {
          startTimeRef.current = clock.getElapsedTime();
          // setImageVisible(true);
          imageRef.current.visible = true;
        }
  
        const elapsed = clock.getElapsedTime() - startTimeRef.current;
        const progress = Math.min(elapsed / fadeDuration, 1);
        
        // Opacity를 감소시키며 흐려지도록 설정
        group.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            (child.material as THREE.MeshBasicMaterial).opacity = 1 - progress;
            (child.material as THREE.MeshBasicMaterial).transparent = true;
          }
        });

        imageRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            (child.material as THREE.MeshBasicMaterial).opacity = progress;
            (child.material as THREE.MeshBasicMaterial).transparent = true;
          }
        });
  
        // Fade가 완료되면 group을 비활성화
        if (progress >= 1) {
          group.current.visible = false;
          startTimeRef.current = -1;
        }
      }
    }
  })


  return (
    <>
    <group ref={group} {...props} dispose={null} scale={1}>
      <group name="Scene">
        <group name="Armature001" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorigHips} />
          <skinnedMesh name="Cylinder01001" geometry={nodes.Cylinder01001.geometry} material={materials['HD_Ironman:darksilver.001']} skeleton={nodes.Cylinder01001.skeleton} />
          <skinnedMesh name="HD_IronmanObject01001" geometry={nodes.HD_IronmanObject01001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanObject01001.skeleton} />
          <skinnedMesh name="HD_IronmanObject02001" geometry={nodes.HD_IronmanObject02001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanObject02001.skeleton} />
          <skinnedMesh name="HD_IronmanObject03001" geometry={nodes.HD_IronmanObject03001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanObject03001.skeleton} />
          <skinnedMesh name="HD_IronmanObject04001" geometry={nodes.HD_IronmanObject04001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanObject04001.skeleton} />
          <skinnedMesh name="HD_IronmanObject05001" geometry={nodes.HD_IronmanObject05001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanObject05001.skeleton} />
          <skinnedMesh name="HD_IronmanObject06001" geometry={nodes.HD_IronmanObject06001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanObject06001.skeleton} />
          <skinnedMesh name="HD_IronmanObject07001" geometry={nodes.HD_IronmanObject07001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanObject07001.skeleton} />
          <skinnedMesh name="HD_IronmanObject08001" geometry={nodes.HD_IronmanObject08001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanObject08001.skeleton} />
          <skinnedMesh name="HD_IronmanObject09001" geometry={nodes.HD_IronmanObject09001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanObject09001.skeleton} />
          <skinnedMesh name="HD_IronmanObject10001" geometry={nodes.HD_IronmanObject10001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanObject10001.skeleton} />
          <skinnedMesh name="HD_IronmanObject11001" geometry={nodes.HD_IronmanObject11001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanObject11001.skeleton} />
          <skinnedMesh name="HD_IronmanObject12001" geometry={nodes.HD_IronmanObject12001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanObject12001.skeleton} />
          <skinnedMesh name="HD_IronmanPlane02001" geometry={nodes.HD_IronmanPlane02001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanPlane02001.skeleton} />
          <skinnedMesh name="HD_IronmanPlane03001" geometry={nodes.HD_IronmanPlane03001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanPlane03001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface2642001" geometry={nodes.HD_IronmanpolySurface2610_polySurface2642001.geometry} material={materials['lambert1.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface2642001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface2651001" geometry={nodes.HD_IronmanpolySurface2610_polySurface2651001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface2651001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface2652001" geometry={nodes.HD_IronmanpolySurface2610_polySurface2652001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface2652001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface2653001" geometry={nodes.HD_IronmanpolySurface2610_polySurface2653001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface2653001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface2654001" geometry={nodes.HD_IronmanpolySurface2610_polySurface2654001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface2654001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface2655001" geometry={nodes.HD_IronmanpolySurface2610_polySurface2655001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface2655001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface2725001" geometry={nodes.HD_IronmanpolySurface2610_polySurface2725001.geometry} material={materials['HD_Ironman:black.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface2725001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface2747001" geometry={nodes.HD_IronmanpolySurface2610_polySurface2747001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface2747001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface2765001" geometry={nodes.HD_IronmanpolySurface2610_polySurface2765001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface2765001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface2851001" geometry={nodes.HD_IronmanpolySurface2610_polySurface2851001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface2851001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface3060001" geometry={nodes.HD_IronmanpolySurface2610_polySurface3060001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface3060001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface3079001" geometry={nodes.HD_IronmanpolySurface2610_polySurface3079001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface3079001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface3090001" geometry={nodes.HD_IronmanpolySurface2610_polySurface3090001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface3090001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface3094001" geometry={nodes.HD_IronmanpolySurface2610_polySurface3094001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface3094001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface3108001" geometry={nodes.HD_IronmanpolySurface2610_polySurface3108001.geometry} material={materials['Iron_man_leg:gold.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface3108001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface3109001" geometry={nodes.HD_IronmanpolySurface2610_polySurface3109001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface3109001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface3118001" geometry={nodes.HD_IronmanpolySurface2610_polySurface3118001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface3118001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface3148001" geometry={nodes.HD_IronmanpolySurface2610_polySurface3148001.geometry} material={materials['Iron_man_leg:gold.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface3148001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface3154001" geometry={nodes.HD_IronmanpolySurface2610_polySurface3154001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface3154001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface3423001" geometry={nodes.HD_IronmanpolySurface2610_polySurface3423001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface3423001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface3540001" geometry={nodes.HD_IronmanpolySurface2610_polySurface3540001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface3540001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface3559001" geometry={nodes.HD_IronmanpolySurface2610_polySurface3559001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface3559001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface3570001" geometry={nodes.HD_IronmanpolySurface2610_polySurface3570001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface3570001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface3571001" geometry={nodes.HD_IronmanpolySurface2610_polySurface3571001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface3571001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface3572001" geometry={nodes.HD_IronmanpolySurface2610_polySurface3572001.geometry} material={materials['lambert1.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface3572001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface3573001" geometry={nodes.HD_IronmanpolySurface2610_polySurface3573001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface3573001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface3578001" geometry={nodes.HD_IronmanpolySurface2610_polySurface3578001.geometry} material={materials['HD_Ironman:black.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface3578001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface3579001" geometry={nodes.HD_IronmanpolySurface2610_polySurface3579001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface3579001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface3581001" geometry={nodes.HD_IronmanpolySurface2610_polySurface3581001.geometry} material={materials['Iron_man_leg:gold.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface3581001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface3582001" geometry={nodes.HD_IronmanpolySurface2610_polySurface3582001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface3582001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface3583001" geometry={nodes.HD_IronmanpolySurface2610_polySurface3583001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface3583001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface3584001" geometry={nodes.HD_IronmanpolySurface2610_polySurface3584001.geometry} material={materials['Iron_man_leg:gold.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface3584001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface3585001" geometry={nodes.HD_IronmanpolySurface2610_polySurface3585001.geometry} material={materials['HD_Ironman:red.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface3585001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface3586001" geometry={nodes.HD_IronmanpolySurface2610_polySurface3586001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface3586001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface3587001" geometry={nodes.HD_IronmanpolySurface2610_polySurface3587001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface3587001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2610_polySurface3588001" geometry={nodes.HD_IronmanpolySurface2610_polySurface3588001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface2610_polySurface3588001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2631_polySurface2610001" geometry={nodes.HD_IronmanpolySurface2631_polySurface2610001.geometry} material={materials['Iron_man_leg:gold.001']} skeleton={nodes.HD_IronmanpolySurface2631_polySurface2610001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface2631_polySurface2611001" geometry={nodes.HD_IronmanpolySurface2631_polySurface2611001.geometry} material={materials['Iron_man_leg:gold.001']} skeleton={nodes.HD_IronmanpolySurface2631_polySurface2611001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3666001" geometry={nodes.HD_IronmanpolySurface3666001.geometry} material={materials['Iron_man_leg:gold.001']} skeleton={nodes.HD_IronmanpolySurface3666001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3667001" geometry={nodes.HD_IronmanpolySurface3667001.geometry} material={materials['Iron_man_leg:gold.001']} skeleton={nodes.HD_IronmanpolySurface3667001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3848001" geometry={nodes.HD_IronmanpolySurface3848001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface3848001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3849001" geometry={nodes.HD_IronmanpolySurface3849001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface3849001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3850001" geometry={nodes.HD_IronmanpolySurface3850001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface3850001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3851001" geometry={nodes.HD_IronmanpolySurface3851001.geometry} material={materials['Iron_man_leg:gold.001']} skeleton={nodes.HD_IronmanpolySurface3851001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3852001" geometry={nodes.HD_IronmanpolySurface3852001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface3852001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3853001" geometry={nodes.HD_IronmanpolySurface3853001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface3853001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3854001" geometry={nodes.HD_IronmanpolySurface3854001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface3854001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3855001" geometry={nodes.HD_IronmanpolySurface3855001.geometry} material={materials['Iron_man_leg:gold.001']} skeleton={nodes.HD_IronmanpolySurface3855001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3860001" geometry={nodes.HD_IronmanpolySurface3860001.geometry} material={materials['HD_Ironman:silver.001']} skeleton={nodes.HD_IronmanpolySurface3860001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3861001" geometry={nodes.HD_IronmanpolySurface3861001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface3861001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3862001" geometry={nodes.HD_IronmanpolySurface3862001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface3862001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3863001" geometry={nodes.HD_IronmanpolySurface3863001.geometry} material={materials['Iron_man_leg:gold.001']} skeleton={nodes.HD_IronmanpolySurface3863001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3864001" geometry={nodes.HD_IronmanpolySurface3864001.geometry} material={materials['HD_Ironman:red.001']} skeleton={nodes.HD_IronmanpolySurface3864001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3865001" geometry={nodes.HD_IronmanpolySurface3865001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface3865001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3867001" geometry={nodes.HD_IronmanpolySurface3867001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface3867001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3868001" geometry={nodes.HD_IronmanpolySurface3868001.geometry} material={materials['Iron_man_leg:gold.001']} skeleton={nodes.HD_IronmanpolySurface3868001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3869001" geometry={nodes.HD_IronmanpolySurface3869001.geometry} material={materials['Iron_man_leg:gold.001']} skeleton={nodes.HD_IronmanpolySurface3869001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3870001" geometry={nodes.HD_IronmanpolySurface3870001.geometry} material={materials['HD_Ironman:yellow.001']} skeleton={nodes.HD_IronmanpolySurface3870001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3871001" geometry={nodes.HD_IronmanpolySurface3871001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface3871001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3872001" geometry={nodes.HD_IronmanpolySurface3872001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface3872001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3873001" geometry={nodes.HD_IronmanpolySurface3873001.geometry} material={materials['lambert1.001']} skeleton={nodes.HD_IronmanpolySurface3873001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3874001" geometry={nodes.HD_IronmanpolySurface3874001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface3874001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3875001" geometry={nodes.HD_IronmanpolySurface3875001.geometry} material={materials['HD_Ironman:silver.001']} skeleton={nodes.HD_IronmanpolySurface3875001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3876001" geometry={nodes.HD_IronmanpolySurface3876001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface3876001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3877001" geometry={nodes.HD_IronmanpolySurface3877001.geometry} material={materials['HD_Ironman:silver.001']} skeleton={nodes.HD_IronmanpolySurface3877001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3878001" geometry={nodes.HD_IronmanpolySurface3878001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface3878001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3880001" geometry={nodes.HD_IronmanpolySurface3880001.geometry} material={materials['HD_Ironman:silver.001']} skeleton={nodes.HD_IronmanpolySurface3880001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3882001" geometry={nodes.HD_IronmanpolySurface3882001.geometry} material={materials['HD_Ironman:silver.001']} skeleton={nodes.HD_IronmanpolySurface3882001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3883_group1001" geometry={nodes.HD_IronmanpolySurface3883_group1001.geometry} material={materials['HD_Ironman:silver.001']} skeleton={nodes.HD_IronmanpolySurface3883_group1001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3884001" geometry={nodes.HD_IronmanpolySurface3884001.geometry} material={materials['HD_Ironman:silver.001']} skeleton={nodes.HD_IronmanpolySurface3884001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3885001" geometry={nodes.HD_IronmanpolySurface3885001.geometry} material={materials['HD_Ironman:silver.001']} skeleton={nodes.HD_IronmanpolySurface3885001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3890001" geometry={nodes.HD_IronmanpolySurface3890001.geometry} material={materials['HD_Ironman:silver.001']} skeleton={nodes.HD_IronmanpolySurface3890001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3891001" geometry={nodes.HD_IronmanpolySurface3891001.geometry} material={materials['HD_Ironman:silver.001']} skeleton={nodes.HD_IronmanpolySurface3891001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3892001" geometry={nodes.HD_IronmanpolySurface3892001.geometry} material={materials['HD_Ironman:silver.001']} skeleton={nodes.HD_IronmanpolySurface3892001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3893001" geometry={nodes.HD_IronmanpolySurface3893001.geometry} material={materials['HD_Ironman:silver.001']} skeleton={nodes.HD_IronmanpolySurface3893001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3896_polySurface3916001" geometry={nodes.HD_IronmanpolySurface3896_polySurface3916001.geometry} material={materials['lambert1.001']} skeleton={nodes.HD_IronmanpolySurface3896_polySurface3916001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3908_polySurface3896001" geometry={nodes.HD_IronmanpolySurface3908_polySurface3896001.geometry} material={materials['lambert1.001']} skeleton={nodes.HD_IronmanpolySurface3908_polySurface3896001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3944001" geometry={nodes.HD_IronmanpolySurface3944001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface3944001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3946001" geometry={nodes.HD_IronmanpolySurface3946001.geometry} material={materials['lambert1.001']} skeleton={nodes.HD_IronmanpolySurface3946001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3948001" geometry={nodes.HD_IronmanpolySurface3948001.geometry} material={materials['HD_Ironman:silver.001']} skeleton={nodes.HD_IronmanpolySurface3948001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3949001" geometry={nodes.HD_IronmanpolySurface3949001.geometry} material={materials['lambert1.001']} skeleton={nodes.HD_IronmanpolySurface3949001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3950001" geometry={nodes.HD_IronmanpolySurface3950001.geometry} material={materials['HD_Ironman:silver.001']} skeleton={nodes.HD_IronmanpolySurface3950001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3951001" geometry={nodes.HD_IronmanpolySurface3951001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface3951001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3952001" geometry={nodes.HD_IronmanpolySurface3952001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface3952001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3954001" geometry={nodes.HD_IronmanpolySurface3954001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface3954001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3955001" geometry={nodes.HD_IronmanpolySurface3955001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface3955001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3956001" geometry={nodes.HD_IronmanpolySurface3956001.geometry} material={materials['Iron_man_leg:gold.001']} skeleton={nodes.HD_IronmanpolySurface3956001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3957001" geometry={nodes.HD_IronmanpolySurface3957001.geometry} material={materials['HD_Ironman:silver.001']} skeleton={nodes.HD_IronmanpolySurface3957001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3958001" geometry={nodes.HD_IronmanpolySurface3958001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface3958001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3959001" geometry={nodes.HD_IronmanpolySurface3959001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface3959001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3960001" geometry={nodes.HD_IronmanpolySurface3960001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface3960001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3961001" geometry={nodes.HD_IronmanpolySurface3961001.geometry} material={materials['Iron_man_leg:gold.001']} skeleton={nodes.HD_IronmanpolySurface3961001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3962001" geometry={nodes.HD_IronmanpolySurface3962001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface3962001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3963001" geometry={nodes.HD_IronmanpolySurface3963001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface3963001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3964001" geometry={nodes.HD_IronmanpolySurface3964001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface3964001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3965001" geometry={nodes.HD_IronmanpolySurface3965001.geometry} material={materials['Iron_man_leg:gold.001']} skeleton={nodes.HD_IronmanpolySurface3965001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3966001" geometry={nodes.HD_IronmanpolySurface3966001.geometry} material={materials['Iron_man_leg:red.001']} skeleton={nodes.HD_IronmanpolySurface3966001.skeleton} />
          <skinnedMesh name="HD_IronmanpolySurface3967001" geometry={nodes.HD_IronmanpolySurface3967001.geometry} material={materials['lambert1.001']} skeleton={nodes.HD_IronmanpolySurface3967001.skeleton} />
        </group>
      </group>
    </group>
    
      <group ref={imageRef} rotation={[0.1, -((-Math.PI/180) * 20), 0]} >
        <ImageItem url={"/images/8c1f3c74-2604-4dad-8bb2-7890b2e606db.png"} scaleRatio={isMobile? 0.85 : 0.65} position={[-1.3, 110, 0]} isUnsetMotion={true} />
      </group>
  </>
  )
}

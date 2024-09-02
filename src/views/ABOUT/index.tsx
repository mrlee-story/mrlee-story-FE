import { Scroll, ScrollControls, useScroll } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import Ability from 'components/Ability';
import ImageItem from 'components/ImageItemThree';
import { motion } from 'framer-motion';
import abilityMock from 'mocks/ability.mock';
import aboutIntroduceMock from 'mocks/model/about-introduce.mock';
import aboutMeMock from 'mocks/model/about-me.mock';
import { useEffect, useRef, useState } from 'react';
import './style.css';

const SECTION_COUNT = 5.3;

function ImageItems({isMobile}) {
    const { width: w, height: h } = useThree((state) => state.viewport);

    const wControlUnit = (w / 100);
    const hControlUnit = -h//(((0*h))/SECTION_COUNT);
    
    return (
        <Scroll>
            <ImageItem url={"/images/8c1f3c74-2604-4dad-8bb2-7890b2e606db.png"} scaleRatio={isMobile? 0.6 : 0.7} position={isMobile? [wControlUnit*30, hControlUnit*0.2, 0] : [wControlUnit*-8, 0, 0]} hoverZoomRatio={isMobile? 2 : null} />
            <ImageItem url={"/images/816a25d4-20a8-480d-b73e-a79a105a683e.png"} scaleRatio={0.5} position={[wControlUnit*30, 2.5, 0]} hoverZoomRatio={isMobile? 2 : null} />

            <ImageItem url={"/images/d8b59807-5220-40c5-9452-f6197d96705d.png"} scaleRatio={0.2} position={isMobile? [wControlUnit*0, hControlUnit*0.9, 1] : [wControlUnit*-25, hControlUnit*0.9, 1]} isBubbleEffect={true} hoverZoomRatio={isMobile? 2 : null} />
            <ImageItem url={"/images/0fc9e559-54e5-4449-9c66-9ef66e79d40e.png"} scaleRatio={0.1} position={isMobile? [wControlUnit*-35, hControlUnit*0.9, 1] : [wControlUnit*-35, hControlUnit*0.9, 0]} isBubbleEffect={true}  hoverZoomRatio={isMobile? 2 : null} />
            <ImageItem url={"/images/2b03f2db-83b9-4540-bc48-256fa94895ec.png"} scaleRatio={0.1} position={isMobile? [wControlUnit*35, hControlUnit*0.9, 1] : [wControlUnit*-15, hControlUnit*0.9, 0.1]} isBubbleEffect={true}  hoverZoomRatio={isMobile? 2 : null} />
            <ImageItem url={"/images/5259e75a-7294-4901-b1ba-ba51e0842079.png"} scaleRatio={0.1} position={isMobile? [wControlUnit*-30, hControlUnit*1.1, 1] : [wControlUnit*-30, hControlUnit*1.1, 0.2]} isBubbleEffect={true}  hoverZoomRatio={isMobile? 2 : null} />
            <ImageItem url={"/images/51189cfc-137f-461e-b5cc-99166cd83556.png"} scaleRatio={0.13} position={isMobile?[wControlUnit*30, hControlUnit*1.1, 1]  : [wControlUnit*-20, hControlUnit*1.1, 0.8]} isBubbleEffect={true}  hoverZoomRatio={isMobile? 2 : null} />
            <ImageItem url={"/images/518687ea-80cd-438b-a278-c0e395943a37.png"} scaleRatio={0.1} position={isMobile? [wControlUnit*30, hControlUnit*0.75, 1] : [wControlUnit*-20, hControlUnit*0.75, 0.4]} isBubbleEffect={true}  hoverZoomRatio={isMobile? 2 : null} />
            <ImageItem url={"/images/b002e8d4-31c6-47c2-938b-d664ede2dd9a.png"} scaleRatio={0.13} position={isMobile?[wControlUnit*-30, hControlUnit*0.75, 1]  : [wControlUnit*-30, hControlUnit*0.75, 0.9]} isBubbleEffect={true}  hoverZoomRatio={isMobile? 2 : null} />
            <ImageItem url={"/images/caa5b0fb-b332-48e9-8a20-47c3843a6b15.png"} scaleRatio={0.1} position={isMobile? [wControlUnit*-35, hControlUnit*1.2, 1] : [wControlUnit*-35, hControlUnit*1.2, 0.3]} isBubbleEffect={true}  hoverZoomRatio={isMobile? 2 : null} />
            <ImageItem url={"/images/d622af8b-bbec-44e7-94a9-807d4c0402da.png"} scaleRatio={0.1} position={isMobile? [wControlUnit*35, hControlUnit*1.2, 1] : [wControlUnit*-15, hControlUnit*1.2 , 0]} isBubbleEffect={true}  hoverZoomRatio={isMobile? 2 : null} />
            <ImageItem url={"/images/d6693a2d-f26d-4e73-87d8-c92cf527f5a8.png"} scaleRatio={0.1} position={isMobile? [wControlUnit*35, hControlUnit*0.65, 1] : [wControlUnit*-15, hControlUnit*0.65, 0.7]} isBubbleEffect={true}  hoverZoomRatio={isMobile? 2 : null} />
            <ImageItem url={"/images/f7c9327d-ed3f-47eb-bfa6-3429622f06ed.png"} scaleRatio={0.1} position={isMobile? [wControlUnit*-35, hControlUnit*0.65, 1] : [wControlUnit*-35, hControlUnit*0.65, 0.5]} isBubbleEffect={true}  hoverZoomRatio={isMobile? 2 : null} />
            <ImageItem url={"/images/ff10e382-8dc3-43d7-bec3-54c958f3f107.png"} scaleRatio={0.1} position={isMobile? [wControlUnit*0, hControlUnit*1.2, 1] : [wControlUnit*-25, hControlUnit*1.2, 0.6]} isBubbleEffect={true}  hoverZoomRatio={isMobile? 2 : null} />

            <ImageItem url={"/images/about-1/db60e47e-d09a-4e3c-87e4-b22ddaee409c.jpg"} 
                        scaleRatio={isMobile? 0.35  :  /* wControlUnit*2.1 */ 0.4  }    
                        position={isMobile? [wControlUnit*-33, hControlUnit*2.25, 3] : [wControlUnit*-33, hControlUnit*2.25, 3]}     isBubbleEffect={true}      bubbleEffectRatioY={[0.003, 0.007]} bubbleEffectRatioT={[0.03, 0.07]} hoverZoomRatio={isMobile? 2 : null} />
            <ImageItem url={"/images/about-1/ec7a8314-60d6-4220-89e9-176512ae0475.jpg"} 
                        scaleRatio={isMobile? 0.3 :  /* wControlUnit*1.7 */0.35   }   
                        position={isMobile? [wControlUnit*-10, hControlUnit*2.35, 2.8] : [wControlUnit*-10, hControlUnit*2.35, 2.8]}   isBubbleEffect={true}   bubbleEffectRatioY={[0.003, 0.007]} bubbleEffectRatioT={[0.03, 0.07]} hoverZoomRatio={isMobile? 2 : null} /> 
            <ImageItem url={"/images/about-1/c1cee4a8-646d-4c04-abbd-2d44df3e1337.jpg"} 
                        scaleRatio={isMobile? 0.3 :  /* wControlUnit*1.74 */ 0.35 }   
                        position={isMobile? [wControlUnit*0, hControlUnit*2.26, 2.9] : [wControlUnit*-7, hControlUnit*2.16, 2.9]}    isBubbleEffect={true}    bubbleEffectRatioY={[0.003, 0.007]} bubbleEffectRatioT={[0.03, 0.07]} hoverZoomRatio={isMobile? 2 : null} /> 
            <ImageItem url={"/images/about-1/a53d7c5f-93a1-425d-ab21-6d01ba43afc5.jpg"} 
                        scaleRatio={isMobile? 0.3  :  /* wControlUnit*2 */  0.4   }    
                        position={isMobile? [wControlUnit*-25, hControlUnit*2.15, 2.8] : [wControlUnit*10, hControlUnit*1.8, 2.8]}      isBubbleEffect={true}       bubbleEffectRatioY={[0.003, 0.007]} bubbleEffectRatioT={[0.03, 0.07]} hoverZoomRatio={isMobile? 2 : null} /> 
            <ImageItem url={"/images/about-1/6d3bb3f8-c9e6-4ef3-a2f3-f3d0bd537e2c.jpg"} 
                        scaleRatio={isMobile? 0.3  : /*  wControlUnit*2.5  */ 0.4 }    
                        position={isMobile? [wControlUnit*33, hControlUnit*2.24, 2.8] : [wControlUnit*15, hControlUnit*2.05, 2.8]}    isBubbleEffect={true}      bubbleEffectRatioY={[0.003, 0.007]} bubbleEffectRatioT={[0.03, 0.07]} hoverZoomRatio={isMobile? 2 : null} /> 
            <ImageItem url={"/images/about-1/75fb8681-6cd1-446b-bcae-1136eea85297.png"} 
                        scaleRatio={isMobile? 0.3  :  /* wControlUnit*1.9 */ 0.3  }    
                        position={isMobile? [wControlUnit*30, hControlUnit*2.13, 2.8] : [wControlUnit*35, hControlUnit*1.8, 2.8]}     isBubbleEffect={true}      bubbleEffectRatioY={[0.003, 0.007]} bubbleEffectRatioT={[0.03, 0.07]} hoverZoomRatio={isMobile? 2 : null} /> 
            <ImageItem url={"/images/about-1/6b9b5696-1d3a-47b5-bb0d-20c68f77ba79.jpg"} 
                        scaleRatio={isMobile? 0.4 :  /* wControlUnit*2.1 */ 0.4  }   
                        position={isMobile? [wControlUnit*30, hControlUnit*2.34, 2.8] : [wControlUnit*30, hControlUnit*2.34, 2.8]}    isBubbleEffect={true}   bubbleEffectRatioY={[0.003, 0.007]} bubbleEffectRatioT={[0.03, 0.07]} hoverZoomRatio={isMobile? 2 : null} /> 

            <ImageItem url={"/images/about-2/6f258fb9-bf87-4b96-895e-a62dbe25e0dd.png"} 
                        scaleRatio={isMobile? 0.35  :  /* wControlUnit*3 */  0.4 } 
                        position={isMobile? [wControlUnit*26, hControlUnit*3.1, 1] : [wControlUnit*5, hControlUnit*3.1, 1]} isBubbleEffect={true}   bubbleEffectRatioY={[0.003, 0.007]} bubbleEffectRatioT={[0.03, 0.07]} hoverZoomRatio={isMobile? 2 : null} /> 
            <ImageItem url={"/images/about-2/5d4c8ec0-85d2-4f8d-a2ab-c91573a0d803.png"} 
                        scaleRatio={isMobile? 0.45 :  /* wControlUnit*2 */   0.4 } 
                        position={isMobile? [wControlUnit*25, hControlUnit*2.9, 1] :[wControlUnit*35, hControlUnit*2.8, 1]} isBubbleEffect={true}   bubbleEffectRatioY={[0.003, 0.007]} bubbleEffectRatioT={[0.03, 0.07]} hoverZoomRatio={isMobile? 2 : null} /> 
            <ImageItem url={"/images/about-2/5c22cd4c-cd5b-4547-9354-a46f0b35f593.png"} 
                        scaleRatio={isMobile? 0.4 :  /* wControlUnit*2.5 */  0.55 } 
                        position={isMobile? [wControlUnit*-20, hControlUnit*2.9, 1] : [wControlUnit*8, hControlUnit*2.75, 1]} isBubbleEffect={true}   bubbleEffectRatioY={[0.003, 0.007]} bubbleEffectRatioT={[0.03, 0.07]} hoverZoomRatio={isMobile? 2 : null} /> 
            <ImageItem url={"/images/about-2/203c7eee-5c17-441f-8ff8-f1fdf89a5cd4.png"} 
                        scaleRatio={isMobile? 0.35  :  /* wControlUnit*3 */    0.6 } 
                        position={isMobile? [wControlUnit*-20, hControlUnit*3.1, 1] : [wControlUnit*-26, hControlUnit*2.95, 1]} isBubbleEffect={true}   bubbleEffectRatioY={[0.003, 0.007]} bubbleEffectRatioT={[0.03, 0.07]} hoverZoomRatio={isMobile? 2 : null} /> 

            <ImageItem url={"/images/about-3/37f363b2-d1b8-4f24-942a-9a10293867b4.jpg"} 
                        scaleRatio={isMobile? 0.4  : /*  wControlUnit*2 */ 0.4} 
                        position={isMobile? [wControlUnit*25, hControlUnit*3.45, 1] : [wControlUnit*35, hControlUnit*3.45, 1]} isBubbleEffect={true}   bubbleEffectRatioY={[0.003, 0.007]} bubbleEffectRatioT={[0.03, 0.07]} hoverZoomRatio={isMobile? 2 : null} /> 
            <ImageItem url={"/images/about-3/5554694d-7574-489b-bfd1-5127e6abf5aa.jpg"} 
                        scaleRatio={isMobile? 0.4 :  /* wControlUnit*1.7 */  0.4} 
                        position={isMobile? [wControlUnit*-20, hControlUnit*3.78, 1] : [wControlUnit*-7, hControlUnit*3.6, 1]} isBubbleEffect={true}   bubbleEffectRatioY={[0.003, 0.007]} bubbleEffectRatioT={[0.03, 0.07]} hoverZoomRatio={isMobile? 2 : null} /> 
            <ImageItem url={"/images/about-3/a0fbfda3-12f2-4b88-93da-bd9bf6cf43e5.jpg"} 
                        scaleRatio={isMobile? 0.4 :  /* wControlUnit*1.75 */ 0.4} 
                        position={isMobile? [wControlUnit*20, hControlUnit*3.69, 1] : [wControlUnit*10, hControlUnit*3.6, 1]} isBubbleEffect={true}   bubbleEffectRatioY={[0.003, 0.007]} bubbleEffectRatioT={[0.03, 0.07]} hoverZoomRatio={isMobile? 2 : null} /> 
            <ImageItem url={"/images/about-3/daf6f2ec-f1d2-4ba7-905d-c09cb7271183.jpg"} 
                        scaleRatio={isMobile? 0.4  :  /* wControlUnit*2 */ 0.43} 
                        position={isMobile? [wControlUnit*-20, hControlUnit*3.53, 1] : [wControlUnit*-35, hControlUnit*3.63, 1]} isBubbleEffect={true}   bubbleEffectRatioY={[0.003, 0.007]} bubbleEffectRatioT={[0.03, 0.07]} hoverZoomRatio={isMobile? 2 : null} /> 

            <ImageItem url={"/images/about-4/8f8daacc-43b6-4dd2-8141-e1b958b66a78.png"} 
                        scaleRatio={isMobile? 0.35 : /* wControlUnit * 1.5 */ 0.3} 
                        position={isMobile? [wControlUnit*-30, hControlUnit*4.2, 1] : [wControlUnit*-40, hControlUnit*4.35, 1]} isBubbleEffect={true}   bubbleEffectRatioY={[0.003, 0.007]} bubbleEffectRatioT={[0.03, 0.07]} hoverZoomRatio={isMobile? 2 : null} /> 
            <ImageItem url={"/images/about-4/bba89b8d-3b7e-48ec-b9b5-b2f2f72edd95.jpg"} 
                        scaleRatio={isMobile? 0.35 : /* wControlUnit * 1.5 */ 0.3} 
                        position={isMobile? [wControlUnit*15, hControlUnit*4.2, 1] : [wControlUnit*-27, hControlUnit*4.35, 1]} isBubbleEffect={true}   bubbleEffectRatioY={[0.003, 0.007]} bubbleEffectRatioT={[0.03, 0.07]} hoverZoomRatio={isMobile? 2 : null} /> 
            <ImageItem url={"/images/about-4/5d63b6aa-d9de-4374-b15e-4e54ec52a323.jpg"} 
                        scaleRatio={isMobile? 0.35 : /* wControlUnit * 1.5 */ 0.3} 
                        position={isMobile? [wControlUnit*-10, hControlUnit*4.3, 1] : [wControlUnit*-17, hControlUnit*4.35, 1]} isBubbleEffect={true}   bubbleEffectRatioY={[0.003, 0.007]} bubbleEffectRatioT={[0.03, 0.07]} hoverZoomRatio={isMobile? 2 : null} /> 
            <ImageItem url={"/images/about-4/87389357-5836-4696-b2a5-c6abbc3949c6.jpg"} 
                        scaleRatio={isMobile? 0.35 : /* wControlUnit * 1.5 */ 0.3} 
                        position={isMobile? [wControlUnit*32, hControlUnit*4.35, 1] : [wControlUnit*-5, hControlUnit*4.35, 1]} isBubbleEffect={true}   bubbleEffectRatioY={[0.003, 0.007]} bubbleEffectRatioT={[0.03, 0.07]} hoverZoomRatio={isMobile? 2 : null} /> 
            
            <ImageItem url={"/images/about-4/36f50d1c-f2f0-4b58-94da-5532f37abde8.jpg"} 
                        scaleRatio={isMobile? 0.4 :/*  wControlUnit * 1.9 */ 0.4} 
                        position={isMobile? [wControlUnit*-20, hControlUnit*4.48, 1] : [wControlUnit*13, hControlUnit*4.19, 1]} isBubbleEffect={true}   bubbleEffectRatioY={[0.003, 0.007]} bubbleEffectRatioT={[0.03, 0.07]} hoverZoomRatio={isMobile? 2 : null} /> 
            <ImageItem url={"/images/about-4/64f7ffe7-4035-4b64-9f13-1ff3bab2f831.jpg"} 
                        scaleRatio={isMobile? 0.45 : /* wControlUnit * 1.9 */ 0.4} 
                        position={isMobile? [wControlUnit*25, hControlUnit*4.5, 1]:  [wControlUnit*35, hControlUnit*4.2, 1]} isBubbleEffect={true}   bubbleEffectRatioY={[0.003, 0.007]} bubbleEffectRatioT={[0.03, 0.07]} hoverZoomRatio={isMobile? 2 : null} /> 
            <ImageItem url={"/images/about-4/e1781d8a-32ff-4325-8f89-bd2eef654dd3.jpg"} 
                        scaleRatio={isMobile? 0.38 :/*  wControlUnit * 1.8 */ 0.35} 
                        position={isMobile? [wControlUnit*-20, hControlUnit*4.65, 1] : [wControlUnit*13, hControlUnit*4.61, 1]} isBubbleEffect={true}   bubbleEffectRatioY={[0.003, 0.007]} bubbleEffectRatioT={[0.03, 0.07]} hoverZoomRatio={isMobile? 2 : null} /> 
            <ImageItem url={"/images/about-4/5e1bbd33-8d49-421d-a311-5379d5c291a8.jpg"} 
                        scaleRatio={isMobile? 0.4 : /* wControlUnit * 1.9 */ 0.4} 
                        position={isMobile? [wControlUnit*25, hControlUnit*4.65, 1] : [wControlUnit*35, hControlUnit*4.6, 1]} isBubbleEffect={true}   bubbleEffectRatioY={[0.003, 0.007]} bubbleEffectRatioT={[0.03, 0.07]} hoverZoomRatio={isMobile? 2 : null} /> 
        </Scroll>
    )
}

function TextItems({setScrollY, isMobile}) {
    
    const scroll = useScroll();

    const tmpCareer = [
            {
                title: 'GIS 배경지도 웹 API 개발',
                start: '2022-03-01',
                end: '2022-03-31',
                desc: [
                    '클라이언트 및 사업 진행 팀의 요구사항을 분석하여 다양한 배경지도 API를 개발하였습니다.',
                    '보간/스무딩 등 그래픽 처리 알고리즘으로 사용자의 경험을 증진하였습니다.',
                    '지속적인 유지/보수를 통하여 최고의 성능을 보장하였습니다.',
                    '다양한 사업에 기술 지원 및 사업 수주를 위한 MVP 개발을 적극적으로 진행하였습니다.'
                ]
            },
            {
                title: '다양한 데이터 처리 응용 S/W 설계/개발',
                start: '2022-07-01',
                end: null,
                desc: [
                    'TCP/Web Socket/멀티스레드 등 기법을 활용하여 배경지도 제작 S/W를 개발하였습니다',
                    'XML/SHP/HDF5/NetCDF/ISOIEC-8211 등 다양한 공간 정보를 분석하여 Parsing S/W를 개발하였습니다.',
                ]
            },
            {
                title: '다양한 서버 구축',
                start: '2022-01-01',
                end: '2022-01-31',
                desc: [
                    '국립해양조사원/해군 등 클라이언트의 요청에 대하여 Linux 환경의 서버를 구축하였습니다.',
                    '사내 서버 및 NAS와 네트워크를 구축하였습니다.'
                ]
            },
            {
                title: '지속적인 커뮤니케이션',
                start: '2023-01-01',
                end: '2023-01-31',
                desc: [
                    '지속적으로 클라이언트와 소통하여 최고의 만족도를 제공하였습니다.',
                    '회사 동료들과의 업무 내/외적 소통을 통하여 업무의 효율적인 진행을 이끌어냈습니다.'
                ]
            },
    ]

    useFrame(() => {
        setScrollY(scroll.offset);
    })

    const tableRowMotionVar = {
        hidden: { opacity: 0},
        visible: (i: number) => ({
            opacity: 1,
            // y: 0,
            transition: {
                duration: 0.5,
                delay: i * 0.05, // 각 행마다 지연 시간을 줌
            },
        }),
    };

    return (
        <Scroll html style={{ width: '100%' }}>
            {/* // 1페이지 */}
            <div className = 'about-text-item-container'>
                <motion.h1
                    className='about-text-item-header-1'
                    initial={{ opacity: 0.2, }}
                    whileInView={{ opacity: 1, }}
                    transition={{ duration: 0.5, delay: 0.3, }}
                >
                    About me
                </motion.h1>
                <motion.div className='about-text-item-content-box'>
                    <motion.div className='about-text-item-cotent'>
                        <motion.table className='about-me-table'>
                            <tbody>
                            {
                                aboutMeMock.map((item, index) => (
                                    <motion.tr key={`about-me-mock-${index}`} initial='hidden' whileInView='visible' custom={index+1} variants={tableRowMotionVar} >
                                        <motion.th>{item.key}</motion.th>
                                        <motion.td>{item.value}</motion.td>
                                    </motion.tr>
                                ))
                            }
                            </tbody>
                        </motion.table>
                    </motion.div>
                    <div className='about-text-item-cotent' style={{width:'0', height:'0'}}></div>
                    <div className='about-text-item-cotent'>
                        <motion.table className='about-introduce-table' >
                            <tbody>
                                <motion.tr initial='hidden' whileInView='visible' custom={aboutMeMock.length+1} variants={tableRowMotionVar} >
                                    <motion.th colSpan={2}>{aboutIntroduceMock.header}</motion.th>
                                </motion.tr>
                                {
                                    aboutIntroduceMock.introduceText.map( (item, index) => (
                                        <motion.tr key={`about-introduce-mock-${index}`} initial='hidden' whileInView='visible' custom={aboutMeMock.length+index+1} variants={tableRowMotionVar} >
                                            <motion.td  style={{paddingTop:0}}>{item.group}</motion.td>
                                            <motion.td >
                                                {
                                                    item.item.map( ( desc, index) => (
                                                        <div key={`about-introduce-mock-desc-${index}`}>{`| ${desc}`}</div>
                                                    ))
                                                }
                                            </motion.td>
                                        </motion.tr>
                                    ))
                                }
                            </tbody>
                        </motion.table>
                    </div>
                    
                </motion.div>
            </div>

            {/* // 2페이지 */}
            <div className='about-text-item-container'>

                <div className='about-skill-container'>
                    {/* // 1행 1열 */}
                    <div className='about-skill-item-box'>
                        <Ability ability={abilityMock[1]} isVisibleTooltip={true} />
                    </div>
                    
                    {/* // 1행 2열 */}
                    <div className='about-skill-item-box'>
                        <motion.h1
                            style={{ position: 'absolute', top: `113dvh`, right: '15dvw', fontFamily:`감탄로드돋움체-Bold`, fontSize: '4rem',fontWeight:'bold', transform: `translate3d(0,-100%,0)`, color: 'rgba(0, 0, 0, 0.7)' }}
                            initial={{ opacity: 0.2, }}
                            whileInView={{ opacity: 1, }}
                            transition={{ duration: 0.5, delay: 1, }}
                        >
                            Skills
                        </motion.h1>
                    </div>

                    {/* // 2행 2열 */}
                    <div className='about-skill-item-box'>
                        <Ability ability={abilityMock[0]} isVisibleTooltip={true} />
                    </div>
                </div>
            </div>

            {/* // 3페이지 */}
            <div className='about-text-item-2page-container'>
                <div className='about-text-item-2page-header'>
                    <motion.h1
                            style={{ fontFamily:`감탄로드돋움체-Bold`, fontSize: '4rem',fontWeight:'bold', marginLeft: `10dvw`, color: 'rgba(0, 0, 0, 0.7)'}}
                            initial={{ opacity: 0.2, }}
                            whileInView={{ opacity: 1,  }}
                            transition={{ duration: 0.5, delay: 1, }}
                    >
                        Career
                    </motion.h1>
                </div>
                {
                    tmpCareer.map( (career, index1) => (
                        <div key={`about-milestones-container-${index1}`} className='about-milestones-container' style={{height:`calc(285dvh / ${tmpCareer.length})`}}>
                            <div>
                                <motion.table className='about-milestones-table'
                                    initial={{ opacity: 0, y: 25, }}
                                    whileInView={{ opacity: 1, y: 0, }}
                                    transition={{ duration: 0.8, delay: 0.5, }}
                                >
                                    <tbody>
                                        <tr>
                                            <th colSpan={2}>{career.title}</th>
                                        </tr>
                                        {
                                            career.desc.map( (desc, index2) => (
                                                <tr key={`about-milestones-container-career-${index2}`}>
                                                    <td>*</td>
                                                    <td>{desc}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </motion.table>
                            </div>
                            <div></div>
                        </div>
                    ))
                }
            </div>

        </Scroll>
    )
}

function ScrollBar({scrollY}) {
    const scrollRef = useRef();

    const scrollHeight = 100 / SECTION_COUNT;
    const scrollPosition = (scrollHeight * scrollY * SECTION_COUNT);

    return (
        <div className="scroll-indicator-container">
            <div className='scroll-indicator-box'>
                <div
                className="scroll-indicator-bar"
                ref={scrollRef}
                style={{
                    height: `${scrollPosition}%`,
                    // top: `${scrollPosition}dvh`,
                }}
                />
            </div>
        </div>
    );
}

export default function About() {
    
    const [scrollY, setScrollY] = useState(0);
    
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    
    //  effect : 최초 렌더링 시 효과  //
    useEffect(() => {
        // 핸들러 함수 정의
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // 윈도우 리사이즈 이벤트 리스너 추가
        window.addEventListener('resize', handleResize);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div id='about-container'>
            <ScrollBar scrollY={scrollY} />
            <Canvas orthographic camera={{ zoom: 80 }} gl={{ alpha: false, antialias: false, stencil: false, depth: false }} dpr={[1, 1.5]}>
                <color attach="background" args={['#f0f0f0']} />
                <ScrollControls  pages={SECTION_COUNT}>
                    <ImageItems isMobile={isMobile} />
                    <TextItems setScrollY={setScrollY} isMobile={isMobile} />
                </ScrollControls>
            </Canvas>
        </div>
    )
}

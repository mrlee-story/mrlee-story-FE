import { Props } from '@react-three/fiber';
import { motion } from 'framer-motion';
import React from 'react';
import './style.css';

//  component //
// 각 페이지 공통 인터페이스 섹션(App.css에 공통 클래스로 기입)  //
export default function Section(props: Props) {
    const { children } = props;
    const { className } = props;
    const { style }  = props;

    return (
    <motion.section
        className={`r3fSection ${className && className}`} style={style}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.6, }, }}
    >
        {children}
    </motion.section>
    )
}
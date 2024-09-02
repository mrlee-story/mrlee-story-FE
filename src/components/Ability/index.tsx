import React, { useState } from 'react';
import './style.css';
import { motion } from 'framer-motion';
import ToolTip from 'components/Tooltip';
import { Abilities } from 'types/interface';
import ModalContent from 'components/ModalContent';

interface AbilityProps {
    ability:Abilities;
    isVisibleTooltip?:boolean;
}
export default function Ability(props:AbilityProps) {
    const { ability, isVisibleTooltip } = props;


    return (
        <>
        <motion.div className='about-skill-item' whileInView={"visible"} >
            <h2 key={`abilities-header-1`} className="about-skill-item-title">{ability.name}</h2>
            <div key={`abilities-content-1`} style={{ marginTop: '1rem' }}>
                {ability.ability.map((skill, index2) => (
                    <div key={`ability-item-${index2}`} className='about-skill-item-each-box'>
                    <motion.h3
                        className="about-skill-item-each-title"
                        initial={{
                        opacity: 0,
                        }}
                        variants={{
                        visible: {
                            opacity: 1,
                            transition: {
                            duration: 1,
                            delay: 1 + index2 * 0.2,
                            },
                        },
                        }}
                    >
                        {skill.name}
                        {isVisibleTooltip && 
                            <ToolTip type={'right'} message={skill.descriptive.join('\r\n')} svgType={'info'} />
                        }
                    </motion.h3>
                    <div className="motion-progress-bar-box">
                        <motion.div
                        className="motion-progress-bar"
                        style={{ width: `${skill.score}%` }}
                        initial={{
                            scaleX: 0,
                            originX: 0,
                        }}
                        variants={{
                            visible: {
                            scaleX: 1,
                            transition: {
                                duration: 1,
                                delay: 1 + index2 * 0.2,
                            },
                            },
                        }} />
                    </div>
                    </div>
                ))}
            </div>
        </motion.div>
        </>
    )
}

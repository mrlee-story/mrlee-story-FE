import React, { useEffect } from 'react';
import './style.css';
import { useProgress } from '@react-three/drei';

interface LoadingScreenProps {
    started:boolean;
    setStarted:React.Dispatch<React.SetStateAction<boolean>>;
}
export default function LoadingScreen({started, setStarted}:LoadingScreenProps) {

    //  state : 로딩 상태   //
    const { progress, total, loaded, item } = useProgress();

    //  effect : 로딩 효과  //
    useEffect(() => {
        if (progress===100) {
            setTimeout(() => {
                setStarted(true);
            }, 500);
        }
    }, [progress, total, loaded, item])

    return (
        <div className={`loading-screen-container`} style={{opacity: started ? "0" : "100"}} >
            <div className="loading-screen-box">
                <div
                    className="loading-screen-item"
                    style={{
                    // width: `${progress}%`,
                    opacity:'100',
                    clipPath: `inset(0% ${100-progress}% 0% 0%)`
                    }}
                >
                </div>
                <div className='loading-screen-item-background'></div>
            </div>
        </div>
    )
}

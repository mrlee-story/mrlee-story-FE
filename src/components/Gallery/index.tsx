import React, { useEffect, useMemo, useRef, useState } from 'react';
import './style.css';
import MosaicMock from 'mocks/gallery-mosaic.mock';
import { FixedSizeGrid } from 'react-window';
import useGalleryMosaicCacheStory from 'store/gallery-mosaic-cache.store';

export default function Gallery() {
    // const yArray = MosaicMock;

    const { gridWidth, gridHeight, thumbnailFileRowSize, yColorArray, thumbnailFileList, loadYColorArray, loadThumbnailFileList } = useGalleryMosaicCacheStory();

    const containerRef = useRef<HTMLDivElement>();
    const canvasRef = useRef<HTMLCanvasElement>();
    const [ cellWidth, setCellWidth ] = useState<number>(0);
    const [ cellHeight, setCellHeight ] = useState<number>(0);
    const [ imageboxTlCoord, setImageboxTlCoord ] = useState<number[]>([]);
    // const tmpTestArr:any[100] = [];


    useEffect(() => {

        if (yColorArray.length > 0) {
            // const scaledY = scaleYValues(yArray, gridWidth, gridHeight);
            if (!yColorArray || yColorArray.length<=1) {
                // const scaledY = extractMaximumRegion(yArray, gridWidth, gridHeight);
                // setYColorArray(scaledY);
                loadYColorArray();
            }
            if (!thumbnailFileList || thumbnailFileList.length<=1) {
                loadThumbnailFileList();
            }
        }
    }, []);

    useEffect(() => {
        if (cellWidth!=0 && cellHeight!=0) return;
        if (!containerRef?.current || !canvasRef?.current || !(yColorArray && yColorArray.length>10 && thumbnailFileList && thumbnailFileList.length>0)) return;
        
        const fullWidthPx = canvasRef.current.width;
        const fullHeightPx = canvasRef.current.height;
        // const fullWidth = containerRef.current.offsetWidth;
        // const fullHeight = containerRef.current.offsetHeight;
        // canvasRef.current.style.width = fullWidth+'px';
        // canvasRef.current.style.height = fullHeight+'px';
        // canvasRef.current.style.border = '5px solid red';

        const ctx = canvasRef.current.getContext('2d');

        const startRow = Math.floor((gridWidth - thumbnailFileRowSize) / 2);
        const startCol = Math.floor((gridHeight - thumbnailFileRowSize) / 2);

        const coordArr = [];

        for (let row = 0; row < yColorArray.length; row++) {
            for (let col = 0; col < yColorArray[row].length; col++) {
              const color = yColorArray[row][col];
              ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
              ctx.fillRect(col * (fullWidthPx/gridWidth), row * (fullHeightPx/gridHeight), fullWidthPx/gridWidth, fullHeightPx/gridHeight);

              if (!coordArr[0] && row===startRow) {
                coordArr[0] = row * (fullWidthPx/gridWidth);
              }
              if (!coordArr[1] && col===startCol) {
                coordArr[1] = col * (fullHeightPx/gridHeight);
              }
            }
          }

        
        setImageboxTlCoord(coordArr);

        setCellWidth(fullWidthPx/gridWidth);
        setCellHeight(fullHeightPx/gridHeight);
    }, [thumbnailFileList, yColorArray]);

    

    return (
    <div className="gallery-container" ref={containerRef} >
        {yColorArray && yColorArray.length>0 && thumbnailFileList && thumbnailFileList.length>0 && (
            <>
            <canvas ref={canvasRef} style={{width:'100%', height:'100%'}} />
            {imageboxTlCoord.length===2 && cellWidth>0 && cellHeight>0 && thumbnailFileRowSize>10 &&
                <div
                    className="gallery-grid"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${thumbnailFileRowSize}, ${cellWidth}px)`,
                        gridTemplateRows: `repeat(${thumbnailFileRowSize}, ${cellHeight}px)`,
                        boxSizing: 'border-box',
                        position: 'absolute',
                        top: `5dvh`,
                        left: `5dvw`,
                        zIndex: 999999999999,
                        border: '3px solid red'
                    }}
                >
                    {thumbnailFileList.map((thumb, index) => (
                    <div className="gallery-item" key={`gallery-item-${index}`} style={{width:`${cellWidth}px`, height:`${cellHeight}px`}}>
                        <img src={thumb} alt={`Thumbnail ${index}`} />
                    </div>
                    ))}
                </div>
            }
            </>
        )}
    </div>


    )
}

const GalleryItems = ({gridWidth, gridHeight, colorData, thumbFileList, thumbnailFileRowSize}) => {
    // 중앙 배치를 위한 시작 인덱스 계산
    // const startRow = Math.floor((gridWidth - thumbnailFileRowSize) / 2);
    // const startCol = Math.floor((gridHeight - thumbnailFileRowSize) / 2);

    const thumbnails = useMemo(() => {
        // 중앙 배치를 위한 시작 인덱스 계산
        const startRow = Math.floor((gridWidth - thumbnailFileRowSize) / 2);
        const startCol = Math.floor((gridHeight - thumbnailFileRowSize) / 2);
        return colorData.flat().map((value, idx) => {
            
            const rowIndex = Math.floor(idx / gridWidth);
            const colIndex = idx % gridHeight;
            // 현재 위치가 thumbFileList의 이미지를 배치할 중앙 영역에 해당하는지 확인
            const thumbIndex = (rowIndex - startRow) * thumbnailFileRowSize + (colIndex - startCol);
            const isWithinThumbGrid = rowIndex >= startRow && rowIndex < startRow + thumbnailFileRowSize &&
                                    colIndex >= startCol && colIndex < startCol + thumbnailFileRowSize &&
                                    thumbIndex < thumbFileList.length;

            const style:React.CSSProperties = {};
            if (!isWithinThumbGrid) {
                if (rowIndex==startRow-1 && 
                    colIndex>startCol-1 && 
                    colIndex<startCol + thumbnailFileRowSize) {
                    style.borderBottom = '1px solid red';
                }
                if (rowIndex==startRow + thumbnailFileRowSize &&
                    colIndex>startCol-1 && 
                    colIndex<startCol + thumbnailFileRowSize
                ) {
                    style.borderTop = '1px solid red';
                }
                if (colIndex==startCol-1 &&
                    rowIndex>startRow-1 &&
                    rowIndex<startRow + thumbnailFileRowSize
                ) {
                    style.borderRight = '1px solid red';
                }
                if (colIndex==startCol + thumbnailFileRowSize &&
                    rowIndex>startRow-1 &&
                    rowIndex<startRow + thumbnailFileRowSize
                ) {
                    style.borderLeft = '1px solid red';
                }
            }
            if (rowIndex<30 || rowIndex> 80 || colIndex<30 || colIndex>=80) return null;
            return   (
            <React.Fragment key={`gallery-item-grid-${idx}`}>
                {isWithinThumbGrid ? 
                    (
                        <div className='gallery-item'>
                            <img src={thumbFileList[thumbIndex]} />
                            <div className='gallery-filter' 
                                style={{
                                    backgroundColor: `rgba(${value}, ${value}, ${value}, 0.8)`
                                    }}
                            />
                        </div>
                    ) : 
                    (
                    <div className='gallery-item-background'
                            style={{...style,
                            backgroundColor: `rgb(${value}, ${value}, ${value}, 1)`,
                            }}
                        >
                        </div>
                    )
                }
            </React.Fragment>
            )
        }
    )
    }, [colorData]);

    return (
        <>{thumbnails}</>
    )
}

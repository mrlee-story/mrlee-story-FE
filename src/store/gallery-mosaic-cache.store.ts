import { getThumbnailList, getYColorArray } from "apis";
import { create } from "zustand";

interface GalleryMosaicCacheStore {
    gridWidth:number;
    gridHeight:number;
    isImageDataLoading:boolean;
    yColorArray:[][];
    thumbnailFileList:string[];
    thumbnailFileRowSize:number;
    // setYColorArray:(yColorArray:[][]) => void;
    loadYColorArray:() => void;
    loadThumbnailFileList:() => void;
    // setGridSize:(w:number, h:number) => void;
}

const useGalleryMosaicCacheStory = create<GalleryMosaicCacheStore>((set, get)=> ({
    gridWidth:100,
    gridHeight:100,
    thumbnailFileRowSize:0,
    isImageDataLoading:false,
    yColorArray: [[]],
    thumbnailFileList:[],
    // setYColorArray: (yColorArray) => set(state => ({...state, yColorArray})),
    loadYColorArray:() => {
        set(() => ({isImageDataLoading:true}));
        getYColorArray().then((dataList) => {
            if (!dataList) return;
            
            const w = get().gridWidth;
            const h = get().gridHeight;
            const yArray = extractMaximumRegion(dataList, w, h);
            set(state => ({yColorArray:yArray}));
            set(() => ({isImageDataLoading:false}));
        })
    },
    loadThumbnailFileList:() => {
        set(() => ({isImageDataLoading:true}));
        getThumbnailList().then((dataList) => {
            if (dataList) {
                const size = Math.ceil(Math.sqrt(dataList.length));
                set(state => ({thumbnailFileRowSize:size}));
                set(state => ({thumbnailFileList:dataList}));
                set(() => ({isImageDataLoading:false}));
            }
        })
    }
    // setGridSize:(w:number, h:number) => {
    //     set(state => ({gridWidth:w, gridHeight:h}));
    // }
}))

export default useGalleryMosaicCacheStory;


function scaleYValues_CenterVersion(yArray: number[][], targetWidth: number, targetHeight: number) {
    const srcHeight = yArray.length;
    const srcWidth = yArray[0].length;

    const centralRegion = calculateAspectRatioFit(srcWidth, srcHeight, targetWidth, targetHeight);
    const croppedYArray = extractCentralRegion(yArray, srcWidth, srcHeight, centralRegion.width, centralRegion.height);

    const scaledYArray = [];
    const yRatio = centralRegion.height / targetHeight;
    const xRatio = centralRegion.width / targetWidth;

    for (let y = 0; y < targetHeight; y++) {
        const row = [];
        for (let x = 0; x < targetWidth; x++) {
            const srcY = Math.floor(y * yRatio);
            const srcX = Math.floor(x * xRatio);
            row.push(croppedYArray[srcX][srcY]);
        }
        scaledYArray.push(row);
    }
    
    return scaledYArray;
}

function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
    const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return {
        width: Math.round(srcWidth * ratio),
        height: Math.round(srcHeight * ratio),
    };
}

function extractCentralRegion(yArray, srcWidth, srcHeight, targetWidth, targetHeight) {
    const startX = Math.floor((srcWidth - targetWidth) / 2);
    const startY = Math.floor((srcHeight - targetHeight) / 2);
    
    const centralRegion = [];
    for (let y = 0; y < targetHeight; y++) {
        const row = yArray[startY + y].slice(startX, startX + targetWidth);
        centralRegion.push(row);
    }
    
    return centralRegion;
}

function extractMaximumRegion(yArray, gridWidth, gridHeight) {
    const srcWidth = yArray.length;
    const srcHeight = yArray[0].length;

    const aspectRatioGrid = gridWidth / gridHeight;
    const aspectRatioImage = srcWidth / srcHeight;

    let targetWidth, targetHeight;

    if (aspectRatioGrid > aspectRatioImage) {
        // Grid의 종횡비가 이미지보다 작을 때: 너비를 맞추고, 높이는 줄이기
        targetWidth = srcWidth;
        targetHeight = Math.floor(targetWidth / aspectRatioGrid);
    } else {
        // Grid의 종횡비가 이미지보다 클 때: 높이를 맞추고, 너비는 줄이기
        targetHeight = srcHeight;
        targetWidth = Math.floor(targetHeight * aspectRatioGrid);
    }
    return scaleYValues(yArray, targetWidth, targetHeight, gridWidth, gridHeight);
}

function scaleYValues(yArray, srcWidth, srcHeight, gridWidth, gridHeight) {
    const scaledYArray = [];

    const yRatio = srcHeight / gridHeight;
    const xRatio = srcWidth / gridWidth;

    for (let y = 0; y < gridHeight; y++) {
        const row = [];
        for (let x = 0; x < gridWidth; x++) {
            const srcY = Math.floor(y * yRatio);
            const srcX = Math.floor(x * xRatio);
            row.push(yArray[srcX][srcY]);
        }
        scaledYArray.push(row);
    }

    return scaledYArray;
}
import { useState } from "react";

const useInfiniteScroll = <T>(initCursor:number, size:number) => {
    // variable : 로딩 사이즈   //
    const loadingSize = size;

    //  state : 무한 스크롤 컨텐츠 리스트 상태  //
    const [ contentList, setContentList ] = useState<T []>([]);

    //  state : 커서 상태   //
    const [ cursor, setCursor ] = useState<number>(0);
    

    const addContentList = (additionalData:T []) => {
        setContentList((prevData) => [...prevData, ...additionalData]);
    }

    const resetContentList = () => {
        setContentList([]);
        setCursor(0);
    }


    return {
        cursor, setCursor,
        size,
        contentList, addContentList, setContentList,
        resetContentList
        
    }
}

export default useInfiniteScroll;
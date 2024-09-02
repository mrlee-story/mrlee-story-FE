import { useEffect, useState } from "react";

const usePagination = <T>(countPerPage:number) => {
    //  state : 전체 객체 리스트 
    //  state : 전체 객체 리스트 상태   //
    const [totalList, setTotalList] = useState<T []>([]);
    //  state : 보여줄 객체 리스트 상태   //
    const [viewList, setViewList] = useState<T[]>([]);
    //  state : 현재 페이지 번호 상태   //
    const [currentPage, setCurrentPage] = useState<number>(1);
    
    //  state : 전체 페이지 번호 리스트 상태   //
    const [totalPageList, setTotalPageList] = useState<number[]>([1]);
    //  state : 보여줄 페이지 번호 리스트 상태   //
    const [viewPageList, setViewPageList] = useState<number[]>([1]);
    //  state : 현재 섹션 상태   //
    const [currentSection, setCurrentSection] = useState<number>(1);

    //  state : 전체 섹션 상태   //
    const [totalSection, setTotalSection] = useState<number>(1);

    //  function : 보여줄 객체 리스트 추출 함수 //
    const setView = () => {
        const FIRST_IDX = countPerPage * (currentPage - 1);
        const LAST_IDX = totalList.length > (countPerPage * currentPage) ?  (countPerPage * currentPage) : totalList.length;
        const viewList = totalList.slice(FIRST_IDX, LAST_IDX);
        setViewList(viewList);
    }
    
    //  function : 보여줄 페이지 리스트 추출 함수 //
    const setViewPage = () => {
        const FIRST_IDX = 10 * (currentSection - 1);
        const LAST_IDX = totalPageList.length >  (10 * currentSection) ? (10 * currentSection) : totalPageList.length;
        const viewPageList = totalPageList.slice(FIRST_IDX, LAST_IDX);
        setViewPageList(viewPageList);
    }

    //  effect : total list가 변경될 때마다 실행될 작업(처음 들어왔을 때) //
    useEffect(() => {
        const totalPage = Math.ceil(totalList.length / countPerPage);
        const totalSection = Math.ceil(totalList.length / (countPerPage * 10));
        
        const totalPageList = [];
        for (let index = 1; index <= totalPage; index++) {
            totalPageList.push(index);
        }
        // 전체 페이지 리스트
        setTotalPageList(totalPageList);
        // 전체 섹션
        setTotalSection(totalSection);
        
        // 현재 페이지 및 섹션 초기화
        setCurrentPage(1);
        setCurrentSection(1);

        // 보여줄 객체 뷰 세팅
        setView();
        // 보여줄 페이지 뷰 세팅
        setViewPage();
    }, [totalList]);

    //  effect : current page가 변경될 때마다 실행될 작업 //
    useEffect(setView, [currentPage]);
    //  effect : current section이 변경될 때마다 실행될 작업 //
    useEffect(setViewPage, [currentPage]);

    return {
        currentPage,
        setCurrentPage,
        currentSection,
        setCurrentSection,
        viewList,
        viewPageList,
        totalSection,
        setTotalList
    }
}

export default usePagination;
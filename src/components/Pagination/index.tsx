import React, { Dispatch } from 'react';
import './style.css';
import { SetStateAction } from 'jotai';

//  interface : 페이지네이션 컴포넌트 Properties    //
interface PaginationProps {
    currentPage: number;
    currentSection: number;
    setCurrentPage: Dispatch<SetStateAction<number>>;
    setCurrentSection: Dispatch<SetStateAction<number>>;

    viewPageList: number[];
    totalSection: number;
}

export default function Pagination(props:PaginationProps) {
    
    //  state : properties  //
    const { currentPage, currentSection, viewPageList, totalSection } = props;
    const { setCurrentPage, setCurrentSection } = props;

    //  event handler : 페이지 클릭 이벤트 처리 //
    const onPageClickHandler = (page: number) => {
        setCurrentPage(page);
    }
    //  event handler : 이전 버튼 클릭 이벤트 처리 //
    const onPreviousClickHandler = () => {
        if (currentSection===1) return;
        
        setCurrentPage( (currentSection - 1) * 10 );
        setCurrentSection( currentSection - 1 );
    }
    //  event handler : 다음 버튼 클릭 이벤트 처리 //
    const onNextClickHandler = () => {
        if (currentSection===totalSection) return;
        
        setCurrentPage( currentSection * 10 + 1 )
        setCurrentSection( currentSection + 1 );
    }

    //  render : 게시물 상세 하단 렌더링    //
    return (
        <div id='pagination-wrapper'>
            
            <div className='pagination-divider'>{'\|'}</div>

            {viewPageList.map( (page, index) => (
            (page === currentPage) ?
                <div key={`pagination-${index}`} className='pagination-text-active'>
                    {page}
                </div>
                :
                <div className='pagination-text' onClick={() => onPageClickHandler(page)}>
                    {page}
                </div>
            ))}

            <div className='pagination-divider'>{'\|'}</div>

        </div>
    )
}

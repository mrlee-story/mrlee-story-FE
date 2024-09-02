import { memo, useEffect, useRef, useState } from 'react';
import './style.css';

interface InfiniteScrollProps {
    //  콜백 함수 : request와 response를 동시 처리하는 핸들 함수여야 하며, 이후 계속 로딩할지 말지를 결정하는 boolean 값을 동기로 반환해야 함
    callback: () => Promise<boolean>;
    isLast: boolean;
    contentName:string;
}

const InfiniteScroll = memo(({ callback, isLast, contentName }:InfiniteScrollProps) => {

    //  state : 로딩 종료 여부 상태(true면 대기중, false면 로딩 중, 마지막 게시물에 다다르면 null 상태를 유지하여 추가 api 호출 막음)   //
    const [ isLoading, setLoading ] = useState<boolean>(false);
    
    //  state : 커서 옵저버 요소 참조 상태  //
    const observerRef = useRef<HTMLDivElement>();

    //  effect : 초기 렌더링 효과 : 콜백 함수 리스터 추가   //
    useEffect(() => {
        // observer 생성 및 관찰 시작
        const observer = new IntersectionObserver(handleObserver, {
            threshold:1
        });
        if (observerRef) {
            observer.observe(observerRef.current);
        }

        // 렌더링이 끝날 때에 관찰 멈춤
        return (() => {
            if (observerRef?.current) {
                observer.unobserve(observerRef.current);
            }
        });
    }, []);

    //  effect : lading 상태 변경 효과 : api 호출   //
    useEffect(() => {
        //  마지막 게시물(끝)이거나 대기라면 return
        if (!isLoading) return;
        if (isLast) return;

        // request와 response가 끝나면 반환 값을 isLoading에 지정
        callback().then(
            (response) => {
                setLoading(response);
            }
        );
    }
    ,[isLoading])

    //  function : 무한 스크롤 콜백 함수    //
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
        const target = entries[0];
        if (target.isIntersecting && !isLoading) {
            setLoading(true);
        }
    }

    return (
        <>
            
            <div ref={observerRef} style={{height:'100px', margin:'0 auto' }}>
                <div style={{height:'50px'}}>
                    {
                        isLast ?
                        <div className='loader-message'>마지막 {contentName}입니다.</div>
                        :
                        isLoading &&
                        <div className="loader loader-black loader-1" ></div>
                    }
                </div>
            </div>
        </>
    )
});

export default InfiniteScroll;
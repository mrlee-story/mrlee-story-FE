import { MAIN_PATH } from 'constant';
import Footer from 'layouts/Footer';
import Header from 'layouts/Header';
import Nav from 'layouts/Nav';
import React, { useContext, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import useNavFoldingStore from 'store/nav-folding.store';

//  Component : 레이아웃    //
export default function Container() {

//  state  //
    // 현재 페이지 path name 상태
    const {pathname} = useLocation();
    // Nav 폴딩 여부
    const { isFolding, setFolding } = useNavFoldingStore();

//  effect  //
    // path 변경 시
    useEffect(() => {
        if (!isFolding) setFolding(true);
    }, [pathname]);

    //  render : 레이아웃 render    //
    return (
        <>
            <Header />
            <Nav currentPath={pathname} />
            <Outlet />
        </>
    )
}

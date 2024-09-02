import { create } from "zustand";

interface BoardStore {
    title: string;
    content: string;
    boardImageFileList: File[];

    nickname: string;
    password: string;
    telnumber: string | null;
    isSecret: boolean;
    isAgreed: boolean;
    isNotice: boolean;

    setTitle: (title:string) => void;
    setContent: (content:string) => void;
    setBoardImageFileList: (boardImageFileList:File[]) => void;

    setNickname: (nickname:string) => void;
    setPassword: (password:string) => void;
    setTelnumber: (telnumber:string) => void;
    setSecret: (isSecret:boolean) => void;
    setAgreed: (isAgreed:boolean) => void;
    setNotice: (isNotice:boolean) => void;

    resetBoard: () => void;
}

const useBoardStore = create<BoardStore>(set => ({
    title: '',
    content: '',
    boardImageFileList: [],

    nickname: '',
    password: '',
    telnumber: null,
    isSecret: false,
    isAgreed: false,
    isNotice: false,

    setTitle: (title:string) => set(state => ({...state, title})),
    setContent: (content:string) => set(state => ({...state, content})),
    setBoardImageFileList: (boardImageFileList:File[]) => set(state => ({...state, boardImageFileList})),

    setNickname: (nickname:string)      => set(state => ({...state, nickname})),
    setPassword: (password:string)      => set(state => ({...state, password})),
    setTelnumber: (telnumber:string)    => set(state => ({...state, telnumber})),
    setSecret: (isSecret:boolean)       => set(state => ({...state, isSecret})),
    setAgreed: (isAgreed:boolean)       => set(state => ({...state, isAgreed})),
    setNotice: (isNotice:boolean)       => set(state => ({...state, isNotice})),

    resetBoard: () => set(state => ({...state, title:'', content:'', boardImageFileList:[]}))
}))

export default useBoardStore;
import axios from "axios";
import { SignInRequestDto, SignUpRequestDto } from "./request/auth";
import { PatchCommentRequestDto, PostBoardGuestRequestDto, PostBoardRequestDto } from "./request/board";
import { SignInGuestResponseDto, SignInResponseDto, SignUpResponseDto } from "./response/auth";
import { DeleteBoardResponseDto, DeleteCommentResponseDto, GetCommentListResponseDto, IncreaseViewCountResponseDto, PostBoardGuestResponseDto } from "./response/board";
import GetBoardListResponseDto from "./response/board/get-board-list.response.dto";
import GetBoardResponseDto from "./response/board/get-board.response.dto";
import PostBoardResponseDto from "./response/board/post-board.response.dto";
import ResponseDto from "./response/response.dto";
import { GetSignInUserResponseDto } from "./response/user";
import SignInGuestRequestDto from "./request/auth/sign-in-guest.request.dto";
import PatchBoardRequestDto from "./request/board/patch-board.request.dto";
import PatchBoardResponseDto from "./response/board/patch-board.response.dto";
import PostCommentRequestDto from "./request/board/post-comment.request.dto";
import PostCommentResponseDto from "./response/board/post-comment.response.dto";
import GetNotionDatabaseResponseDto from "./response/proxy-notion/get-notion-database.response.dto";

//  variable : 최상단 도메인    //
//! 개발(로컬)    //
const DOMAIN = 'http://localhost:8080';
const NODE_API_DOMANIN = `http://localhost:9090/api/proxy`;
//! 운영서버    //
// const DOMAIN = 'http://144.24.70.238:8080';
// const NODE_API_DOMANIN = `http://144.24.70.238:9090/api/proxy`;

const API_DOMAIN = `${DOMAIN}/api`;

//  variable : 인증/인가 관련 도메인    //
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;
const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
// const SIGN_UP_GUEST_URL = () => `${API_DOMAIN}/auth/sign-up/guest`;
const SIGN_IN_GUEST_URL = () => `${API_DOMAIN}/auth/sign-in/guest`;
const GET_SIGN_IN_USER_URL = () => `${API_DOMAIN}/user`;
const DELETE_MEMBER_URL = () => `${API_DOMAIN}/auth`;

//  variable : 게시물 관련 도메인   //
const GET_BOARD_LATEST_LIST_URL = (cursor:number, boardListSize:number, notice:boolean) => `${API_DOMAIN}/board/latest?cursor=${cursor}&size=${boardListSize}&notice=${notice}`;
const GET_BOARD_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}`;
const INCREASE_VIEW_COUNT_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/increase-view-count`;
const GET_COMMENT_LIST_URL = (boardNumber:number | string, cursor:number, size:number) => `${API_DOMAIN}/board/${boardNumber}/comment-list?cursor=${cursor}&size=${size}`;
const GET_SEARCH_BOARD_LIST_URL = (searchWord:string, preSearchWord: string | null) => `${API_DOMAIN}/board/search-list/${searchWord}${preSearchWord? '/' + preSearchWord : ''}`;

const POST_COMMENT_URL = (boardNumber:number | string) => `${API_DOMAIN}/board/${boardNumber}/comment`;
const POST_BOARD_URL = () => `${API_DOMAIN}/board`;
const POST_BOARD_GUEST_URL = () => `${API_DOMAIN}/board/guest`

const PATCH_BOARD_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}`;
const PATCH_COMMENT_URL = (commentNumber:number | string) =>  `${API_DOMAIN}/board/comment/${commentNumber}`;

const DELETE_BOARD_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}`;
const DELETE_COMMENT_URL = (commentNumber: number | string) => `${API_DOMAIN}/board/comment/${commentNumber}`;

//  variable : 파일 관련 도메인 및 변수 //
const FILE_DOMAIN = `${DOMAIN}/file`;
const FILE_UPLOAD_DOMAIN = () => `${FILE_DOMAIN}/upload`;
const multipartFormData = { headers: { 'Content-Type' : 'multipart/form-data' } };

//  variable : 프록시(노션 등) 관련 도메인 및 변수
const PROXY_DOMAIN = `${API_DOMAIN}/proxy`;
const GET_NOTION_PROJECT_DB_URL = () => `${PROXY_DOMAIN}/notion/databases/project`;
const GET_NOTION_WORK_DB_URL = () => `${PROXY_DOMAIN}/notion/databases/work`;
const GET_NOTION_PROJECT_PAGE_URL = (pagePublicId:string) => `${NODE_API_DOMANIN}/notion/page/${pagePublicId}`;


//  function : 인증/인가 :  request   //
//! Get ------------------------ //
//# 로그인 사용자 정보 request 함수
export const getSignInUserRequest = async (accessToken:string) => {
    const result = await axios.get(GET_SIGN_IN_USER_URL(), getAuthorization(accessToken)).then(
        response => {
            const responseBody: GetSignInUserResponseDto = response.data;
            return responseBody;
        }
    ).catch(e => {
        if (!e.response) return null;
        const responseBody:ResponseDto = e.response.data;
        return responseBody;
    })
    return result;
}

//! Post ------------------------ //
//# 회원 로그인 request 처리 함수
export const signInRequest = async (requestBody: SignInRequestDto) => {
    const result = await axios.post(SIGN_IN_URL(), requestBody).then(
        response => {
            const responseBody:SignInResponseDto = response.data;
            return responseBody;
        }
    ).catch(err => {
        if (!err.response.data) return null;
        const responseBody: ResponseDto = err.response.data;
        return responseBody;
    })
    return result;
}
//# 회원 회원가입 request 처리 함수
export const signUpRequest = async (requestBody:SignUpRequestDto) => {
    const result = await axios.post(SIGN_UP_URL(), requestBody).then(
        response => {
            const responseBody: SignUpResponseDto = response.data;
            return responseBody;
        }
    ).catch(err => {
        if (!err.response.data) return null;
        const responseBody:ResponseDto = err.response.data;
        return responseBody;
    })
    return result;
}
//# 비회원 로그인 request 처리 함수
export const signInGuestRequest = async (requestBody: SignInGuestRequestDto) => {
    const result = await axios.post(SIGN_IN_GUEST_URL(), requestBody).then(
        response => {
            const responseBody:SignInGuestResponseDto = response.data;
            return responseBody;
        }
    ).catch(err => {
        if (!err.response.data) return null;
        const responseBody: ResponseDto = err.response.data;
        return responseBody;
    })
    return result;
}

//# 회원탈퇴 requetst 처리 함수 //
export const deleteMemberRequest = async(accessToken:string) => {
    const result = await axios.delete(DELETE_MEMBER_URL(), getAuthorization(accessToken)).then(
        response => {
            const responseBody: ResponseDto = response.data;
            return responseBody;
        }
    ).catch(e => {
        if (!e.response) return null;
        const responseBody: ResponseDto = e.response.data;
        return responseBody;
    })
    return result;
}

//! private ------------------------ //
//# auth header 생성 함수(private 내부 사용 함수)
const getAuthorization = (accessToken: string) => {
    return { headers: {Authorization: `${accessToken}`} }
}

//  function : 게시물 관련 request  //
//! Get ------------------------ //
//# 게시판 리스트 request 함수
export const getBoardListRequest = async(cursor:number, boardListSize:number, notice:boolean) => {
    const result = await axios.get(GET_BOARD_LATEST_LIST_URL(cursor, boardListSize, notice)).then(
        response => {
            const responseBody:GetBoardListResponseDto = response.data;
            return responseBody;
        }).catch(e => {
            if (!e.response) return null;
            const responseBody:ResponseDto = e.response.data;
            return responseBody;
        })
        return result;
}
//# 게시판 상세 내용 request 함수
export const getBoardRequest = async(boardNumber:number | string, accessToken?:string) => {
    const request = accessToken? axios.get(GET_BOARD_URL(boardNumber), getAuthorization(accessToken)) : axios.get(GET_BOARD_URL(boardNumber));
    const result = await request.then(
        response => {
            const responseBody:GetBoardResponseDto = response.data;
            return responseBody;
    }).catch(e => {
        if (!e.response) return null;
        const responseBody:ResponseDto = e.response.data;
        return responseBody;
    })
    return result;
}
//# 게시판 조회수 증가 request 함수
export const increaseViewCountRequest = async (boardNumber: number | string) => {
    const result = await axios.get(INCREASE_VIEW_COUNT_URL(boardNumber)).then
    (response => {
        const responseBody: IncreaseViewCountResponseDto = response.data;
        return responseBody;
    }).catch(e => {
        if (!e.response) return null;
        const responseBody : ResponseDto = e.response.data;
        return responseBody;
    });
    return result;
}
//# 댓글 리스트 request 함수
export const getCommentListRequest = async (boardNumber : number | string, cursor:number, size:number) => {
    const result = await axios.get(GET_COMMENT_LIST_URL(boardNumber, cursor, size)).then
    (response => {
        const responseBody: GetCommentListResponseDto = response.data;
        return responseBody;
    }).catch(e => {
        if (!e.response) return null;
        const responseBody: ResponseDto = e.response.data;
        return responseBody;
    })
    return result;
}
//# 검색 게시물 request 함수    //
export const getSearchBoardListRequest = async (searchWord:string, preSearchWord: string | null) => {
    const result = await axios.get(GET_SEARCH_BOARD_LIST_URL(searchWord, preSearchWord)).then
    (response => {
        const responseBody: GetBoardListResponseDto = response.data;
        return responseBody;
    }).catch(e => {
        if (!e.response) return null;
        const responseBody: ResponseDto = e.response.data;
        return responseBody;
    });
    return result;
}


//! Post ------------------------ //
//# 회원 게시물 Post 처리 함수
export const postBoardRequest = async(requestBody:PostBoardRequestDto, accessToken:string) => {
    const result = await axios.post(POST_BOARD_URL(), requestBody, getAuthorization(accessToken)).then(
        response => {
            const responseBody: PostBoardResponseDto = response.data;
            return responseBody;
        }
    ).catch(e => {
        if (!e.response) return null;
        const responseBody: ResponseDto = e.response.data;
        return responseBody;
    })
    return result;
}
//# 비회원 게시물 Post 처리 함수
export const postBoardGuestRequest = async(requestBody:PostBoardGuestRequestDto) => {
    const result = await axios.post(POST_BOARD_GUEST_URL(), requestBody).then(
        response => {
            const responseBody: PostBoardGuestResponseDto = response.data;
            return responseBody;
        }
    ).catch(err => {
        if (!err.response.data) return null;
        const responseBody:ResponseDto = err.response.data;
        return responseBody;
    })
    return result;
}
//# 댓글 Post 처리 함수
export const postCommentRequest = async (boardNumber: number | string, requestBody: PostCommentRequestDto, accessToken: string) => {

    const request = accessToken? axios.post(POST_COMMENT_URL(boardNumber), requestBody, getAuthorization(accessToken)) : axios.post(POST_COMMENT_URL(boardNumber), requestBody)

    const result = await request.then
    (response => {
        const responseBody: PostCommentResponseDto = response.data;
        return responseBody;
    }).catch (e => {
        if (!e.response) return null;
        const responseBody: ResponseDto = e.response.data;
        return responseBody;
    });
    return result;
}

//! Patch ----------------------- //
export const patchBoardRequest = async (boardNumber: number | string, requestBody: PatchBoardRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_BOARD_URL(boardNumber), requestBody, getAuthorization(accessToken)).then
    (response => {
        const responseBody: PatchBoardResponseDto = response.data;
        return responseBody;
    }).catch(e => {
        if (!e.response) return null;
        const responseBody: ResponseDto = e.response.data;
        return responseBody;
    });
    return result;
}
//# 댓글 수정   //
export const patchCommentRequest = async (commentNumber: number | string, requestBody: PatchCommentRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_COMMENT_URL(commentNumber), requestBody, getAuthorization(accessToken)).then
    (response => {
        const responseBody: ResponseDto = response.data;
        return responseBody;
    }).catch(e => {
        if (!e.response) return null;
        const responseBody: ResponseDto = e.response.data;
        return responseBody;
    });
    return result;
}

//! Delete ------------------------ //
export const deleteBoardRequest = async (boardNumber: number | string, accessToken: string) => {
    const result = await axios.delete(DELETE_BOARD_URL(boardNumber), getAuthorization(accessToken)).then
    (response => {
        const responseBody: DeleteBoardResponseDto = response.data;
        return responseBody;
    }).catch(e => {
        if (!e.response) return null;
        const responseBody: ResponseDto = e.response.data;
        return responseBody;
    });
    return result;
}
export const deleteCommentRequest = async (commentNumber: number | string, accessToken: string) => {
    const result = await axios.delete(DELETE_COMMENT_URL(commentNumber), getAuthorization(accessToken)).then
    (response => {
        const responseBody: DeleteCommentResponseDto = response.data;
        return responseBody;
    }).catch(e => {
        if (!e.response) return null;
        const responseBody: ResponseDto = e.response.data;
        return responseBody;
    });
    return result;
}


//  function : 프록시 관련 request  //
//! Get ----------------------- //
//# 프로젝트DB Get 처리 함수  //
export const getNotionProjectDbRequest = async() => {
    const result = await axios.get(GET_NOTION_PROJECT_DB_URL()).then(
        response => {
            const responseBody:GetNotionDatabaseResponseDto = response.data;
            return responseBody;
        }).catch(e => {
            if (!e.response) return null;
            const responseBody:ResponseDto = e.response.data;
            return responseBody;
        })
        return result;
}

//# 주요업무DB Get 처리 함수  //
export const getNotionWorkDbRequest = async() => {
    const result = await axios.get(GET_NOTION_WORK_DB_URL()).then(
        response => {
            const responseBody:GetNotionDatabaseResponseDto = response.data;
            return responseBody;
        }).catch(e => {
            if (!e.response) return null;
            const responseBody:ResponseDto = e.response.data;
            return responseBody;
        })
        return result;
}

//# 이미지 base64 Get 처리 함수 //
export const getNotionProjectThumbnailBase64 = async(url:string) => {
    const result = await axios.get(url, {responseType:'arraybuffer'}).then(
        response => {
            const responseBody = response.data;
            return responseBody;
        }).catch(e => {
            return null;
    });
    return result;
}

export const getNotionProjectPageRequest = async(pageId:string) => {
    const result = await axios.get(GET_NOTION_PROJECT_PAGE_URL(pageId)).then(
        response => {
            const responseBody:GetNotionDatabaseResponseDto = response.data;
            return responseBody;
        }).catch(e => {
            if (!e.response) return null;
            const responseBody:ResponseDto = e.response.data;
            return responseBody;
        })
        return result;
}

// function : 파일 관련 request //
//! Get ------------------------ //
//# 썸네일 포토모자이크 Meta Get 처리 함수  //
export const getYColorArray = async() => {
    const result = await axios.get(FILE_DOMAIN+'/thumbnail/meta/y').then(
        response => {
            const responseBody:number[][] = response.data;
            return responseBody;
        }
    ).catch( e => {
        console.log('썸네일 메타 정보 찾을 수 없음');
        return null;
    })
    return result;
}

//# 썸네일 이미지 리스트 Get 처리 함수  //
export const getThumbnailList = async() => {
    const result = await axios.get(FILE_DOMAIN+'/history/thumbnails').then(
        response => {
            const responseBody:string[] = response.data;
            return responseBody;
        }
    ).catch( e => {
        console.log('섬네일 이미지 경로 찾을 수 없음');
        return null;
    })
    return result;
}
//! Post ------------------------ //
export const fileUploadRequest = async (data: FormData) => {
    const result = await axios.post(FILE_UPLOAD_DOMAIN(), data, multipartFormData).then
    (response => {
        const responseBody: string = response.data;
        return responseBody;
    }).catch(e => {
        return null;
    });
    return result;
}
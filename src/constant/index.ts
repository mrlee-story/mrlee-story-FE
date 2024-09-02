// Path
export const MAIN_PATH = () => '/';
export const AUTH_PATH = () => '/auth';

export const ABOUT_PATH = () => '/about';
export const MILESTONES_PATH = () => '/milestones';
export const LIBRARY_PATH = () => '/library';
export const CONTACT_PATH = () => '/contact'
export const CONTACT_SEARCH_PATH = (searchWord:string) => `/contact?searchWord=${searchWord}`;
export const CONTACT_PRE_SEARCH_PATH = (searchWord:string, preSearchWord:string) => `/contact?searchWord=${searchWord}&preSearchWord=${preSearchWord}`;
export const CONTACT_WRITE_PATH = () => `${CONTACT_PATH()}/write`;
export const CONTACT_UPDATE_PATH = (boardNumber:string | number) => `${CONTACT_PATH()}/update/${boardNumber}`;
export const CONTACT_DETAIL_PATH = (boardNumber:string | number) => `${CONTACT_PATH()}/detail/${boardNumber}`;

// Pattern
export const R_E_NUMBER_FORMAT = /^[0-9]{9,13}$/;
export const R_E_EMAIL_FORMAT = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/;

//  Message
export const ETC_ERROR_ALERT_MESSAGE = '알 수 없는 오류입니다. 오류가 지속될 시 관리자에게 문의해주세요.';

//  게시판 사이즈
export const INFINITE_SCROLL_SIZE = 5;

//  jwt 쿠키 key
export const JWT_COOKIE_KEY = 'accessToken';
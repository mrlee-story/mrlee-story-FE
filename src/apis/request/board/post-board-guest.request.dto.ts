export default interface PostBoardGuestRequestDto {
    title: string;
    content: string;
    boardImageUrlList: string[];
    nickname:string;
    password:string;
    telNumber:string | null;
    secret:boolean;
    agreed:boolean;
    notice:boolean;
}
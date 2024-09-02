export default interface PostBoardRequestDto {
    title: string;
    content: string;
    boardImageUrlList: string[];
    secret:boolean;
    notice:boolean;
}
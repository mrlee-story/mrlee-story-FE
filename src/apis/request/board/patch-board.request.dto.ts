export default interface PatchBoardRequestDto {
    title: string;
    content: string;
    boardImageUrlList: string[];
    secret: boolean;
    notice: boolean;
}
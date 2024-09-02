export default interface CommentListItem {
    commentNumber: number;

    writerNumber:number;
    writerEmail?: string;
    writerNickname: string;
    writerProfileImage:string | null;
    writerAuthorizationLevel:number;

    regdate : string;
    updatedate? : string;
    content : string;
}
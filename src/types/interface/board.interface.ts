export default interface Board {
    boardNumber: number;
    
    title: string;
    content: string;
    boardImageList: string[];

    regdate: string;
    updatedate?: string;
    
    writerNumber:number;
    writerEmail?: string;
    writerNickname: string;
    writerProfileImage:string | null;
    writerAuthorizationLevel:number;
    
    viewCount: number;
    commentCount: number;

    notice: boolean;
    secret: boolean;
}
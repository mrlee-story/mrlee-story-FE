import CommentListItem from "types/interface/comment-list-item.interface";
import ResponseDto from "../response.dto";

export default interface GetCommentListResponseDto extends ResponseDto {
    commentList: CommentListItem[];
    currentCursor: number;
}
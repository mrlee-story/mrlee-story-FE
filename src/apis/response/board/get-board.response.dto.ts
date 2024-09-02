import { Board } from "types/interface";
import ResponseDto from "../response.dto";

export default interface GetBoardResponseDto extends ResponseDto {
    boardListItem:Board
    contentAuthLevel:number;
}
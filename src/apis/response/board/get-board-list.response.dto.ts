import { Board } from "types/interface";
import ResponseDto from "../response.dto";

export default interface GetBoardListResponseDto extends ResponseDto {
    latestBoardList: Board[];
    currentCursor:number;
}
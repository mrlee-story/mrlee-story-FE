import UserAuthority from "types/enum/user-authority.enum";
import User, { UserGuest, UserMember } from "types/interface/user.interface";
import ResponseDto from "../response.dto";

export default interface GetSignInUserResponseDto extends ResponseDto {
    authorizationLevel:UserAuthority;
    loginUser:User | UserMember | UserGuest | null;
    // authorizationLevel:UserAuthority;
}
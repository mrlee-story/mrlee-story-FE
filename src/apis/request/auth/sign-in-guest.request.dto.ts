import UserAuthority from "types/enum/user-authority.enum";

export default interface SignInGuestRequestDto {
    userAuthority:UserAuthority;
    password: string;
    contentNumber: string | number;
}
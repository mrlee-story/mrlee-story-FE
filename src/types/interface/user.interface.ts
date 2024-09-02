import UserAuthority from "types/enum/user-authority.enum";

export default interface User {
    nickname:string;
    profileImageUrl:string;
    authorizationLevel:UserAuthority
}

export interface UserGuest extends User {
    guestNumber:number;
}

export interface UserMember extends User {
    memberNumber:number;
    email:string;
}
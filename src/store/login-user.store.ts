import UserAuthority from "types/enum/user-authority.enum";
import User, { UserMember, UserGuest } from "types/interface/user.interface";
import { create } from "zustand";

interface LoginUserStore {
    loginUser:User | UserMember | UserGuest;
    setLoginUser: (loginUser:User | UserMember | UserGuest | null) => void;
    resetLoginUser: () => void;
}

const useLoginUserStore = create<LoginUserStore>(set => ({
    loginUser: {nickname:'', profileImageUrl:'', authorizationLevel:UserAuthority.GUEST},
    setLoginUser: loginUser => set(state => ({...state, loginUser})),
    resetLoginUser: () => set(state => ({...state, loginUser:{nickname:'', profileImageUrl:'', authorizationLevel:UserAuthority.GUEST}}))
}));

export default useLoginUserStore;
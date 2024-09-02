export default interface SignUpRequestDto {
    email: string;
    nickname: string;
    password: string;
    telNumber: string;
    profileImageUrl: string | null;
    agreed: boolean;
    authorizationLevel: number;
}
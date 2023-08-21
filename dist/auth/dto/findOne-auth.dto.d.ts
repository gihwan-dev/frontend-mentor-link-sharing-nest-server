export declare class FindOneAuthDto {
    email: string;
    password: string;
}
export interface UpdateAuthResponseDto {
    message: string;
    statusCode: number;
    access_token: string | null;
}

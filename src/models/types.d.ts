export interface User {
    id: number;
    email: string;
    password: string;
}

export interface JWTPayload {
    id: number;
    email: string;
}
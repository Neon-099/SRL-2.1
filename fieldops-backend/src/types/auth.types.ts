export interface SignUpDto {
    email: string
    password: string
    name?: string
}

export interface SignInDto {
    email: string
    password: string
}

export interface AuthResponse {
    user: {
        id: string
        email: string
        name?: string
    };
    token: string
}
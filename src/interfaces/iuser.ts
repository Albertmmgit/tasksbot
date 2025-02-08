export interface User {
    id: number,
    token: string | undefined,
    action: string,
    logged: boolean
}
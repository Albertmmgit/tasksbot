export interface openAiResponse {
    action: string,
    description: string | null,
    expirationDate: Date | null,
    pending: boolean | null
    completed?: boolean | null
}
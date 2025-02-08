export interface openAiResponse {
    action: string,
    description: string,
    expirationDate: Date,
    completed?: boolean | null
}
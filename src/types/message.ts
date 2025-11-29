export interface Context {
    brand: string;
    products: string;
}

export interface MessageRequest {
    question: string;
    context: Context;
}

export interface MessageResponse {
    success: boolean;
    reply: string;
}

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
export interface GeneratedTemplate {
    image: {
        headline: string;
        imagePrompt: string;
        imageUrl: string;
    };
    template: {
        templateName: string;
        language: string;
        variables: string[];
        body: string;
        buttonCtas: {
            type: "URL" | string; // can extend if more CTA types exist
            label: string;
            payload: string;
        }[];
    };
}

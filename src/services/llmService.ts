// src/services/llm.service.ts
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import { z } from "zod";
import { Context } from "../types/message";
import * as fs from "node:fs";


const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "" });

const ctaSchema = z.object({
    type: z.enum(["URL", "PHONE", "QUICK_REPLY"]).describe("Type of the button"),
    label: z.string().describe("Text on the button"),
    payload: z.string().describe("The URL or payload for the button"),
});

const templateSchema = z.object({
    templateName: z.string().describe("Unique name for the template"),
    language: z.string().describe("Language code (e.g., en)"),
    variables: z.array(z.string()).describe("List of variable keys used in the body text"),
    body: z.string().describe("The main message text with {{variables}}"),
    buttonCtas: z.array(ctaSchema),
});

const imagePromptSchema = z.object({
    headline: z.string().describe("Short headline for the image creative for eg 'Buy 1 Get 1 Free'"),
    prompt: z.string().describe("A detailed prompt to generate an image for this campaign"),
});

const marketingCampaignSchema = z.object({
    imageprompt: imagePromptSchema,
    template: templateSchema,
});

const marketingCampaignJsonSchema = {
    type: "object",
    properties: {
        imageprompt: {
            type: "object",
            properties: {
                headline: {
                    type: "string",
                    description: "Short headline for the image creative"
                },
                prompt: {
                    type: "string",
                    description: "A detailed prompt to generate an image for this campaign"
                }
            },
            required: ["headline", "prompt"]
        },
        template: {
            type: "object",
            properties: {
                templateName: {
                    type: "string",
                    description: "Unique name for the template"
                },
                language: {
                    type: "string",
                    description: "Language code (e.g., en)"
                },
                variables: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of variable keys used in the body text"
                },
                body: {
                    type: "string",
                    description: "The main message text with {{variables}}"
                },
                buttonCtas: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            type: {
                                type: "string",
                                enum: ["URL", "PHONE", "QUICK_REPLY"],
                                description: "Type of the button"
                            },
                            label: {
                                type: "string",
                                description: "Text on the button"
                            },
                            payload: {
                                type: "string",
                                description: "The URL or payload for the button"
                            }
                        },
                        required: ["type", "label", "payload"]
                    }
                }
            },
            required: ["templateName", "language", "variables", "body", "buttonCtas"]
        }
    },
    required: ["imageprompt", "template"]
};

async function generateCampaign(prompt: string, context: Context) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt + context.brand + " " + context.products,
        config: {
            responseMimeType: "application/json",
            responseSchema: marketingCampaignJsonSchema,
        },
    });

    const responseText = response.text;
    if (!responseText) {
        throw new Error("No response text received from AI model");
    }

    const campaignData = marketingCampaignSchema.parse(JSON.parse(responseText));

    console.log(JSON.stringify(campaignData, null, 2));

    return campaignData;
}
export { generateCampaign };

async function generateImage(headline: string, prompt: string) {
    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: 'Robot holding a red skateboard',
        config: {
            numberOfImages: 1,
        },
    });
    if (response.generatedImages && response.generatedImages.length > 0) {
        const img = response.generatedImages[0];
        if (!img) {
            throw new Error("No image URL generated");
        }
        const imgData = img.image;
        if (!imgData || !imgData.imageBytes) {
            throw new Error("No image data generated");
        }
        const imgBytes = imgData.imageBytes;
        const buffer = Buffer.from(imgBytes, "base64");
        let idx = Date.now();
        fs.writeFileSync(`imagen-${idx}.png`, buffer);

        return "imagen-${idx}.png";
    } else {
        throw new Error("No images generated");
    }
}
export { generateImage };
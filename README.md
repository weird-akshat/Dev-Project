# Dev-Project-WhatsApp-Campaign-Generator

A small application built to generate templates for WhatsApp campaigns using LLMs and AI-powered image generation.

## Overview

This application transforms user input into complete WhatsApp campaign templates with AI-generated images. It uses LLMs to analyze campaign requirements and generate appropriate messaging, then creates custom images to accompany the templates.

## How It Works

### 1. Request Processing
The application exposes a single endpoint `generate-campaign` that accepts campaign details.

### 2. LLM Analysis
The request is sent to an LLM (Gemini) which analyzes the website and input to generate:
- Campaign template with variables
- Image generation prompt
- Call-to-action buttons

### 3. Image Generation
The generated image prompt is used with an image generation tool (Pollinations) to create a custom campaign image.

### 4. Response Assembly
The generated image is stored on the server, and the complete response (template + image URL) is returned.

## API Reference

### Endpoint: `generate-campaign`

**Request Body:**
```json
{
  "question": "I want to create a campaign for Christmas for blue tea. with Buy 2 get 3 offer on shopping above RS 1299",
  "context": {
    "brand": "https://bluetea.com",
    "products": "x, y, z"
  }
}
```

**Intermediate Response (from LLM):**
```typescript
{
  imagePrompt: {
    headline: string;
    prompt: string;
  };
  template: {
    templateName: string;
    language: string;
    variables: string[];
    body: string;
    buttonCtas: {
      type: "URL" | string;
      label: string;
      payload: string;
    }[];
  };
}
```

**Final Response:**
```json
{
  "image": {
    "headline": "Blue Tea Christmas Offer",
    "imagePrompt": "A beautifully composed flat lay image showcasing Blue Tea products x, y, and z in elegant, festive Christmas packaging. The scene should evoke a cozy and luxurious Christmas atmosphere, with soft twinkling fairy lights, subtle gold and silver Christmas ornaments, and a warm, inviting glow. A steaming cup of vibrant blue tea is visible, suggesting comfort and warmth. The overall aesthetic should be sophisticated and clearly communicate the 'Buy 2 Get 3 Free' offer through an abundant and visually appealing product display, emphasizing generosity and celebration. High resolution, warm lighting, holiday cheer, premium feel.",
    "imageUrl": "/images/imagen-1764445900438.png"
  },
  "template": {
    "templateName": "christmas_blue_tea_buy2get3",
    "language": "en",
    "variables": [
      "customer_name",
      "product_x",
      "product_y",
      "product_z",
      "minimum_spend"
    ],
    "body": "Hello {{customer_name}}! This Christmas, experience the magic of Blue Tea! We're spreading holiday cheer with an exclusive offer: Buy 2 of our exquisite products and Get 3 FREE! Indulge in our special selection including {{product_x}}, {{product_y}}, and {{product_z}}. This amazing deal is valid on purchases above RS {{minimum_spend}}. Perfect for gifting or treating yourself! Shop now and make your festive season extra special.",
    "buttonCtas": [
      {
        "type": "URL",
        "label": "Shop Christmas Deals",
        "payload": "https://www.bluetea.com/christmas-offer"
      },
      {
        "type": "QUICK_REPLY",
        "label": "Tell Me More",
        "payload": "CHRISTMAS_OFFER_DETAILS"
      }
    ]
  }
}
```

## Configuration & Environment

### Environment Variables
Create a `.env` file in the root directory with the following:

```env
GOOGLE_API_KEY=your_google_api_key_here
```

**Required:**
- `GOOGLE_API_KEY`: Required for the GoogleGenAI client used in `llmService.ts`

## Setup & Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Development Mode
```bash
npm run dev
```

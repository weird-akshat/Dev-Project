import { Request, Response } from "express";
import { MessageRequest, MessageResponse } from "../types/message";


export const generateTemplate = (
    req: Request<{}, {}, MessageRequest>,
    res: Response<MessageResponse>
) => {
    const { question, context } = req.body;

    const reply = `Received from ${question}: ${context.brand}`;

    res.json({ success: true, reply });
};

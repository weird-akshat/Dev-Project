import { Router } from "express";
import { generateTemplate } from "../controller/templateController";

const router = Router();


router.post("/generate-campaign", generateTemplate);

export default router;

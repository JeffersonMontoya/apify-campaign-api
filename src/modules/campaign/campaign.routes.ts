import { Router } from "express";
import { CampaignController } from "./campaign.controller.js";

const router = Router();
const controller = new CampaignController();

router.post("/", controller.create.bind(controller));
router.post("/:id/contacts", controller.addContacts.bind(controller));
router.post("/:id/start", controller.start.bind(controller));
router.post("/:id/pause", controller.pause.bind(controller));
router.post("/:id/resume", controller.resume.bind(controller));


router.get("/:id/progress", controller.getProgress.bind(controller));

export default router;

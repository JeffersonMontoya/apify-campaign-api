import { type Request, type Response } from "express";
import { CampaignService } from "./campaign.service.js";

const service = new CampaignService();

export class CampaignController {
  async create(req: Request, res: Response) {
    try {
      const { name, rate_limit_per_minute } = req.body;
      const campaign = await service.createCampaign(
        name,
        rate_limit_per_minute,
      );
      res.status(201).json(campaign);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async addContacts(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { contact_ids } = req.body;
      await service.attachContacts(Number(id), contact_ids);
      res.status(200).json({ message: "Contactos vinculados correctamente" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async start(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await service.changeStatus(Number(id), "running");
      res.status(200).json({ message: "Campaña iniciada" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async pause(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await service.changeStatus(Number(id), "paused");
      res.status(200).json({ message: "Campaña pausada" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async resume(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await service.changeStatus(Number(id), "running");
      res.status(200).json({ message: "Campaña reanudada" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

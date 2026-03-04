import { type Request, type Response } from "express";
import { CampaignService } from "../services/campaign.service.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { z } from "zod";
import {
  createCampaignSchema,
  addContactsSchema,
} from "../types/campaign.schemas.js";

const service = new CampaignService();

export class CampaignController {
  private formatZodErrors(error: z.ZodError) {
    return error.issues.map((issue: any) => {
      let message = issue.message;

      // Traducción manual de errores comunes de tipo para que sean más claros
      if (issue.code === "invalid_type") {
        if (issue.received === "null" || issue.received === "undefined") {
          message = `El campo '${issue.path.join(".")}' es obligatorio`;
        } else {
          message = `El campo '${issue.path.join(".")}' debe ser de tipo ${issue.expected}`;
        }
      }

      return {
        field: issue.path.join("."),
        message: message,
      };
    });
  }

  async create(req: Request, res: Response) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return errorResponse(
          res,
          400,
          "El cuerpo de la petición no puede estar vacío",
        );
      }

      const validatedData = createCampaignSchema.parse(req.body);
      const campaign = await service.createCampaign(
        validatedData.name,
        validatedData.rate_limit_per_minute,
      );
      return successResponse(res, 201, "Campaña creada exitosamente", campaign);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return errorResponse(
          res,
          400,
          "Error de validación de datos",
          this.formatZodErrors(error),
        );
      }
      return errorResponse(res, 400, error.message);
    }
  }

  async addContacts(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validatedData = addContactsSchema.parse(req.body);
      await service.attachContacts(Number(id), validatedData.contact_ids);
      return successResponse(res, 200, "Contactos vinculados correctamente");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return errorResponse(
          res,
          400,
          "Error de validación de datos",
          this.formatZodErrors(error),
        );
      }

      // Manejo de errores de base de datos específicos si fallan las validaciones previas
      if (error.code === "23503") {
        return errorResponse(
          res,
          400,
          "Uno o más contactos especificados no existen",
        );
      }

      return errorResponse(res, 400, error.message);
    }
  }

  async start(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await service.changeStatus(Number(id), "running");
      return successResponse(res, 200, "Campaña iniciada");
    } catch (error: any) {
      return errorResponse(res, 400, error.message);
    }
  }

  async pause(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await service.changeStatus(Number(id), "paused");
      return successResponse(res, 200, "Campaña pausada");
    } catch (error: any) {
      return errorResponse(res, 400, error.message);
    }
  }

  async resume(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await service.changeStatus(Number(id), "running");
      return successResponse(res, 200, "Campaña reanudada");
    } catch (error: any) {
      return errorResponse(res, 400, error.message);
    }
  }

  async getProgress(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const progress = await service.getCampaignProgress(Number(id));
      return successResponse(res, 200, "Progreso obtenido", progress);
    } catch (error: any) {
      return errorResponse(res, 500, error.message);
    }
  }
}

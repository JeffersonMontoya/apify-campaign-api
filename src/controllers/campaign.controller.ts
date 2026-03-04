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

  /**
   * @openapi
   * /campaigns:
   *   post:
   *     tags:
   *       - Campaigns
   *     summary: Crea una nueva campaña
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Campaign'
   *     responses:
   *       201:
   *         description: Campaña creada con éxito
   *       400:
   *         description: Error de validación o datos incompletos
   */
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

  /**
   * @openapi
   * /campaigns/{id}/contacts:
   *   post:
   *     tags:
   *       - Campaigns
   *     summary: Agrega contactos a una campaña existente
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               contact_ids:
   *                 type: array
   *                 items:
   *                   type: integer
   *     responses:
   *       200:
   *         description: Contactos vinculados correctamente
   *       400:
   *         description: Error en los datos o contactos no encontrados
   */
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

  /**
   * @openapi
   * /campaigns/{id}/start:
   *   post:
   *     tags:
   *       - Campaigns
   *     summary: Inicia el envío de la campaña
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Campaña iniciada
   */
  async start(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await service.changeStatus(Number(id), "running");
      return successResponse(res, 200, "Campaña iniciada");
    } catch (error: any) {
      return errorResponse(res, 400, error.message);
    }
  }

  /**
   * @openapi
   * /campaigns/{id}/pause:
   *   post:
   *     tags:
   *       - Campaigns
   *     summary: Pausa una campaña en ejecución
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Campaña pausada
   */
  async pause(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await service.changeStatus(Number(id), "paused");
      return successResponse(res, 200, "Campaña pausada");
    } catch (error: any) {
      return errorResponse(res, 400, error.message);
    }
  }

  /**
   * @openapi
   * /campaigns/{id}/resume:
   *   post:
   *     tags:
   *       - Campaigns
   *     summary: Reanuda una campaña pausada
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Campaña reanudada
   */
  async resume(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await service.changeStatus(Number(id), "running");
      return successResponse(res, 200, "Campaña reanudada");
    } catch (error: any) {
      return errorResponse(res, 400, error.message);
    }
  }

  /**
   * @openapi
   * /campaigns/{id}/progress:
   *   get:
   *     tags:
   *       - Campaigns
   *     summary: Obtiene el progreso real de la campaña
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Datos de progreso obtenidos
   */
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

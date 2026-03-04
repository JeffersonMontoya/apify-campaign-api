import { CampaignRepository } from "../repositories/campaign.repository.js";

const repository = new CampaignRepository();

export class CampaignService {
  async createCampaign(name: string, rateLimit: number) {
    if (!name || name.trim() === "")
      throw new Error("El nombre de la campaña es obligatorio");
    if (rateLimit <= 0)
      throw new Error("El límite por minuto debe ser mayor a 0");

    // Validación de duplicados
    const existing = await repository.findByName(name);
    if (existing) throw new Error("Ya existe una campaña con ese nombre");

    return await repository.create(name, rateLimit);
  }

  async attachContacts(campaignId: number, contactIds: number[]) {
    // Validación de existencia real de la campaña
    const exists = await repository.findById(campaignId);
    if (!exists) throw new Error("La campaña no existe");

    if (!contactIds || contactIds.length === 0)
      throw new Error("La lista de contactos no puede estar vacía");

    // Validación de existencia de los contactos
    const existingIds = await repository.getExistingIds(contactIds);
    const missingIds = contactIds.filter((id) => !existingIds.includes(id));

    if (missingIds.length > 0) {
      throw new Error(
        `Los siguientes IDs de contactos no existen: ${missingIds.join(", ")}`,
      );
    }

    return await repository.addContactsToCampaign(campaignId, contactIds);
  }

  async changeStatus(id: number, status: "running" | "paused") {
    const exists = await repository.findById(id);
    if (!exists) throw new Error("La campaña no existe");

    return await repository.updateStatus(id, status);
  }

  async getCampaignProgress(id: number) {
    const exists = await repository.findById(id);
    if (!exists) throw new Error("La campaña no existe");

    const rawProgress = await repository.getProgress(id);

    const total = parseInt(rawProgress.total, 10) || 0;
    const pending = parseInt(rawProgress.pending, 10) || 0;
    const sent = parseInt(rawProgress.sent, 10) || 0;
    const failed = parseInt(rawProgress.failed, 10) || 0;

    const completado =
      total === 0 ? 0 : Math.round(((sent + failed) / total) * 100);

    return {
      total,
      pending,
      sent,
      failed,
      porcentaje_completado: completado,
    };
  }
}

import { CampaignRepository } from "./campaign.repository.js";

const repository = new CampaignRepository();

export class CampaignService {
  async createCampaign(name: string, rateLimit: number) {
    if (!name || rateLimit <= 0)
      throw new Error("Nombre y límite por minuto son obligatorios");
    return await repository.create(name, rateLimit);
  }

  async attachContacts(campaignId: number, contactIds: number[]) {
    if (!contactIds || contactIds.length === 0)
      throw new Error("La lista de contactos no puede estar vacía");
    return await repository.addContactsToCampaign(campaignId, contactIds);
  }

  async changeStatus(id: number, status: "running" | "paused") {
    return await repository.updateStatus(id, status);
  }

  // --- PASO 3: Lógica para calcular porcentajes ---
  async getCampaignProgress(id: number) {
    const rawProgress = await repository.getProgress(id);

    const total = parseInt(rawProgress.total, 10) || 0;
    const pending = parseInt(rawProgress.pending, 10) || 0;
    const sent = parseInt(rawProgress.sent, 10) || 0;
    const failed = parseInt(rawProgress.failed, 10) || 0;

    // Fórmula: Porcentaje es (Enviados + Fallidos) / Total
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

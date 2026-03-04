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


  async changeStatus(id: number, status: 'running' | 'paused') {
  return await repository.updateStatus(id, status);
}
}

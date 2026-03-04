import pool from "../../config/db.js";
import { type Campaign } from "./campaign.types.js";

export class CampaignRepository {
  async create(name: string, rateLimit: number): Promise<Campaign> {
    const query = `
      INSERT INTO campaigns (name, rate_limit_per_minute, status)
      VALUES ($1, $2, 'draft')
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [name, rateLimit]);
    return rows[0];
  }

  // Vincular una lista de IDs de contactos a la campaña en la tabla pivote
  async addContactsToCampaign(
    campaignId: number,
    contactIds: number[],
  ): Promise<void> {
    // Generamos un insert múltiple: (camp_id, contact_id, 'pending'), (...)
    const values = contactIds
      .map((cId) => `(${campaignId}, ${cId}, 'pending')`)
      .join(",");
    const query = `
      INSERT INTO campaign_contacts (campaign_id, contact_id, status)
      VALUES ${values};
    `;
    await pool.query(query);
  }


  async updateStatus(campaignId: number, status: string): Promise<void> {
    const query = `
      UPDATE campaigns 
      SET status = $1 
      WHERE id = $2;
    `;
    await pool.query(query, [status, campaignId]);
  }
}

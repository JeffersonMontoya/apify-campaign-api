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


  async getProgress(campaignId: number) {
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'sent' THEN 1 END) as sent,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed
      FROM campaign_contacts
      WHERE campaign_id = $1;
    `;
    const { rows } = await pool.query(query, [campaignId]);
    return rows[0];
  }
}

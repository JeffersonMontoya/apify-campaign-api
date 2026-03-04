import pool from "../config/db.js";

class CampaignProcessor {
  private timer: NodeJS.Timeout | null = null;
  private isProcessing: boolean = false;

  // Iniciar el cronjob para ejecutarse cada X milisegundos (ej: 60000 para un minuto)
  start(intervalMs: number = 60000) {
    if (this.timer) {
      clearInterval(this.timer);
    }

    console.log(
      `🤖 Iniciando motor de procesamiento en background (intervalo: ${intervalMs}ms)`,
    );
    this.timer = setInterval(() => this.processInterval(), intervalMs);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      console.log("🛑 Motor de procesamiento detenido.");
    }
  }

  private async processInterval() {
    // Evitar sobrelapamientos si el proceso dura más que el intervalo
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      await this.processRunningCampaigns();
    } catch (error) {
      console.error("❌ Error en el motor de campañas (background):", error);
    } finally {
      this.isProcessing = false;
    }
  }

  private async processRunningCampaigns() {
    // 1. Obtener todas las campañas que estén en estado 'running'
    const campaignsQuery = `
      SELECT id, rate_limit_per_minute 
      FROM campaigns 
      WHERE status = 'running';
    `;
    const { rows: campaigns } = await pool.query(campaignsQuery);

    if (campaigns.length === 0) return;

    for (const campaign of campaigns) {
      await this.processCampaign(campaign.id, campaign.rate_limit_per_minute);
    }
  }

  private async processCampaign(campaignId: number, rateLimit: number) {
    // 2. Obtener contactos pendientes de la campaña (respetando el limitador)
    const pendingContactsQuery = `
      SELECT id 
      FROM campaign_contacts
      WHERE campaign_id = $1 AND status = 'pending'
      LIMIT $2;
    `;
    const { rows: contacts } = await pool.query(pendingContactsQuery, [
      campaignId,
      rateLimit,
    ]);

    if (contacts.length === 0) {
      // 3. Revisamos si ya no quedan NADA de pendientes absolutos para terminar la campaña
      const checkPendingQuery = `SELECT COUNT(*) as count FROM campaign_contacts WHERE campaign_id = $1 AND status = 'pending'`;
      const { rows: check } = await pool.query(checkPendingQuery, [campaignId]);

      if (parseInt(check[0].count, 10) === 0) {
        await pool.query(
          `UPDATE campaigns SET status = 'finished' WHERE id = $1`,
          [campaignId],
        );
        console.log(`🏁 Campaña ${campaignId} terminada automáticamente.`);
      }
      return;
    }

    // 4. Procesar matemáticamente (Simulando 90% sent y 10% failed)
    let enviosMoc = 0;

    for (const contact of contacts) {
      enviosMoc++;
      // Generar suerte (10% de probabilidad de fallo)
      const isFailed = Math.random() < 0.1;

      if (isFailed) {
        await pool.query(
          `UPDATE campaign_contacts SET status = 'failed', last_error = 'Error simulado (Timeout)', sent_at = NOW() WHERE id = $1`,
          [contact.id],
        );
      } else {
        await pool.query(
          `UPDATE campaign_contacts SET status = 'sent', sent_at = NOW() WHERE id = $1`,
          [contact.id],
        );
      }
    }

    console.log(
      `✉️ [Campaña ${campaignId}] - Procesó ${enviosMoc} contactos respetando el Rate Limit de ${rateLimit}.`,
    );
  }
}

// Singleton export para que sea una sola instancia
export const backgroundProcessor = new CampaignProcessor();

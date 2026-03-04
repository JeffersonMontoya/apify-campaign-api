import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import campaignRoutes from './modules/campaign/campaign.routes.js';

const app: Application = express();

app.use(cors());
app.use(express.json());


app.use('/campaigns', campaignRoutes);

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'API Funcionando con TypeScript' });
});

export default app;
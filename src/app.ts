import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import campaignRoutes from "./routes/campaign.routes.js";
import { successResponse } from "./utils/response.js";

const app: Application = express();

app.use(express.json());

app.use("/campaigns", campaignRoutes);

app.get("/health", (_req: Request, res: Response) => {
  return successResponse(res, 200, "API Funcionando correctamente", {
    status: "UP",
  });
});

export default app;

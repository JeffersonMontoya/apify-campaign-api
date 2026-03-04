import { z } from "zod";

export const createCampaignSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  rate_limit_per_minute: z
    .number()
    .int("El límite debe ser un número entero")
    .positive("El límite debe ser un número positivo"),
});

export const addContactsSchema = z.object({
  contact_ids: z
    .array(z.number())
    .min(1, "Debe enviar al menos un ID de contacto"),
});

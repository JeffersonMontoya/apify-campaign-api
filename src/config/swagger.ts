import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Apify Campaign API Documentation",
      version: "1.0.0",
      description:
        "API REST para la gestión y simulación de envío masivo de campañas de mensajería.",
      contact: {
        name: "Developer Support",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de desarrollo",
      },
    ],
    components: {
      schemas: {
        Campaign: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Campaña Especial" },
            rate_limit_per_minute: { type: "integer", example: 10 },
            status: { type: "string", example: "draft" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        Response: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: { type: "object", nullable: true },
          },
        },
      },
    },
  },
  // Rutas donde Swagger buscará anotaciones JSDoc
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);

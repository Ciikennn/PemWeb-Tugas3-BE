import express from "express";
import cors from "cors";
import { logger } from "./middlewares/logger";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";
import productRoutes from "./routes/product.route";

const app = express();

app.use(logger);
// Izinkan frontend (Vite) mengakses API
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: true, message: "Server Manajemen Produk berjalan dengan baik" });
});

app.use("/api/products", productRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

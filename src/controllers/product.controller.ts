import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { HttpError } from "../utils/HttpError";

const select = { id: true, name: true, price: true } as const;

// Validasi body untuk create & update
const parseProductInput = (body: unknown) => {
  const { name, price } = (body ?? {}) as { name?: unknown; price?: unknown };

  if (typeof name !== "string" || name.trim() === "") {
    throw new HttpError(400, "Nama produk wajib diisi");
  }

  const priceNumber = Number(price);
  if (price === null || price === "" || !Number.isInteger(priceNumber) || priceNumber <= 0) {
    throw new HttpError(400, "Harga harus berupa bilangan bulat lebih dari 0");
  }

  return { name: name.trim(), price: priceNumber };
};

const parseId = (value: unknown) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, "ID produk tidak valid");
  }
  return id;
};

const findProductOr404 = async (id: number) => {
  const product = await prisma.product.findUnique({ where: { id }, select });
  if (!product) {
    throw new HttpError(404, "Produk tidak ditemukan");
  }
  return product;
};

// GET /api/products?search=
export const getAllProducts = async (req: Request, res: Response) => {
  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";

  const products = await prisma.product.findMany({
    where: search ? { name: { contains: search, mode: "insensitive" } } : undefined,
    orderBy: { id: "asc" },
    select,
  });

  res.json({ status: true, message: "Berhasil mengambil data produk", data: products });
};

// GET /api/products/:id
export const getProductById = async (req: Request, res: Response) => {
  const product = await findProductOr404(parseId(req.params.id));
  res.json({ status: true, message: "Berhasil mengambil detail produk", data: product });
};

// POST /api/products
export const createProduct = async (req: Request, res: Response) => {
  const data = parseProductInput(req.body);
  const product = await prisma.product.create({ data, select });
  res.status(201).json({ status: true, message: "Produk berhasil ditambahkan", data: product });
};

// PUT /api/products/:id
export const updateProduct = async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  const data = parseProductInput(req.body);
  await findProductOr404(id);

  const product = await prisma.product.update({ where: { id }, data, select });
  res.json({ status: true, message: "Produk berhasil diperbarui", data: product });
};

// DELETE /api/products/:id
export const deleteProduct = async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  const product = await findProductOr404(id);

  await prisma.product.delete({ where: { id } });
  res.json({ status: true, message: "Produk berhasil dihapus", data: product });
};

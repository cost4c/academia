import express from "express";
import { planos } from "../db/data.js";
import { ok } from "../utils/http.js";

const router = express.Router();

router.get("/", (req, res) => {
  const { q, page = 1, limit = 10, sort = "preco", dir = "asc" } = req.query;
  let result = planos;

  if (q) result = result.filter(p => p.nome.toLowerCase().includes(q.toLowerCase()));

  result.sort((a, b) => (dir === "asc" ? a[sort] - b[sort] : b[sort] - a[sort]));
  const paginated = result.slice((page - 1) * limit, page * limit);

  ok(res, paginated);
});

export default router;

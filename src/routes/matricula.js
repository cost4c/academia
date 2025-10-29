import express from "express";
import { matriculas } from "../db/data.js";
import { ok, created, noContent, badRequest, notFound } from "../utils/http.js";

const router = express.Router();

// Listar todas as matrículas
router.get("/", (req, res) => ok(res, matriculas));

// Criar matrícula manualmente (opcional)
router.post("/", (req, res) => {
  const { aluno_id, plano_id } = req.body;
  if (!aluno_id || !plano_id)
    return badRequest(res, "Campos obrigatórios ausentes");

  const id = matriculas.length + 1;
  const nova = { id, aluno_id, plano_id, data_matricula: new Date().toISOString() };
  matriculas.push(nova);
  created(res, nova);
});

// Cancelar matrícula
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const idx = matriculas.findIndex(m => m.id == id);
  if (idx === -1) return notFound(res, "Matrícula não encontrada");

  matriculas.splice(idx, 1);
  noContent(res);
});

export default router;

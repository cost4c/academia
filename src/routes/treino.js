import express from "express";
import { treinos } from "../db/data.js";
import { ok, badRequest, created, noContent } from "../utils/http.js";

const router = express.Router();

// Listar todos os treinos
router.get("/", (req, res) => ok(res, treinos));

// Adicionar treino manualmente (caso queira)
router.post("/", (req, res) => {
  const { aluno_id, nome, serie, repeticoes } = req.body;

  if (!aluno_id || !nome) return badRequest(res, "Campos obrigatórios");
  if (treinos.some(t => t.aluno_id == aluno_id && t.nome === nome))
    return badRequest(res, "Treino já existente para o aluno");

  const id = treinos.length + 1;
  const novo = { id, aluno_id, nome, serie, repeticoes };
  treinos.push(novo);
  created(res, novo);
});

// Remover treino
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const idx = treinos.findIndex(t => t.id == id);
  if (idx === -1) return badRequest(res, "Treino não encontrado");

  treinos.splice(idx, 1);
  noContent(res);
});

export default router;

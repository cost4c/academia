import express from "express";
import { alunos, treinos, planos, matriculas } from "../db/data.js";
import { validarAluno } from "../validators/alunos.js";
import {
  ok,
  created,
  noContent,
  badRequest,
  notFound,
} from "../utils/http.js";

const router = express.Router();

// Função auxiliar: gera treinos aleatórios
const gerarTreinosAleatorios = (aluno_id) => {
  const exercicios = [
    "Supino",
    "Agachamento",
    "Remada Curvada",
    "Desenvolvimento",
    "Rosca Direta",
    "Abdominal"
  ];

  const sorteados = exercicios
    .sort(() => 0.5 - Math.random())
    .slice(0, 2)
    .map((nome, i) => ({
      id: treinos.length + i + 1,
      aluno_id,
      nome,
      serie: Math.floor(Math.random() * 3) + 3, // 3–5 séries
      repeticoes: Math.floor(Math.random() * 6) + 8 // 8–13 reps
    }));

  treinos.push(...sorteados);
};

// Função auxiliar: gera matrícula aleatória
const gerarMatriculaAleatoria = (aluno_id) => {
  const plano = planos[Math.floor(Math.random() * planos.length)];
  const novaMatricula = {
    id: matriculas.length + 1,
    aluno_id,
    plano_id: plano.id,
    data_matricula: new Date().toISOString()
  };
  matriculas.push(novaMatricula);
};

// Criar aluno + gerar treinos e matrícula automaticamente
router.post("/", (req, res) => {
  const erro = validarAluno(req.body);
  if (erro) return badRequest(res, erro);

  const id = alunos.length + 1;
  const novo = { id, ...req.body };
  alunos.push(novo);

  gerarTreinosAleatorios(id);
  gerarMatriculaAleatoria(id);

  created(res, {
    ...novo,
    mensagem: "Aluno cadastrado com sucesso. Treinos e matrícula gerados automaticamente."
  });
});

// Editar aluno
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const aluno = alunos.find(a => a.id == id);
  if (!aluno) return notFound(res, "Aluno não encontrado");

  const erro = validarAluno({ ...aluno, ...req.body });
  if (erro) return badRequest(res, erro);

  Object.assign(aluno, req.body);
  ok(res, aluno);
});

// Remover aluno e seus dados relacionados
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const idx = alunos.findIndex(a => a.id == id);
  if (idx === -1) return notFound(res, "Aluno não encontrado");

  alunos.splice(idx, 1);

  // Apagar treinos e matrícula vinculados
  for (let i = treinos.length - 1; i >= 0; i--) {
    if (treinos[i].aluno_id == id) treinos.splice(i, 1);
  }
  for (let i = matriculas.length - 1; i >= 0; i--) {
    if (matriculas[i].aluno_id == id) matriculas.splice(i, 1);
  }

  noContent(res);
});

// Listar treinos do aluno
router.get("/:id/treinos", (req, res) => {
  const { id } = req.params;
  const result = treinos.filter(t => t.aluno_id == id);
  ok(res, result);
});

// Listar matrícula do aluno
router.get("/:id/matricula", (req, res) => {
  const { id } = req.params;
  const matricula = matriculas.find(m => m.aluno_id == id);
  if (!matricula) return notFound(res, "Matrícula não encontrada");
  ok(res, matricula);
});

export default router;

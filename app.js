import express from "express";
import cors from "cors";

import planosRoutes from "./src/routes/planos.js";
import alunosRoutes from "./src/routes/alunos.js";
import treinoRoutes from "./src/routes/treino.js";
import matriculaRoutes from "./src/routes/matricula.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/planos", planosRoutes);
app.use("/alunos", alunosRoutes);
app.use("/treino", treinoRoutes);
app.use("/matricula", matriculaRoutes);

app.get("/", (req, res) => res.json({ message: "API da Academia 💪" }));

export default app;

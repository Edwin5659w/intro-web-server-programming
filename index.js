const express = require("express");
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

let tasks = [];
let nextId = 1;

app.get("/", (req, res) => {
  res.send("Hello World desde Express!");
});

app.post("/tasks", (req, res) => {
  const { title, description } = req.body || {};
  if (!title || typeof title !== "string") {
    return res.status(400).json({ message: "title es requerido y debe ser string" });
  }
  const newTask = {
    id: nextId++,
    title: title.trim(),
    description: description ? String(description) : "",
    status: "PENDING",
    createdAt: Date.now()
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const t = tasks.find(x => x.id === id);
  if (!t) return res.status(404).json({ message: "Tarea no encontrada" });
  res.json(t);
});

app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const t = tasks.find(x => x.id === id);
  if (!t) return res.status(404).json({ message: "Tarea no encontrada" });

  const { title, description, status } = req.body || {};
  if (title !== undefined) {
    if (!title || typeof title !== "string") return res.status(400).json({ message: "title debe ser string no vacío" });
    t.title = title.trim();
  }
  if (description !== undefined) t.description = String(description);
  if (status !== undefined) {
    const allowed = ["PENDING", "IN_PROGRESS", "DONE"];
    if (!allowed.includes(status)) return res.status(400).json({ message: `status inválido. Opciones: ${allowed.join(", ")}` });
    t.status = status;
  }
  t.updatedAt = Date.now();
  res.json(t);
});

app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = tasks.findIndex(x => x.id === id);
  if (idx === -1) return res.status(404).json({ message: "Tarea no encontrada" });
  const [removed] = tasks.splice(idx, 1);
  res.json({ message: "Tarea eliminada", task: removed });
});

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});

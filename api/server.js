import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static("public"));

const DATA_FILE = path.join(__dirname, "data.json");
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));

function load() { return JSON.parse(fs.readFileSync(DATA_FILE)); }
function save(data) { fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2)); }

app.get("/get-project/:id", (req, res) => {
  const data = load();
  const proj = data.find(p => p.projectId === req.params.id) || { components: [], name: "New Project" };
  res.json(proj);
});

app.post("/save-project", (req, res) => {
  const { projectId, components } = req.body;
  let data = load();
  data = data.filter(p => p.projectId !== projectId);
  data.push({ projectId, components, updatedAt: new Date().toISOString() });
  save(data);
  res.json({ ok: true });
});

app.get("/health", (req, res) => res.json({ status: "ok", vibe: "on" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`VIBEⓈ Backend running on ${PORT}`));

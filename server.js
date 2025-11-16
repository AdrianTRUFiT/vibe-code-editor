const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'data.json');
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({ blocks: [] }, null, 2));

app.get('/api/page', (req, res) => {
  try { res.json(JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))); }
  catch { res.status(500).json({ error: 'read fail' }); }
});

app.post('/api/page', (req, res) => {
  try { fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2)); res.json({ success: true }); }
  catch { res.status(500).json({ error: 'save fail' }); }
});

app.get('/health', (req, res) => res.json({ status: 'ok', vibe: 'on' }));

app.listen(PORT, () => console.log(`VIBE⓸ on ${PORT}`));
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Data file
const DATA_FILE = path.join(__dirname, '..', 'data.json');

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ blocks: [] }, null, 2));
}

// API: Get current page
app.get('/api/page', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// API: Save page
app.post('/api/page', (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', vibe: 'on' });
});

// Start server
app.listen(PORT, () => {
  console.log(`VIBE⓸ Backend running on ${PORT}`);
  console.log(`Your service is live at https://vibe-code-editor.onrender.com`);
});

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { ENV } from './lib/env.js';
import { mongoConnect } from './lib/db.js';
import { serve } from 'inngest/express';
import { inngest, functions } from './lib/inngest.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use('/api/inngest', serve({ client: inngest, functions }));

// ====== YE SABSE UPAR HONA CHAHIYE (listen se pehle) ======
if (process.env.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  // Sab routes jo API nahi hain → React ko bhej do
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
  });
}

// Test routes (production mein bhi chalenge lekin React override kar dega)
app.get('/api', (req, res) => {
  res.json({ message: "Backend working!" });
});

// Server start
const PORT = ENV.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await mongoConnect();
});
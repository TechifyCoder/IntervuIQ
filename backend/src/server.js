import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';   // ← ye add karna jaruri tha
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

// Test routes
app.get('/', (req, res) => {
  res.json({ message: "This is backend" });
});
app.get('/books', (req, res) => {
  res.json({ message: "This is book check" });
});

// ============ PRODUCTION ME FRONTEND SERVE (sabse upar rakhna jaruri!) ============
if (process.env.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Vite ka dist folder serve karo (project root se)
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  // Baaki sab routes pe React ka index.html bhej do
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
  });
}

// Server start (sirf ek baar!)
const PORT = ENV.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await mongoConnect();           // sirf ek baar call karo
});
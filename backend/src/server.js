import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { ENV } from './lib/env.js';
import { mongoConnect } from './lib/db.js';
import { serve } from 'inngest/express';
import { inngest, functions } from './lib/inngest.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

// Inngest route
app.use('/api/inngest', serve({ client: inngest, functions }));

// ========= PRODUCTION: FRONTEND SERVE (sabse pehle!) =========
if (process.env.NODE_ENV === "production") {
  // Correct path for Render (Vite dist folder)
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  
  app.use(express.static(frontendPath));

  // IMPORTANT: API routes se pehle ye rakhna, lekin API ko exclude karna
  app.get(/^\/(?!api|api\/).*/, (req, res) => {   // ← sirf /api ko chhod kar baaki sab pe React bhejega
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Baaki sab API routes yahan aayenge (import kar lo apne routes)
app.get('/api', (req, res) => {
  res.json({ message: "Backend API working!" });
});

// agar aur routes hain to yahan import kar lo
// import userRoutes from './routes/user.js';
// app.use('/api/users', userRoutes);
// etc.

// Server start
const PORT = ENV.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await mongoConnect();
});
import express from 'express';
import path from 'path';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import { ENV } from './lib/env.js';
import { mongoConnect } from './lib/db.js';
import { serve } from 'inngest/express';
import { inngest, functions } from './lib/inngest.js';
import chatRoute from './routes/chatRoute.js';
import sessionRoute from './routes/sessionRoute.js';
import { User } from './Models/User.js';

const app = express();

app.use(express.json());

const allowedOrigins = [
  ENV.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174"
];

app.use(cors({
  origin: function (origin, callback) {
    // Removed undefined 'AC' token
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('CORS blocked origin: ' + origin));
    }
  },
  credentials: true
}));

// Database connection bound to request lifecycle for serverless cold starts
app.use(async (req, res, next) => {
  try {
    await mongoConnect();
    next();
  } catch (error) {
    console.error("Database connection failed", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use(clerkMiddleware());

app.use('/api/inngest', serve({ client: inngest, functions }));
app.use('/api/chat', chatRoute);
app.use('/api/session', sessionRoute);

app.get('/api/books', (req, res) => {
  res.json({ message: "This is book check" });
});

app.get('/api/debug/create-user', async (req, res) => {
  try {
    const clerkId = req.query.clerkId || "user_39IbJFWtTepyxgB7nJzb0MhuNBf"; 
    const { upsertStreamUser } = await import('./lib/stream.js');

    try {
      await User.collection.dropIndex('username_1');
    } catch (err) {
      // Ignore if index doesn't exist
    }

    let user = await User.findOne({ clerkId });
    if (!user) {
      user = await User.create({
        clerkId,
        email: `manual_${clerkId}@example.com`,
        name: "Satish Patel (Manual)",
        profileImage: "https://www.gravatar.com/avatar/?d=mp"
      });
    }

    await upsertStreamUser({
      id: user.clerkId.toString(),
      name: user.name,
      image: user.profileImage,
    });

    res.send(`User synced successfully! ID: ${user._id}`);
  } catch (e) {
    console.error(e);
    res.status(500).send(e.toString());
  }
});

if (ENV.NODE_ENV === "production") {
  const rootDir = process.cwd();
  const frontendDistPath = path.join(rootDir, "frontend", "dist");
  
  app.use(express.static(frontendDistPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

// startServer() block removed entirely. Vercel acts as the server.
export default app;
import express from 'express'
import path from 'path'
import cors from 'cors'
import { clerkMiddleware } from '@clerk/express'
import { ENV } from './lib/env.js';
import { mongoConnect } from './lib/db.js';
import { serve } from 'inngest/express'
import { inngest, functions } from './lib/inngest.js';
import { protectRoute } from './middleware/protectRoute.js';
import chatRoute from './routes/chatRoute.js'
import sessionRoute from './routes/sessionRoute.js'
import { User } from './Models/User.js';

const app = express();


app.use(express.json())

// credentials means : server allows to a browser include cokkies on request
app.use(cors({ 
  origin: [ENV.CLIENT_URL, "http://localhost:5173", "http://localhost:5174"], 
  credentials: true 
}))

app.use(clerkMiddleware())

app.use('/api/inngest', serve({ client: inngest, functions }))
app.use('/api/chat', chatRoute)
app.use('/api/session', sessionRoute)

const __dirname = path.resolve();


console.log(ENV.PORT);
console.log(ENV.MONGO_URL);

// app.get('/',(req,res) => {
//     res.json({message:"This is get check"})
// })
app.get('/api/books', (req, res) => {
  res.json({ message: "This is book check" })
})

app.get('/api/debug/create-user', async (req, res) => {
  try {
    const clerkId = req.query.clerkId || "user_39IbJFWtTepyxgB7nJzb0MhuNBf"; // Specific user from latest error logs
    const { upsertStreamUser } = await import('./lib/stream.js');

    // Fix: Drop potential stale index that causes duplicate key errors
    try {
      await User.collection.dropIndex('username_1');
      console.log("Dropped stale username_1 index");
    } catch (err) {
      // Ignore error if index doesn't exist
    }

    let user = await User.findOne({ clerkId });
    if (!user) {
      user = await User.create({
        clerkId,
        email: `manual_${clerkId}@example.com`, // Unique email to avoid duplicate key error
        name: "Satish Patel (Manual)",
        profileImage: "https://www.gravatar.com/avatar/?d=mp"
      });
      console.log("Created user in DB:", user);
    } else {
      console.log("User already exists in DB:", user);
    }

    // Sync with Stream
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

// app.listen(ENV.PORT,() => {
//     console.log(`Server is running on port ${ENV.PORT}`)
//     mongoConnect();
// })

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")))

  app.get("/{*any}", (req, res) => {
    res.sendFile((path.join(__dirname, "../frontend", "dist", "index.html")))
  })
}

const startServer = async () => {
  try {
    await mongoConnect();
    // Do not run app.listen in production (Vercel) automatically
    if (ENV.NODE_ENV !== "production") {
      app.listen(ENV.PORT, () => console.log("Server is running on port:", ENV.PORT));
    }
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};

startServer();

export default app;
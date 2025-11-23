import express from 'express'
import path from 'path'
import cors from 'cors'
import { clerkMiddleware } from '@clerk/express'
import { ENV } from './lib/env.js';
import { mongoConnect } from './lib/db.js';
import { serve } from 'inngest/express'
import { inngest,functions } from './lib/inngest.js';
import { protectRoute } from './middleware/protectRoute.js';
import chatRoute from './routes/chatRoute.js'
import sessionRoute from './routes/sessionRoute.js'
const app = express();


app.use(express.json())

// credentials means : server allows to a browser include cokkies on request
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}))

app.use('/api/inngest',serve({client:inngest,functions}))
app.use('/api/chat',chatRoute)
app.use('/api/session',sessionRoute)

const __dirname = path.resolve();
app.use(clerkMiddleware())


console.log(ENV.PORT);
console.log(ENV.MONGO_URL);

// app.get('/',(req,res) => {
//     res.json({message:"This is get check"})
// })
app.get('/api/books',protectRoute,(req,res) => {
    res.json({message:"This is book check"})
})

// app.listen(ENV.PORT,() => {
//     console.log(`Server is running on port ${ENV.PORT}`)
//     mongoConnect();
// })

if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

    app.get("/{*any}",(req,res) => {
        res.sendFile((path.join(__dirname,"../frontend","dist","index.html")))
    })
}

const startServer = async () => {
  try {
    await mongoConnect();
    app.listen(ENV.PORT, () => console.log("Server is running on port:", ENV.PORT));
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};

startServer();
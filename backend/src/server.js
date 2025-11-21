import express from 'express'
import path from 'path'
import cors from 'cors'
import { ENV } from './lib/env.js';
import { mongoConnect } from './lib/db.js';
import { serve } from 'inngest/express'
import { inngest,functions } from './lib/inngest.js';
const app = express();


app.use(express.json())

// credentials menas : server allows to a browser include cokkies on request
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}))

app.use('/api/inngest',serve({client:inngest,functions}))

const __dirname = path.resolve();



console.log(ENV.PORT);
console.log(ENV.MONGO_URL);

app.get('/books',(req,res) => {
    res.json({message:"This is book check"})
})

app.listen(ENV.PORT,() => {
    console.log(`Server is running on port ${ENV.PORT}`)
    mongoConnect();
})

if(ENV.NODE_ENV = "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

    app.get("/{*any}",(req,res) => {
        res.sendFile((path.join(__dirname,"../frontend","dist","index.html")))
    })
}

const startServer = async () => {
    try {
        await mongoConnect();
            app.listen(ENV.PORT,() => {
                console.log(`Server is running on port ${ENV.PORT}`)
                mongoConnect();
            })        
    } catch (error) {
        console.error("unable to connect the server ",error)
    }
}
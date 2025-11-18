import express from 'express'
import { ENV } from './lib/env.js';
import { mongoConnect } from './lib/db.js';
const app = express();


console.log(ENV.PORT);
console.log(ENV.MONGO_URL);
app.get('/',(req,res) => {
    res.json({message:"This is backend"})
})

app.listen(ENV.PORT,() => {
    console.log(`Server is running on port ${ENV.PORT}`)
    mongoConnect();
})

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
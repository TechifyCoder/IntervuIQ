import { Inngest } from 'inngest'
import { mongoConnect } from './db.js'
import { User } from 'lucide-react';

export const inngest = new Inngest({id:"inter-iq"})

const syncUser = inngest.createFunction(
    {id:"sync-user"},
    {event:"clerk/user.created"},
    async ({event}) => {
        await mongoConnect();

        const {id,email_addresses,first_name,last_name,image_url} = event.data

        const newUser = {
            clerkId:id,
            email:email_addresses?.email_address,
            name:`${first_name || ""} ${last_name || ""}`,
            profileImage:image_url
        }
        await User.create(newUser)
    }
)

const deleteUserFromDB = inngest.createFunction(
    {id:"delete-user"},
    {event:"clerk/user.deleted"},
    async ({event}) => {
        await mongoConnect();

        const { id } = event.data
            await User.deleteOne({clerkId:id});
        
    }
)

export const functions = [syncUser,deleteUserFromDB]
import { Inngest } from 'inngest'
import { mongoConnect } from './db.js'
import { User } from '../Models/User.js';
import { deleteStreamUser, upsertStreamUser } from './stream.js';

export const inngest = new Inngest({id:"inter-iq"})

const syncUser = inngest.createFunction(
    {id:"sync-user"},
    {event:"clerk/user.created"},
    async ({event}) => {
        await mongoConnect();

        const {id,email_addresses,first_name,last_name,image_url} = event.data
        
        const newUser = {
            clerkId:id,
            email:email_addresses?.[0]?.email_address,
            name:`${first_name || ""} ${last_name || ""}`,
            profileImage:image_url
        }
        await User.create(newUser)

        await upsertStreamUser({
            id: newUser.clerkId.toString(),
            name: newUser.name,
            image: newUser.profileImage,
        });
    }
);

const deleteUserFromDB = inngest.createFunction(
    {id:"delete-user"},
    {event:"clerk/user.deleted"},
    async ({event}) => {
        await mongoConnect();

        const { id } = event.data
            await User.deleteOne({clerkId:id});
        
        deleteStreamUser(id.toString())
    }
)

export const functions = [syncUser,deleteUserFromDB]
import { inngest } from "./client";
import 
export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-create'
    },
    {
        event:'clerk/user.created'
    },
    async({event})=>{
        const {data}= event await prisma
    }

);
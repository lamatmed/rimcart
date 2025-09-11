import { inngest } from "./client";

export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-create'
    },
    {
        event:'clerk/user.created'
    },
    async({event})=>{
        const 
    }

);
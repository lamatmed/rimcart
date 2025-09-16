export async function GET(req){
    try {
        const {searchParams} = new URL(req.url)
        const username = searchParams.get('username').toLowerCase()
        if(!username){
           return Ner
        }
    } catch (error) {
        
    }
}
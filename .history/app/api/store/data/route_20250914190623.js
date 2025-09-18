export async function GET(req){
    try {
        const {searchParams} = new URL(req.url)
        const username = searchParams.get('username').to
    } catch (error) {
        
    }
}
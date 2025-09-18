import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

// Config pour Neon
neonConfig.webSocketConstructor = ws
neonConfig.poolQueryViaFetch = true

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })

// ❌ Pas de global.prisma → Edge runtime n’aime pas
// ✅ Toujours créer une instance
const prisma = new PrismaClient({ adapter })

export default prisma

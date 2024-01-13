import 'dotenv/config'

import { z } from 'zod'

const envSchema = z.object({
    NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
    PORT: z.coerce.number().default(3333),
    // DB_HOST: z.string().default('localhost'),
    // DB_USER: z.string().default('root'),
    // DB_PASSWORD: z.string().default('<PASSWORD>'),
    // DB_NAME: z.string().default('test'),
})

const _env = envSchema.safeParse(process.env)

if(_env.success === false) {
    console.error('❌ Invalid environment variables', _env.error.format())

    throw new Error('Invalid environment variables')
} 

export const env = _env.data
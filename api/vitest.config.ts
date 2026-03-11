import { defineConfig } from 'vitest/config'

process.env.MONGO_URI = 'mongodb://localhost:27017/lexidrift_test';
process.env.JWT_SECRET = 'test';
process.env.GOOGLE_CLIENT_ID = 'test';
process.env.GOOGLE_CLIENT_SECRET = 'test';
process.env.S3_DIR = 'test';
process.env.S3_BUCKET_NAME = 'test';
process.env.S3_SECRET_ACCESS_KEY = 'test';
process.env.S3_ACCESS_KEY_ID = 'test';
process.env.VIDEO_GENERATOR_API_KEY = 'test';

export default defineConfig({
    test: {
        globalSetup: 'test/seed/setup.ts'
    },
})
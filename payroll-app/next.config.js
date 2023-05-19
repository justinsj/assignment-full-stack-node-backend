/** @type {import('next').NextConfig} */

require('dotenv').config();

const nextConfig = {
    reactStrictMode: true,
    serverRuntimeConfig: {
        dbConfig: {
            host: process.env.DB_IP,
            port: 3306,
            user: 'root',
            password: process.env.DB_ROOT_PASSWORD,
            database: 'db'
        },
        secret: 'abcdefg'
    },
    publicRuntimeConfig: {
        apiUrl: process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000/api' // development api
            : 'http://localhost:3000/api' // production api
    }
}

module.exports = nextConfig
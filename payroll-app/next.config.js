/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    serverRuntimeConfig: {
        dbConfig: {
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '2204', // @@@
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
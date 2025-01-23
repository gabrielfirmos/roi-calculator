import cors from 'cors';

const corsMiddleware = cors({
    methods: ['GET', 'POST', 'OPTIONS'],
    origin: '*', // In production, replace with your actual domains
    optionsSuccessStatus: 200
});

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

export default async function handler(req, res) {
    // Run the CORS middleware
    await runMiddleware(req, res, corsMiddleware);

    const { id } = req.query;

    try {
        if (req.method === 'GET') {
            // Return widget configuration
            res.status(200).json({
                id,
                config: {
                    defaultTab: 'time',
                    theme: {
                        colors: {
                            vampireBlack: '#08090A',
                            cultured: '#F7F8F8',
                            argent: '#C0C0C0',
                            gray: {
                                400: '#747474',
                                500: '#444545',
                                600: '#8C8C8C',
                            }
                        }
                    }
                }
            });
        } else if (req.method === 'POST') {
            const data = req.body;
            res.status(200).json({ 
                message: 'Data received successfully',
                receivedData: data
            });
        } else {
            res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
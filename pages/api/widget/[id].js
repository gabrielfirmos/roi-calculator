import cors from 'cors';

const corsMiddleware = cors({
  methods: ['GET', 'POST', 'OPTIONS'],
  origin: '*', // In production, replace with your actual domain(s)
  optionsSuccessStatus: 200,
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
          // Whichever tab you want to load by default
          defaultTab: 'time',

          // Let your front-end know to force dark mode
          forceDarkMode: true,

          // Suggest that the overall container background be transparent
          // so it won't override the parent page background
          backgroundColor: 'transparent',

          theme: {
            // DARK THEME COLORS
            colors: {
              // Dark background (the “vampire black”)
              vampireBlack: '#08090A',
              // Light text color
              cultured: '#F7F8F8',
              // Accent or border color
              argent: '#C0C0C0',
              // Grays for various UI elements
              gray: {
                400: '#8B8B8B',
                500: '#BBBBBB',
                600: '#737373',
              },
            },
          },
        },
      });
    } else if (req.method === 'POST') {
      const data = req.body;
      res.status(200).json({ 
        message: 'Data received successfully',
        receivedData: data,
      });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

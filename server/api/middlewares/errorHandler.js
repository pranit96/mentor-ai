export const errorHandler = (err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Error: ${err.message}`);
    
    const response = {
      error: process.env.NODE_ENV === 'production' 
        ? 'Something went wrong' 
        : err.message,
      code: err.code || 500
    };
  
    res.status(err.statusCode || 500).json(response);
  };
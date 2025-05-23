// const express = require('express');
// const { createProxyMiddleware } = require('http-proxy-middleware');

// const app = express();

// // Define the API endpoint you want to proxy to
// const apiProxy = createProxyMiddleware('/api', {
//   target: 'https://api1.kissangpt.com',
//   changeOrigin: true, // Required for CORS
// });

// // Set up the proxy middleware
// app.use('/api', apiProxy);

// // Start the proxy server
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Proxy server is listening on port ${port}`);
// });

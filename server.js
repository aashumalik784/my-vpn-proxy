const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
app.use('/', createProxyMiddleware({
    target: 'https://example.com',
    changeOrigin: true
}));
app.listen(3000, () => {
    console.log('Server running on port 3000');
});

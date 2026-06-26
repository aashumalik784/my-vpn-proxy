export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
<<<<<<< HEAD
  const url = new URL(req.url);
  const targetUrl = url.searchParams.get('url');
  
  if (!targetUrl) {
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>My VPN Proxy</title>
        <style>
          body { font-family: Arial; text-align: center; background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 50px; }
          input { padding: 15px; width: 80%; border-radius: 50px; border: none; font-size: 16px; margin: 20px 0; }
          button { padding: 15px 40px; background: white; color: #764ba2; border: none; border-radius: 50px; font-weight: bold; cursor: pointer; }
        </style>
      </head>
      <body>
        <h1>My VPN Proxy</h1>
        <input type="text" id="urlInput" placeholder="https://example.com">
        <br>
        <button onclick="go()">Browse</button>
        <script>
          function go() {
            const url = document.getElementById('urlInput').value;
            if (url) window.location.href = '/api/proxy?url=' + encodeURIComponent(url);
          }
        </script>
      </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }
  
  try {
    let finalUrl = targetUrl;
    if (!finalUrl.startsWith('http')) finalUrl = 'https://' + finalUrl;
    
    const response = await fetch(finalUrl);
=======
  try {
    const url = new URL(req.url);
    let targetUrl = url.searchParams.get('url');
    
    // Agar URL nahi diya, toh default page dikhayein
    if (!targetUrl) {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>My VPN Proxy</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              margin: 0; 
              padding: 50px 20px;
              min-height: 100vh;
            }
            h1 { font-size: 2.5em; margin-bottom: 30px; }
            input { 
              padding: 15px; 
              width: 80%; 
              max-width: 500px; 
              border-radius: 50px; 
              border: none; 
              font-size: 16px; 
              margin: 20px 0;
            }
            button { 
              padding: 15px 40px; 
              background: white; 
              color: #764ba2; 
              border: none; 
              border-radius: 50px; 
              font-weight: bold; 
              font-size: 16px; 
              cursor: pointer;
            }
            button:hover { background: #f0f0f0; }
          </style>
        </head>        <body>
          <h1>🔒 My VPN Proxy</h1>
          <p>Enter URL to browse:</p>
          <input type="text" id="urlInput" placeholder="https://example.com">
          <br>
          <button onclick="proxy()">Browse</button>
          <script>
            function proxy() {
              const url = document.getElementById('urlInput').value;
              if (url) {
                window.location.href = '/api/proxy?url=' + encodeURIComponent(url);
              }
            }
            document.getElementById('urlInput').addEventListener('keypress', function(e) {
              if (e.key === 'Enter') proxy();
            });
          </script>
        </body>
        </html>
      `, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }
    
    // URL ko validate karein
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }
    
    // Website ko fetch karein
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    
>>>>>>> f3a6bdb (Split backend (Render) and frontend (Vercel))
    const html = await response.text();
    
    return new Response(html, {
      status: response.status,
<<<<<<< HEAD
      headers: { 'Content-Type': 'text/html' }
=======
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Proxy-By': 'My VPN Proxy',
      },
>>>>>>> f3a6bdb (Split backend (Render) and frontend (Vercel))
    });
      } catch (error) {
    return new Response(`
      <html>
        <body style="background: #1a1a1a; color: white; padding: 50px; text-align: center; font-family: Arial;">
          <h1>❌ Error</
git add .
git commit -m "Fixed URL handling error"
git push origin main
cd ~/my-vpn-proxy

# Backend ke liye alag folder
mkdir backend

# Frontend ke liye alag folder  
mkdir frontend
cat << 'EOF' > backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Country servers configuration
const countries = {
  'us': { name: 'United States', flag: '🇺', server: 'https://example.com' },
  'uk': { name: 'United Kingdom', flag: '🇬🇧', server: 'https://example.co.uk' },
  'de': { name: 'Germany', flag: '🇩', server: 'https://example.de' },
  'jp': { name: 'Japan', flag: '🇯🇵', server: 'https://example.jp' },
  'sg': { name: 'Singapore', flag: '🇸🇬', server: 'https://example.sg' },
  'in': { name: 'India', flag: '🇮🇳', server: 'https://example.in' }
};

// Get available countries
app.get('/api/countries', (req, res) => {
  res.json(countries);
});

// Proxy endpoint
app.get('/api/proxy', async (req, res) => {
  const { country, url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL required' });
  }
  
  try {
    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }
    
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': country || 'en-US'
      }
    });
    
    const html = await response.text();
    res.send(html);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test connection endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'connected', 
    timestamp: new Date().toISOString(),
    message: 'VPN Backend is running!'
  });
});

app.listen(PORT, () => {
  console.log(`🔒 VPN Backend running on port ${PORT}`);
});

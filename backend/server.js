const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Country servers configuration
const countries = {
  'us': { name: 'United States', flag: '🇺🇸', server: 'https://example.com' },
  'uk': { name: 'United Kingdom', flag: '🇬🇧', server: 'https://example.co.uk' },
  'de': { name: 'Germany', flag: '🇩🇪', server: 'https://example.de' },
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

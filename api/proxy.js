export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
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
    const html = await response.text();
    
    return new Response(html, {
      status: response.status,
      headers: { 'Content-Type': 'text/html' }
    });
  } catch (error) {
    return new Response('Error: ' + error.message, { status: 500 });
  }
}

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);
  const targetUrl = url.searchParams.get('url') || 'https://example.com';

  try {
    const response = await fetch(targetUrl);
    const html = await response.text();

    return new Response(html, {
      status: response.status,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    return new Response('Error: ' + error.message, { status: 500 });
  }
}

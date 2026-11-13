import 'dotenv/config';
import http from 'node:http';
import { handleNativeApiRequest } from './router.ts';

const port = Number(process.env.PORT || 3001);
const host = process.env.HOST || '0.0.0.0';

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid PORT value: ${process.env.PORT}`);
}

const server = http.createServer(async (req, res) => {
  try {
    const isHandled = await handleNativeApiRequest(req, res);
    if (!isHandled) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Not found yet' }));
    }
  } catch (err) {
    console.error('Unhandled API server error:', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Internal server error' }));
    }
  }
});

server.listen(port, host, () => {
  console.log(`MediCart API running on http://${host}:${port}`);
});

import { IncomingMessage, ServerResponse } from 'node:http';
import { ApiResponse } from '../../types.ts';

export async function parseJsonBody<T = unknown>(req: IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    let rawData = '';
    req.on('data', (chunk) => {
      rawData += chunk;
      // Safeguard against huge payloads (max 1MB)
      if (rawData.length > 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });

    req.on('end', () => {
      if (!rawData.trim()) {
        resolve({} as T);
        return;
      }
      try {
        const parsed = JSON.parse(rawData);
        resolve(parsed);
      } catch (err) {
        reject(new Error('Invalid JSON format in request body'));
      }
    });

    req.on('error', (err) => {
      reject(err);
    });
  });
}

export function parseQueryParams(reqUrl: string): { pathname: string; query: Record<string, string> } {
  const [pathname, queryString] = (reqUrl || '/').split('?');
  const query: Record<string, string> = {};

  if (queryString) {
    const searchParams = new URLSearchParams(queryString);
    searchParams.forEach((val, key) => {
      query[key] = val;
    });
  }

  return { pathname, query };
}

export function sendJson<T>(
  res: ServerResponse,
  statusCode: number,
  payload: ApiResponse<T>
): void {
  const responseData = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(responseData);
}

export function sendError(
  res: ServerResponse,
  statusCode: number,
  errorMessage: string
): void {
  sendJson(res, statusCode, {
    success: false,
    error: errorMessage,
  });
}

import type { Env } from './lib/db';
import { handleCreateOrder } from './routes/createOrder';
import { handleVerifyPayment } from './routes/verifyPayment';
import { handlePaymentWebhook } from './routes/paymentWebhook';
import { handleValidateKey } from './routes/validateKeyRoute';
import { handleRewriteProfile } from './routes/rewriteProfile';
import { handleAnalyzeProfile } from './routes/analyzeProfile';
import { handleGenerateDm } from './routes/generateDm';
import { handleGenerateResume } from './routes/generateResume';
import { handleSupportMessage } from './routes/supportMessage';
import { handleAdminMessages, handleAdminGenerations, handleAdminKeys } from './routes/admin';

type RouteHandler = (request: Request, env: Env) => Promise<Response>;

const ROUTES: Record<string, RouteHandler> = {
  'POST /create-order': handleCreateOrder,
  'POST /api/create-order': handleCreateOrder,
  'POST /verify-payment': handleVerifyPayment,
  'POST /api/verify-payment': handleVerifyPayment,
  'POST /payment-webhook': handlePaymentWebhook,
  'POST /api/payment-webhook': handlePaymentWebhook,
  'POST /validate-key': handleValidateKey,
  'POST /api/validate-key': handleValidateKey,
  'POST /rewrite-profile': handleRewriteProfile,
  'POST /analyze-profile': handleAnalyzeProfile,
  'POST /generate-dm': handleGenerateDm,
  'POST /generate-resume': handleGenerateResume,
  'POST /support-message': handleSupportMessage,
  'GET /admin/messages': handleAdminMessages,
  'GET /admin/generations': handleAdminGenerations,
  'GET /admin/keys': handleAdminKeys,
};

function corsPreflightResponse(origin: string): Response {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// A real user's browser can never send Origin: http://localhost:*, so allowing
// it here only ever helps local `wrangler dev` testing — it does not widen who
// can call the API in production.
function isAllowedOrigin(origin: string, env: Env): boolean {
  return origin === env.EXTENSION_ORIGIN || origin === env.CHECKOUT_ORIGIN || /^http:\/\/localhost:\d+$/.test(origin);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      const origin = request.headers.get('Origin') ?? '';
      if (isAllowedOrigin(origin, env)) {
        return corsPreflightResponse(origin);
      }
      return new Response('forbidden', { status: 403 });
    }

    const routeKey = `${request.method} ${url.pathname}`;
    const handler = ROUTES[routeKey];
    if (!handler) {
      return new Response('not found', { status: 404 });
    }

    try {
      return await handler(request, env);
    } catch (err) {
      console.error(`[${routeKey}] unhandled error:`, err);
      return new Response(JSON.stringify({ ok: false, error: 'internal_error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};

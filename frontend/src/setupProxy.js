// Scopes the dev proxy to /api only, so the webpack HMR websocket (/ws) is handled
// by the dev server instead of being forwarded to the backend (which broke hot
// reload and spammed "Could not proxy request /ws"). Target defaults to the
// docker-compose service; override locally with PROXY_TARGET.
//
// Note: API calls that use an absolute REACT_APP_API_URL bypass this entirely.
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.PROXY_TARGET || 'http://backend:3001',
      changeOrigin: true,
    })
  );
};

/**
 * Background service worker — acts as the secure proxy between popup and backend.
 * Never receives or stores raw scraped content. License key is stored in local storage.
 */

// Deployed Cloudflare Worker URL
const BACKEND_URL = 'https://careercraft-backend.careercraft-backend.workers.dev';

async function getStoredKey() {
  const { licenseKey } = await chrome.storage.local.get('licenseKey');
  return licenseKey ?? null;
}

async function callBackend(path, payload, method = 'POST') {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (method !== 'GET') {
    options.body = JSON.stringify(payload);
  }
  return fetch(`${BACKEND_URL}${path}`, options);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      const key = await getStoredKey();

      if (message.type === 'VALIDATE_KEY') {
        const response = await callBackend('/validate-key', {
          key: message.key,
          linkedinId: message.linkedinId ?? null,
        });
        sendResponse(await response.json());
        return;
      }

      if (!key) {
        sendResponse({ ok: false, error: 'no_key_stored' });
        return;
      }

      if (message.type === 'REWRITE_PROFILE') {
        const response = await callBackend('/rewrite-profile', { key, ...message.profile });
        sendResponse({ status: response.status, body: await response.json() });
        return;
      }

      if (message.type === 'GENERATE_DM') {
        const response = await callBackend('/generate-dm', { key, ...message.data });
        sendResponse({ status: response.status, body: await response.json() });
        return;
      }

      if (message.type === 'GENERATE_RESUME') {
        const response = await callBackend('/generate-resume', { key, ...message.profile });
        if (!response.ok) {
          const errBody = await response.json();
          sendResponse({ status: response.status, error: errBody.error });
          return;
        }
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        sendResponse({
          status: response.status,
          pdfBytes: Array.from(new Uint8Array(arrayBuffer)),
        });
        return;
      }

      if (message.type === 'SUPPORT_MESSAGE') {
        const response = await callBackend('/support-message', message.payload);
        sendResponse({ status: response.status, body: await response.json() });
        return;
      }

      sendResponse({ ok: false, error: 'unknown_message_type' });
    } catch (err) {
      sendResponse({ ok: false, error: String(err) });
    }
  })();
  return true; // keep message channel open for async response
});

'use strict';

// ── DOM references ──────────────────────────────────────────────────────────
const screens = {
  disclaimer: document.getElementById('disclaimer-screen'),
  key:        document.getElementById('key-screen'),
  main:       document.getElementById('main-screen'),
  support:    document.getElementById('support-screen'),
};

const $ = (id) => document.getElementById(id);

// ── Navigation ───────────────────────────────────────────────────────────────
function showScreen(name) {
  Object.entries(screens).forEach(([k, el]) => {
    el.hidden = k !== name;
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────
async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function scrapeCurrentProfile() {
  const tab = await getActiveTab();
  if (!tab?.url?.includes('linkedin.com/in/')) {
    throw new Error('not_on_linkedin_profile');
  }
  return chrome.tabs.sendMessage(tab.id, { type: 'SCRAPE_PROFILE' });
}

function bg(message) {
  return chrome.runtime.sendMessage(message);
}

function setSpinner(visible, label = 'Generating…') {
  const el = $('spinner');
  el.hidden = !visible;
  el.textContent = label;
}

function renderResults(title, content) {
  $('results-title').textContent = title;
  $('results-content').innerHTML = content;
  $('results').hidden = false;
}

function showError(elementId, message) {
  const el = $(elementId);
  el.textContent = message;
  el.hidden = false;
}

function clearError(elementId) {
  const el = $(elementId);
  el.textContent = '';
  el.hidden = true;
}

function formatRewrite(body) {
  return `
    <section>
      <label>Headline</label>
      <p>${escapeHtml(body.headline ?? '')}</p>
    </section>
    <section>
      <label>About</label>
      <p>${escapeHtml(body.about ?? '')}</p>
    </section>
    <section>
      <label>Experience</label>
      ${(body.experience ?? []).map((e) => `<p>• ${escapeHtml(e)}</p>`).join('')}
    </section>
  `.trim();
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Disclaimer screen ─────────────────────────────────────────────────────────
$('ack-checkbox').addEventListener('change', (e) => {
  $('ack-continue').disabled = !e.target.checked;
});

$('ack-continue').addEventListener('click', async () => {
  const { licenseKey } = await chrome.storage.local.get('licenseKey');
  showScreen(licenseKey ? 'main' : 'key');
});

// ── Key screen ────────────────────────────────────────────────────────────────
$('key-submit').addEventListener('click', async () => {
  clearError('key-error');
  const key = $('key-input').value.trim();
  if (!key) {
    showError('key-error', 'Please paste your license key.');
    return;
  }

  $('key-submit').disabled = true;
  $('key-submit').textContent = 'Validating…';

  try {
    let linkedinId = null;
    try {
      const profile = await scrapeCurrentProfile();
      linkedinId = profile.linkedinId ?? null;
    } catch {
      // If not on a LinkedIn profile page, proceed without binding
    }

    const result = await bg({ type: 'VALIDATE_KEY', key, linkedinId });

    if (result.ok) {
      await chrome.storage.local.set({ licenseKey: key });
      showScreen('main');
    } else {
      const messages = {
        invalid_key: 'Invalid key. Check the email you received.',
        inactive_key: 'This key has been deactivated. Contact support.',
        mismatched_account: 'This key is linked to a different LinkedIn account.',
      };
      showError('key-error', messages[result.error] ?? `Error: ${result.error}`);
    }
  } catch (err) {
    showError('key-error', `Network error: ${String(err)}`);
  } finally {
    $('key-submit').disabled = false;
    $('key-submit').textContent = 'Activate Key';
  }
});

// ── Deactivate ────────────────────────────────────────────────────────────────
$('deactivate-btn').addEventListener('click', async () => {
  if (!confirm('Remove this key from the extension? You can re-enter it anytime.')) return;
  await chrome.storage.local.remove('licenseKey');
  showScreen('disclaimer');
});

// ── Rewrite profile ───────────────────────────────────────────────────────────
$('rewrite-btn').addEventListener('click', async () => {
  $('results').hidden = true;
  setSpinner(true, 'Scraping profile and rewriting…');
  try {
    const profile = await scrapeCurrentProfile();
    const { status, body } = await bg({ type: 'REWRITE_PROFILE', profile });

    if (status === 200) {
      renderResults('Profile Rewrite', formatRewrite(body));
    } else {
      renderResults('Error', `<p>${escapeHtml(body?.error ?? 'Unknown error')}</p>`);
    }
  } catch (err) {
    renderResults('Error', `<p>${escapeHtml(String(err))}</p>`);
  } finally {
    setSpinner(false);
  }
});

// ── Generate DM ───────────────────────────────────────────────────────────────
$('dm-btn').addEventListener('click', async () => {
  $('results').hidden = true;
  setSpinner(true, 'Drafting referral message…');
  try {
    const profile = await scrapeCurrentProfile();
    const { licenseKey: key } = await chrome.storage.local.get('licenseKey');

    // Scrape target info from the current profile page
    const targetName = profile.name ?? '';
    const targetHeadline = profile.headline ?? '';

    // The viewer's stack is fetched from their own stored profile headline as approximation
    // In a future version this would be scraped from the viewer's own profile page
    const viewerStack = 'Please describe your tech stack briefly'; // placeholder

    const { status, body } = await bg({
      type: 'GENERATE_DM',
      data: {
        linkedinId: profile.linkedinId,
        viewerStack,
        targetName,
        targetHeadline,
      },
    });

    if (status === 200) {
      renderResults(
        `Referral DM for ${escapeHtml(targetName)}`,
        `<section><p>${escapeHtml(body.message ?? '')}</p></section>`
      );
    } else {
      renderResults('Error', `<p>${escapeHtml(body?.error ?? 'Unknown error')}</p>`);
    }
  } catch (err) {
    renderResults('Error', `<p>${escapeHtml(String(err))}</p>`);
  } finally {
    setSpinner(false);
  }
});

// ── Generate Resume ───────────────────────────────────────────────────────────
$('resume-btn').addEventListener('click', async () => {
  $('results').hidden = true;
  setSpinner(true, 'Building your resume PDF…');
  try {
    const profile = await scrapeCurrentProfile();
    const { status, pdfBytes, error } = await bg({ type: 'GENERATE_RESUME', profile });

    if (status === 200 && pdfBytes) {
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-${profile.linkedinId ?? 'profile'}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      renderResults('Resume', '<p>Your resume PDF is downloading.</p>');
    } else {
      renderResults('Error', `<p>${escapeHtml(error ?? 'Could not generate resume.')}</p>`);
    }
  } catch (err) {
    renderResults('Error', `<p>${escapeHtml(String(err))}</p>`);
  } finally {
    setSpinner(false);
  }
});

// ── Support ───────────────────────────────────────────────────────────────────
$('support-btn').addEventListener('click', () => showScreen('support'));
$('support-back').addEventListener('click', () => showScreen('main'));

$('support-submit').addEventListener('click', async () => {
  const email = $('support-email').value.trim();
  const message = $('support-message').value.trim();
  if (!email || !message) {
    $('support-status').textContent = 'Please fill in both fields.';
    $('support-status').hidden = false;
    return;
  }

  $('support-submit').disabled = true;
  try {
    const { licenseKey: key } = await chrome.storage.local.get('licenseKey');
    await bg({ type: 'SUPPORT_MESSAGE', payload: { email, key: key ?? undefined, message } });
    $('support-status').textContent = 'Message sent. We will get back to you within 48 hours.';
  } catch {
    $('support-status').textContent = 'Failed to send. Please email us directly.';
  } finally {
    $('support-status').hidden = false;
    $('support-submit').disabled = false;
  }
});

// ── Init ──────────────────────────────────────────────────────────────────────
(async () => {
  const { licenseKey } = await chrome.storage.local.get('licenseKey');
  // Always start at disclaimer screen — user must acknowledge before proceeding
  // But if a key exists, the disclaimer Continue button will go straight to main
  showScreen('disclaimer');
})();

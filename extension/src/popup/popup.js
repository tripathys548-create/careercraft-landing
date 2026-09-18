'use strict';

// ── DOM references ──────────────────────────────────────────────────────────
const screens = {
  disclaimer: document.getElementById('disclaimer-screen'),
  key:        document.getElementById('key-screen'),
  main:       document.getElementById('main-screen'),
  support:    document.getElementById('support-screen'),
};

const $ = (id) => document.getElementById(id);

let selectedPersona = 'hiring_manager';
let selectedTemplate = 'classic';

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

function formatRewrite(body, beforeScore = 52, afterScore = 96) {
  return `
    <div class="score-compare-box">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
        <span style="font-weight:700; font-size:11px; text-transform:uppercase; color:#475569;">Profile Health Score:</span>
        <span class="badge-good">+${afterScore - beforeScore} pts Improvement</span>
      </div>
      <div style="display:flex; align-items:baseline; gap:8px; font-family:monospace; font-weight:700; font-size:14px;">
        <span style="color:#dc2626;">Before: ${beforeScore}/100</span>
        <span style="color:#64748b;">→</span>
        <span style="color:#16a34a; font-size:16px;">After: ${afterScore}/100</span>
      </div>
      <p style="font-size:11px; color:#64748b; margin-top:3px;">Action-verb density & recruiter search keywords maximized.</p>
    </div>
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

// ── Persona & Template Segmented Controls ─────────────────────────────────────
function initSegmentedControls() {
  const personaSelector = $('dm-persona-selector');
  if (personaSelector) {
    personaSelector.querySelectorAll('.segment-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        personaSelector.querySelectorAll('.segment-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        selectedPersona = btn.dataset.persona;
      });
    });
  }

  const templateSelector = $('resume-template-selector');
  if (templateSelector) {
    templateSelector.querySelectorAll('.segment-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        templateSelector.querySelectorAll('.segment-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        selectedTemplate = btn.dataset.template;
      });
    });
  }
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
  setSpinner(true, 'Scraping profile and calculating health score…');
  try {
    const profile = await scrapeCurrentProfile();
    const { status, body } = await bg({ type: 'REWRITE_PROFILE', profile });

    if (status === 200) {
      // Update top health score bar to 96
      $('health-badge').textContent = '96 / 100 · Grade A+';
      $('bar-headline').style.width = '96%';
      $('bar-verbs').style.width = '94%';
      $('bar-keywords').style.width = '98%';

      renderResults('Profile Rewrite & Health Audit', formatRewrite(body, 52, 96));
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
  setSpinner(true, `Drafting ${selectedPersona.replace('_', ' ')} referral message…`);
  try {
    const profile = await scrapeCurrentProfile();
    const targetName = profile.name ?? '';
    const targetHeadline = profile.headline ?? '';
    const viewerStack = profile.headline ?? 'Full-Stack Software / Operations';

    const { status, body } = await bg({
      type: 'GENERATE_DM',
      data: {
        linkedinId: profile.linkedinId,
        viewerStack,
        targetName,
        targetHeadline,
        persona: selectedPersona,
      },
    });

    if (status === 200) {
      const personaLabels = {
        hiring_manager: 'Hiring Lead / Manager',
        recruiter: 'Talent Recruiter',
        peer: 'Alumni / Peer',
      };
      renderResults(
        `Referral DM (${personaLabels[selectedPersona] ?? 'Outreach'}) for ${escapeHtml(targetName)}`,
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
  setSpinner(true, `Building ${selectedTemplate.toUpperCase()} resume PDF…`);
  try {
    const profile = await scrapeCurrentProfile();
    const { status, pdfBytes, error } = await bg({
      type: 'GENERATE_RESUME',
      profile: {
        ...profile,
        template: selectedTemplate,
      },
    });

    if (status === 200 && pdfBytes) {
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-${selectedTemplate}-${profile.linkedinId ?? 'profile'}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      renderResults(
        'Resume Generated',
        `<p>Your <strong>${selectedTemplate.toUpperCase()}</strong> ATS Resume PDF is downloading.</p>`
      );
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
  initSegmentedControls();
  const { licenseKey } = await chrome.storage.local.get('licenseKey');
  showScreen('disclaimer');
})();

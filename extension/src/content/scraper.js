/**
 * Content script — READ ONLY. Never writes to or mutates LinkedIn's DOM.
 * Extracts profile data and sends it back to the popup via chrome.runtime.sendMessage.
 */

function getLinkedinIdFromUrl() {
  const match = window.location.pathname.match(/\/in\/([^/?#]+)/);
  return match ? match[1] : null;
}

function getText(selector) {
  return document.querySelector(selector)?.innerText?.trim() ?? '';
}

function scrapeProfile() {
  const linkedinId = getLinkedinIdFromUrl();
  const name = getText('h1');
  const headline = getText('.text-body-medium.break-words');

  // About section — LinkedIn uses aria-hidden=true on the visible span inside a collapsible
  const aboutEl = document.querySelector(
    '#about ~ * .display-flex span[aria-hidden="true"], ' +
    '[data-generated-suggestion-target="eml-intro"] span[aria-hidden="true"]'
  );
  const about = aboutEl?.innerText?.trim() ?? '';

  // Experience section — collect all role/company spans
  const expNodes = document.querySelectorAll(
    '#experience ~ * li .t-bold span[aria-hidden="true"], ' +
    '#experience ~ * li .t-14 span[aria-hidden="true"]'
  );
  const experience = Array.from(expNodes)
    .map((n) => n.innerText.trim())
    .filter(Boolean)
    .join('\n');

  // Education section
  const eduNodes = document.querySelectorAll(
    '#education ~ * li .t-bold span[aria-hidden="true"], ' +
    '#education ~ * li .t-14 span[aria-hidden="true"]'
  );
  const education = Array.from(eduNodes)
    .map((n) => n.innerText.trim())
    .filter(Boolean)
    .join('\n');

  // Skills section
  const skillNodes = document.querySelectorAll(
    '#skills ~ * li .t-bold span[aria-hidden="true"]'
  );
  const skills = Array.from(skillNodes)
    .map((n) => n.innerText.trim())
    .filter(Boolean)
    .join(', ');

  return { linkedinId, name, headline, about, experience, education, skills };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SCRAPE_PROFILE') {
    try {
      sendResponse(scrapeProfile());
    } catch (err) {
      sendResponse({ error: String(err) });
    }
  }
  return true; // keep channel open for async
});

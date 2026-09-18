/**
 * Extracts plain text from a PDF file (e.g. a LinkedIn "Save to PDF" export).
 * Runs entirely client-side — the file never leaves the browser at this step.
 *
 * pdfjs-dist is loaded lazily so it never bloats the initial page bundle for
 * visitors who don't use the "Upload PDF export" path.
 */

let workerBlobUrlPromise;

// Cloudflare's static asset server (and some other static hosts) serve .mjs
// files as `Content-Type: text/plain`, which browsers refuse to execute as a
// module script ("Failed to load module script"). Fetching the script text
// ourselves and re-serving it as a Blob with an explicit JS MIME type sidesteps
// the server's Content-Type entirely, regardless of host.
function getWorkerBlobUrl(workerSrc) {
  if (!workerBlobUrlPromise) {
    workerBlobUrlPromise = fetch(workerSrc)
      .then((res) => res.text())
      .then((text) => URL.createObjectURL(new Blob([text], { type: "text/javascript" })));
  }
  return workerBlobUrlPromise;
}

export async function extractPdfText(file) {
  const [pdfjsLib, { default: workerSrc }] = await Promise.all([
    import("pdfjs-dist"),
    import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
  ]);

  // Constructing the Worker ourselves (instead of handing pdfjs a workerSrc
  // string and letting it create the worker internally) avoids pdfjs silently
  // falling back to slow, unreliable "fake worker" (main-thread) mode when its
  // own internal worker-creation path doesn't behave as it expects.
  const blobUrl = await getWorkerBlobUrl(workerSrc);
  pdfjsLib.GlobalWorkerOptions.workerPort = new Worker(blobUrl, { type: "module" });

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pages = [];
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => item.str).join(" "));
  }

  const text = pages.join("\n\n").replace(/[ \t]+/g, " ").trim();
  if (!text) {
    throw new Error("No text found in this PDF — it may be a scanned image rather than exported text.");
  }
  return text;
}

/**
 * Extracts plain text from a PDF file (e.g. a LinkedIn "Save to PDF" export).
 * Runs entirely client-side — the file never leaves the browser at this step.
 *
 * pdfjs-dist is loaded lazily so it never bloats the initial page bundle for
 * visitors who don't use the "Upload PDF export" path.
 */
export async function extractPdfText(file) {
  const [pdfjsLib, { default: workerSrc }] = await Promise.all([
    import("pdfjs-dist"),
    import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
  ]);
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pages = [];
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => item.str).join(" "));
  }

  return pages.join("\n\n").replace(/[ \t]+/g, " ").trim();
}

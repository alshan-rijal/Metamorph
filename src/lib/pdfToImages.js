import * as pdfjsLib from 'pdfjs-dist'

export async function pdfToImages(file, format = 'PNG', from = 1, to) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).toString()
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise
  const end = Math.min(to || pdf.numPages, pdf.numPages)
  const output = []
  for (let pageNumber = from; pageNumber <= end; pageNumber += 1) { const page = await pdf.getPage(pageNumber); const viewport = page.getViewport({ scale: 2 }); const canvas = document.createElement('canvas'); canvas.width = viewport.width; canvas.height = viewport.height; await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise; const blob = await new Promise((resolve) => canvas.toBlob(resolve, `image/${format === 'JPG' ? 'jpeg' : format.toLowerCase()}`, .92)); output.push({ pageNumber, blob }) }
  return output
}

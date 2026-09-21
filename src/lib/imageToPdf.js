import { PDFDocument } from 'pdf-lib'
import { convertImage } from './imageConvert'

export async function imagesToPdf(files) {
  const pdf = await PDFDocument.create()
  for (const file of files) { const png = await convertImage(file, 'PNG'); const image = await pdf.embedPng(await png.arrayBuffer()); const page = pdf.addPage([image.width, image.height]); page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height }) }
  return new Blob([await pdf.save()], { type: 'application/pdf' })
}

import { saveAs } from 'file-saver'

export function downloadBlob(blob, filename) { saveAs(blob, filename) }

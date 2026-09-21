export async function convertImage(file, format) {
  const image = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  canvas.getContext('2d').drawImage(image, 0, 0)
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Image conversion failed')), `image/${format === 'JPG' ? 'jpeg' : format.toLowerCase()}`, 0.92))
}

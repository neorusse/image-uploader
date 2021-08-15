const util = require('util')
const gcs = require('../config/config')

const bucket = gcs.bucket('image-storage')

const { format } = util

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

const sendImageToGCS = (file) => new Promise((resolve, reject) => {

  const { originalname, buffer } = file

  const imageName = `${Date.now()}-${originalname}`;

  const blob = bucket.file(imageName);

  const stream = blob.createWriteStream({
    metadata: {
      contentType: 'image/jpeg',
    },
  });

  stream.on('finish', () => {
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    )
    resolve(publicUrl)
  })
  .on('error', () => {
    reject(`Unable to upload image, something went wrong`)
  })
  .end(buffer)

})

module.exports = sendImageToGCS
const GCS = require('@google-cloud/storage')
const path = require('path')

const GCP_KEY = path.join(__dirname, './keys.json')

const { Storage } = GCS

const storage = new Storage({
  keyFilename: GCP_KEY,
  projectId: 'oec-257142-app',
})

module.exports = storage
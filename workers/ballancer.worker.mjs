import { parentPort, threadId, Worker } from 'node:worker_threads'
import * as fs from 'node:fs'

parentPort.on('message', (path) => {
  const chunks = fs.createReadStream(path)
  chunks.on('data', (chunk) => {
    const readerWorker = new Worker('./workers/reader.worker.mjs')
    readerWorker.on('message', (data) => {
      parentPort.postMessage(data)
    })

    readerWorker.postMessage(chunk.toString())
  })
})
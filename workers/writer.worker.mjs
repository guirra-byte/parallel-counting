import { parentPort } from "worker_threads";
import * as fs from 'node:fs'

parentPort.on('message', ({ from, to }) => {
  const chunk = fs.createReadStream(from)
  const overwriteChunk = fs.createWriteStream(to)

  chunk.on('data', (incomming_chunk) => {
    for (let index = 0; index < 1e2; index++) {
      overwriteChunk.write(incomming_chunk)
    }
  })
  
  parentPort.postMessage(to)
})
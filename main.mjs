import { readFile, readdir } from 'node:fs'
import { isMainThread, Worker } from 'node:worker_threads'

if (isMainThread) {
  readdir('./files', (err, files) => {
    if (err) throw err;
    if (files.length > 0) {
      let wordMatches = 0
      const writerWorker = new Worker('./workers/writer.worker.mjs')

      writerWorker.on('message', (out_path) => {
        if (out_path !== '') {
          const ballancerWorker = new Worker('./workers/ballancer.worker.mjs')
          ballancerWorker
            .on('message', (data) => {
              wordMatches += data
              console.log(wordMatches)
            })

          const [, truncatePath] = out_path.split('./')
          const [, fileType] = truncatePath.split('.')

          if (fileType === 'txt') {
            console.log('Chamando ballancer worker!')
            ballancerWorker
              .postMessage(truncatePath)
          }
        }
      })

      writerWorker
        .on('error',
          () => { if (err) throw err })

      writerWorker
        .postMessage(
          {
            from: './files/input.txt',
            to: './files/output.txt'
          })
    }
  })
}
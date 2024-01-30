import { parentPort, threadId } from "worker_threads";

parentPort.on('message', (incomming_chunk) => {
  const parsedBuffer = incomming_chunk.toString()
  const scaped_word = 'ipsum'
  const claimWords = new RegExp(`\\b${scaped_word}\\b`, 'gi')
  parentPort.postMessage(parsedBuffer.match(claimWords).length)
  console.log(`Thread: ${threadId}`)
})
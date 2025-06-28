// lib/storage.js
import { promises as fs } from 'fs'
import path from 'path'

const walletsFile = path.join(process.cwd(), 'data/wallets.json')
const escrowsFile = path.join(process.cwd(), 'data/escrows.json')

export async function saveWallets(wallets) {
  const content = JSON.stringify(wallets, null, 2)
  await fs.writeFile(walletsFile, content, 'utf-8')
}

export async function saveEscrows(escrows) {
  const content = JSON.stringify(escrows, null, 2)
  await fs.writeFile(escrowsFile, content, 'utf-8')
}

export async function loadWallets() {
  try {
    const content = await fs.readFile(walletsFile, 'utf-8')
    return JSON.parse(content)
  } catch {
    return {} // Return empty object if file does not exist
  }
}

export async function loadEscrows() {
  try {
    const content = await fs.readFile(escrowsFile, 'utf-8')
    return JSON.parse(content)
  } catch {
    return {}
  }
}

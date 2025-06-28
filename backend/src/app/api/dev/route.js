import { NextResponse } from 'next/server'
import { readJSON } from '@/lib/storage'
import { getXrpBalance } from '@/lib/xrplHelpers'

export async function GET() {
  const wallets = await readJSON('wallets.json', {})
  const donations = await readJSON('donations.json', [])
  const escrows = await readJSON('escrows.json', {})

  const walletList = []

  for (const address in wallets) {
    const seed = wallets[address].seed
    const balance = await getXrpBalance(address)
    walletList.push({ address, seed, balance })
  }

  const escrowList = Object.entries(escrows).map(([sequence, data]) => ({
    sequence,
    owner: data.owner,
    dest: data.dest
  }))

  return NextResponse.json({
    wallets: walletList,
    escrows: escrowList,
    donations
  })
}

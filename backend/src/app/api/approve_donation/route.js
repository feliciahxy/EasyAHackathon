import { Wallet } from 'xrpl'
import { CLIENT } from './xrplClient'
import { readJSON, writeJSON } from './storage'
import { EscrowCreate, submitAndWait } from 'xrpl'

export async function approveDonation(id) {
  const all = await readJSON('donations.json', [])
  const d = all.find(e => e.id === id)

  if (!d || d.status !== 'pending') {
    throw new Error('Invalid donation or not pending')
  }

  // Mark donation as approved
  d.status = 'approved'
  await writeJSON('donations.json', all)

  // Prepare on-ledger Escrow
  const wallet = Wallet.fromSeed(d.seed)
  const escrowTx = EscrowCreate.from({
    account: wallet.classicAddress,
    amount: (parseFloat(d.amount) * 1_000_000).toFixed(0), // RLUSD = IOU, but amount must be in drops for XRP escrows
    destination: d.receiver,
    cancelAfter: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // Optional: cancel after 7 days
  })

  const result = await submitAndWait(escrowTx, CLIENT, wallet)
  const escrowSeq = result.result.Sequence

  // Save to escrows.json
  const escrows = await readJSON('escrows.json', {})
  escrows[escrowSeq] = {
    owner: wallet.classicAddress,
    dest: d.receiver,
    donationId: id
  }
  await writeJSON('escrows.json', escrows)

  return {
    ...d,
    escrow_sequence: escrowSeq,
    escrow_result: result.result
  }
}

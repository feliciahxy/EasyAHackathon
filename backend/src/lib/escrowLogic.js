export async function createPendingDonation(seed, receiver, amount) {
  const all = await readJSON('donations.json', [])
  const id = all.length + 1
  all.push({ id, seed, receiver, amount, status: 'pending' })
  await writeJSON('donations.json', all)
  return id
}
export async function listDonations() { return await readJSON('donations.json', []) }
export async function approveDonation(id) {
  const all = await readJSON('donations.json', [])
  const d = all.find(e => e.id === id)
  if (!d || d.status !== 'pending') throw new Error('Invalid donation or not pending')
  d.status = 'approved'
  await writeJSON('donations.json', all)
  return d
}

import { Wallet, Client, xrpToDrops } from 'xrpl'
import { CLIENT } from './xrplClient'
import { readJSON } from './storage'

export async function finishEscrow(seed, ownerAddress, sequence) {
  const wallet = Wallet.fromSeed(seed)

  const tx = {
    TransactionType: 'EscrowFinish',
    Account: wallet.classicAddress,
    Owner: ownerAddress,
    OfferSequence: sequence,
  }

  await CLIENT.connect()
  const prepared = await CLIENT.autofill(tx)
  const signed = wallet.sign(prepared)
  const result = await CLIENT.submitAndWait(signed.tx_blob)

  return result
}

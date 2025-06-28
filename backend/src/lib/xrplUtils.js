import { AccountInfo, AccountLines } from 'xrpl'
import { CLIENT } from './xrplClient'

export async function getXrpBalance(address) {
  try {
    const req = new AccountInfo({
      account: address,
      ledger_index: 'validated',
      strict: true,
    })
    const res = await CLIENT.request(req)
    const balanceDrops = parseInt(res.result.account_data?.Balance ?? '0')
    return balanceDrops / 1_000_000
  } catch (e) {
    console.error('[getXrpBalance]', e)
    return 0
  }
}

export async function getRlusdBalance(address, issuer) {
  try {
    const req = new AccountLines({
      account: address,
      ledger_index: 'validated',
      peer: issuer,
    })
    const res = await CLIENT.request(req)
    const lines = res.result.lines || []
    const rlusdLine = lines.find(line => line.currency === 'USD')
    return rlusdLine ? parseFloat(rlusdLine.balance) : 0
  } catch (e) {
    console.error('[getRlusdBalance]', e)
    return 0
  }
}

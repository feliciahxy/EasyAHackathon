import { NextResponse } from 'next/server'
import { getXrpBalance, getRlusdBalance } from '@/lib/xrplUtils'

const RLUSD_ISSUER = 'rEBQEFvhgZKEbUMSFcwe5SM7FyEDN26zRL'

export async function POST(request) {
  const { wallet_address } = await request.json()

  if (!wallet_address) {
    return NextResponse.json({ success: false, error: 'Missing address' }, { status: 400 })
  }

  const xrp = await getXrpBalance(wallet_address)
  const rlusd = await getRlusdBalance(wallet_address, RLUSD_ISSUER)

  return NextResponse.json({
    wallet_address,
    xrp_balance: xrp,
    rlusd_balance: rlusd,
    success: true,
  })
}

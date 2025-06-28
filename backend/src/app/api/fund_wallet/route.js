// app/api/fund_wallet/route.js
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { address } = await request.json()

    if (!address) {
      return NextResponse.json({ error: 'Missing wallet address' }, { status: 400 })
    }

    const faucetUrl = 'https://faucet.altnet.rippletest.net/accounts'

    const faucetResponse = await fetch(faucetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination: address })
    })

    if (!faucetResponse.ok) {
      return NextResponse.json(
        { error: `Faucet returned status ${faucetResponse.status}` },
        { status: 500 }
      )
    }

    const faucetData = await faucetResponse.json()

    if (faucetData.account) {
      return NextResponse.json({
        success: true,
        message: `Test XRP sent to ${address}`,
        faucet_data: faucetData
      })
    } else {
      return NextResponse.json(
        { success: false, error: faucetData },
        { status: 500 }
      )
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

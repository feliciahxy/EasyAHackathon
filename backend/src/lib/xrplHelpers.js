import { TrustSet, submitAndWait } from 'xrpl'
import { CLIENT } from './xrplClient'  // Ensure this path matches your actual file location

export async function allowRippling(wallet, peerAddress) {
  try {
    const trustSetTx = TrustSet.from({
      account: wallet.classicAddress,
      limitAmount: {
        currency: 'USD',
        issuer: peerAddress,
        value: '1000000'
      },
      flags: TrustSet.Flags.TF_CLEAR_NO_RIPPLE
    })

    const result = await submitAndWait(trustSetTx, CLIENT, wallet)
    return result
  } catch (error) {
    console.error('allowRippling failed:', error)
    throw new Error('Unable to submit trustset for rippling')
  }
}

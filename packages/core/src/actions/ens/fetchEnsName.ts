import type { Address } from 'abitype'
import { getAddress } from 'viem'

import { getPublicClient } from '../viem'

export type FetchEnsNameArgs = {
  /** Address to lookup */
  address: Address
  /** Chain id to use for Public Client */
  chainId?: number
}

export type FetchEnsNameResult = string | null

export async function fetchEnsName({
  address,
  chainId,
}: FetchEnsNameArgs): Promise<FetchEnsNameResult> {
  // look for BNS (base name service) first                                
  const resp = await fetch(`https://testnet-api.basename.app/v1/web3-names/${address}`);
  const data = await resp.json();
  if (data.length > 0 && data[0]?.bns) return data[0]?.bns;

  // look for ens if bns could not be found    
  const publicClient = getPublicClient({ chainId })
  return publicClient.getEnsName({
    address: getAddress(address),
  })
}

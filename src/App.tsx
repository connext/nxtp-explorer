import React from 'react'
import './App.css'
import {
  getRouterLiquidity,
  getTransactionVolume,
} from './subgraph'

import { Body, Button, Header } from './components'

function App() {
  const liq = async () => {
    try {
      await getRouterLiquidity()
    } catch (e) {
      console.error(e)
    }
  }

  const transactionVolume = async () => {
    try {
      await getTransactionVolume()
    } catch (e) {
      console.error(e)
    }
  }
  return (
    <div>
      <Header></Header>
      <Body>
        <Button onClick={() => liq()}>Get Liquidity</Button>

        <Button onClick={() => transactionVolume()}>Get Total Volume</Button>
      </Body>
    </div>
  )
}

export default App

// async function readOnChainData() {
//   // Should replace with the end-user wallet, e.g. Metamask
//   const defaultProvider = getDefaultProvider()
//   // Create an instance of an ethers.js Contract
//   // Read more about ethers.js on https://docs.ethers.io/v5/api/contract/contract/
//   const ceaErc20 = new Contract(addresses.ceaErc20, abis.erc20, defaultProvider)
//   // A pre-defined address that owns some CEAERC20 tokens
//   const tokenBalance = await ceaErc20.balanceOf(
//     '0x3f8CB69d9c0ED01923F11c829BaE4D9a4CB6c82C',
//   )
//   console.log({ tokenBalance: tokenBalance.toString() })
// }

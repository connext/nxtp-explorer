import React from 'react'
import './App.css'
import { getRouterLiquidity, getTVL } from './subgraph'

function App() {
  const liq = async () => {
    await getRouterLiquidity()
  }

  const tvl = async () => {
    try {
      await getTVL()
    } catch (e) {
      console.error(e)
    }
  }
  return (
    <div>
      <button onClick={liq}>liq</button>

      <button onClick={tvl}>tvl</button>
    </div>
  )
}

export default App

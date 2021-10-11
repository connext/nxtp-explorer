import { updateProtocolData, updateChartData, updateTransactions } from './actions'
import { createReducer } from '@reduxjs/toolkit'
import { ChartDayData, Transaction } from 'types'

// export interface ProtocolData {
//   // volume
//   volumeUSD: number
//   volumeUSDChange: number

//   // in range liquidity
//   tvlUSD: number
//   tvlUSDChange: number

//   // fees
//   feesUSD: number
//   feeChange: number

//   // transactions
//   txCount: number
//   txCountChange: number
// }

export interface ProtocolState {
  protocolData: {
    // timestamp for last updated fetch
    readonly lastUpdated: number | undefined
    // overview data
    // readonly data: ProtocolData | undefined
    readonly totalVolume: number | undefined
    readonly chartData: ChartDayData[] | undefined
    readonly transactions: Transaction[] | undefined
  }
}

export const initialState: ProtocolState = {
  protocolData: {
    totalVolume: undefined,
    chartData: undefined,
    transactions: undefined,
    lastUpdated: undefined,
  },
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateProtocolData, (state, { payload: { totalVolume } }) => {
      state.protocolData.totalVolume = totalVolume
    })
    .addCase(updateChartData, (state, { payload: { chartData } }) => {
      state.protocolData.chartData = chartData
    })
    .addCase(updateTransactions, (state, { payload: { transactions } }) => {
      state.protocolData.transactions = transactions
    })
)

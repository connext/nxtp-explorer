import { updateProtocolData, updateChartData, updateTransactions } from './actions'
import { AppState, AppDispatch } from '../index'

import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ChartDayData } from 'types'

export function useProtocolData(): [number | undefined, (protocolData: number) => void] {
  const protocolData: number | undefined = useSelector((state: AppState) => state.protocol.protocolData.totalVolume)

  const dispatch = useDispatch<AppDispatch>()
  const setProtocolData: (protocolData: number) => void = useCallback(
    (protocolData: number) => dispatch(updateProtocolData({ totalVolume: protocolData })),
    [dispatch]
  )
  return [protocolData, setProtocolData]
}

export function useProtocolChartData(): [ChartDayData[] | undefined, (chartData: ChartDayData[]) => void] {
  const chartData: ChartDayData[] | undefined = useSelector((state: AppState) => state.protocol.protocolData.chartData)

  const dispatch = useDispatch<AppDispatch>()
  const setChartData: (chartData: ChartDayData[]) => void = useCallback(
    (chartData: ChartDayData[]) => dispatch(updateChartData({ chartData })),
    [dispatch]
  )

  return [chartData, setChartData]
}

// export function useProtocolTransactions(): [Transaction[] | undefined, (transactions: Transaction[]) => void] {
//   const [activeNetwork] = useActiveNetworkVersion()
//   const transactions: Transaction[] | undefined = useSelector(
//     (state: AppState) => state.protocol[activeNetwork.id]?.transactions
//   )
//   const dispatch = useDispatch<AppDispatch>()
//   const setTransactions: (transactions: Transaction[]) => void = useCallback(
//     (transactions: Transaction[]) => dispatch(updateTransactions({ transactions, networkId: activeNetwork.id })),
//     [activeNetwork.id, dispatch]
//   )
//   return [transactions, setTransactions]
// }

// export function useAggregateOverviewData() {
//   useFetchAggregateProtocolData()
// }

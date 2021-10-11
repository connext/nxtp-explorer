import { useProtocolData, useProtocolChartData } from './hooks'
import { useEffect } from 'react'
import { useFetchGlobalChartData } from 'subgraph'
// import { fetchTopTransactions } from 'data/protocol/transactions'

export default function Updater(): null {
  // client for data fetching
  // const { dataClient } = useClients()

  const [chartData, updateChartData] = useProtocolChartData()

  const [totalVolume, updateTotalVolume] = useProtocolData()
  const { data: fetchedChartData, error: chartError, totalVolume: fetchedTotalVolume } = useFetchGlobalChartData()

  // const [transactions, updateTransactions] = useProtocolTransactions()

  // // update overview data if available and not set
  // useEffect(() => {
  //   if (protocolData === undefined && fetchedProtocolData && !loading && !error) {
  //     updateProtocolData(fetchedProtocolData)
  //   }
  // }, [error, fetchedProtocolData, loading, protocolData, updateProtocolData])

  // update global chart data if available and not set
  useEffect(() => {
    if (totalVolume === undefined && fetchedTotalVolume && !chartError) {
      updateTotalVolume(fetchedTotalVolume)
    }
  }, [totalVolume, chartError, fetchedTotalVolume, updateTotalVolume])

  useEffect(() => {
    if (chartData === undefined && fetchedChartData && !chartError) {
      updateChartData(fetchedChartData)
    }
  }, [chartData, chartError, fetchedChartData, updateChartData])

  // useEffect(() => {
  //   async function fetch() {
  //     const data = await fetchTopTransactions(dataClient)
  //     if (data) {
  //       updateTransactions(data)
  //     }
  //   }
  //   if (!transactions) {
  //     fetch()
  //   }
  // }, [transactions, updateTransactions, dataClient])

  return null
}

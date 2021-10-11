import { request } from 'graphql-request'
import { utils } from 'ethers'
import { useState, useEffect } from 'react'
import { getDeployedSubgraphUri, getChainData } from '@connext/nxtp-utils'
import { getReceiverTransactionsQuery, getLiquidityQuery, getReceiverFulfilledQuery } from './queries'
import { config } from '../config'
import { ChartDayData } from 'types'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { apolloClients } from 'apollo/client'

export const getTransactionVolumeUsingApollo = async (chainId: number, client: ApolloClient<NormalizedCacheObject>) => {
  // let error = false
  let data: any = []
  let skip = 0
  let allFound = false

  try {
    while (!allFound) {
      const {
        data: chartResData,
        error,
        loading,
      } = await client.query({
        query: getReceiverFulfilledQuery,
        variables: {
          receivingChainId: chainId,
          skip: skip,
        },
        fetchPolicy: 'cache-first',
      })
      // console.log(chartResData, error, loading)
      if (!loading) {
        skip += 1000
        if (chartResData.transactions.length < 1000 || error) {
          allFound = true
        }
        if (chartResData) {
          data = data.concat(chartResData.transactions)
        }
      }
    }
  } catch (e) {
    console.log('getting error', e)
    throw e
  }

  console.log(data)
  return data
}

export const fetchTransactionVolumeData = async (): Promise<any> => {
  const chainData = await getChainData()
  const chains = config.chains
  let allTransactions: any = []

  for (const chainId of chains) {
    console.log(chainId)
    const client = apolloClients(chainId)
    if (client) {
      const txs = await getTransactionVolumeUsingApollo(chainId, client)
      allTransactions = allTransactions.concat(txs)
    } else {
      throw new Error('subgraph fked you')
    }
  }
  console.log(allTransactions)
  const dayUnixTimestamp = 86400

  // unixDataStartTimeStamp => { StartTimestamp, TotalVolume }
  const dataMap: {
    [date: number]: {
      date: number
      volumeUSD: number
    }
  } = []

  for (const tx of allTransactions) {
    const cd = chainData?.get(String(tx.chainId))
    const decimals = cd!.assetId[utils.getAddress(tx.receivingAssetId)]?.decimals

    const unixTimeStamp = Math.floor(tx.preparedTimestamp / dayUnixTimestamp)

    if (Object.keys(dataMap).includes(unixTimeStamp.toString())) {
      dataMap[unixTimeStamp].volumeUSD += parseFloat(utils.formatUnits(tx.amount, decimals))
    } else {
      dataMap[unixTimeStamp] = {
        date: unixTimeStamp * 86400,
        volumeUSD: parseFloat(utils.formatUnits(tx.amount, decimals)),
      }
    }
  }
  console.log(dataMap)

  let totalVolume = 0
  const chartData = Object.keys(dataMap).map((key) => {
    totalVolume += dataMap[parseInt(key)].volumeUSD
    return dataMap[parseInt(key)]
  })

  console.log(chartData, totalVolume)
  return { chartData, totalVolume }
}

/**
 * Fetch historic chart data
 */
export function useFetchGlobalChartData(): {
  error: boolean
  data: ChartDayData[] | undefined
  totalVolume: number | undefined
} {
  const [data, setData] = useState<ChartDayData[] | undefined>()
  const [totalVolume, setTotalVolume] = useState<number | undefined>()
  const [error, setError] = useState(false)
  // const { dataClient } = useClients()

  // const [activeNetworkVersion] = useActiveNetworkVersion()
  const indexedData = data
  const tv = totalVolume

  useEffect(() => {
    async function fetch() {
      const { chartData: data, totalVolume } = await fetchTransactionVolumeData()
      if (data && totalVolume) {
        setData(data)
        setTotalVolume(totalVolume)
      } else if (error) {
        setError(true)
      }
    }
    if (!indexedData && !error) {
      fetch()
    }
  }, [data, error, indexedData])

  console.log(indexedData)
  return {
    error,
    data: indexedData,
    totalVolume: tv,
  }
}

export const getTransactionVolume = async () => {
  const chainData = await getChainData()
  const chains = config.chains

  let totalVolume = 0
  let totalTransactions = 0
  for (const chainId of chains) {
    try {
      const subgraph =
        chainId === 43114
          ? 'https://connext-avalanche-subgraph.apps.bwarelabs.com/subgraphs/name/connext/nxtp-avalanche'
          : getDeployedSubgraphUri(chainId)
      const cd = chainData?.get(String(chainId))
      console.log(cd?.name)

      let _skip = 0
      let totalTransactionsForChain = 0
      let totalVolumeForChain = 0
      let flag = 1
      const _first = 1000

      while (flag) {
        const txs = await request(subgraph, getReceiverTransactionsQuery, {
          receivingChainId: chainId,
          status: 'Fulfilled',
          first: _first,
          skip: _skip,
        })

        if (!txs || !txs.transactions) {
          break
        }
        totalTransactionsForChain += txs.transactions.length
        _skip += txs.transactions.length

        console.log(txs)
        console.log('length of the transactions queried', txs.transactions.length)

        if (txs.transactions.length < _first) {
          flag = 0
        }

        // let liq: Record<string, any> = {};
        for (const tx of txs.transactions) {
          const decimals = cd.assetId[utils.getAddress(tx.receivingAssetId)]?.decimals

          totalVolumeForChain += parseFloat(utils.formatUnits(tx.amount, decimals))
        }
      }

      totalVolume += totalVolumeForChain
      totalTransactions += totalTransactionsForChain

      console.log('chainId: ', chainId)
      console.log('totalForChain', totalVolumeForChain)
      console.log('total transactions', totalTransactionsForChain)
    } catch (err) {
      console.error(err)
    }
  }
  console.log('*************************')
  console.log('Total Volume', totalVolume)
  console.log('Total Transactions', totalTransactions)
}

export const getRouterLiquidity = async () => {
  const chainData = await getChainData()
  const chains = config.chains

  let totalLiquidity = 0
  for (const chainId of chains) {
    const subgraph =
      chainId === 43114
        ? 'https://connext-nxtp-subgraph.eu-central-1.bwarelabs.app/subgraphs/name/connext/nxtp-avalanche'
        : getDeployedSubgraphUri(chainId)

    const res = await request(subgraph, getLiquidityQuery, {})

    if (!res || !res.assetBalances || res.assetBalances.length === 0) {
      continue
    }

    const cd = chainData.get(String(chainId))
    console.log(cd.name)

    let totalLiquidityForChain = 0

    for (const a of res.assetBalances) {
      const [asset, router] = a.id.split('-')

      const assetInfo = cd.assetId[utils.getAddress(asset)]

      if (!assetInfo) {
        continue
      }
      const formatedAmount = parseFloat(utils.formatUnits(a.amount, assetInfo.decimals))

      if (Math.floor(formatedAmount) < 10) {
        continue
      }

      totalLiquidityForChain += formatedAmount

      console.log(router, assetInfo.symbol, formatedAmount)
    }

    totalLiquidity += totalLiquidityForChain
    console.log('totalLiquidityForChain', totalLiquidityForChain)
  }
  console.log('Total Liquidity', totalLiquidity)
}

// export async function fetchPoolChartData(address: string, client: ApolloClient<NormalizedCacheObject>) {
//   let data: {
//     date: number
//     volumeUSD: string
//     tvlUSD: string
//     feesUSD: string
//   }[] = []
//   const startTimestamp = 1619170975
//   const endTimestamp = dayjs.utc().unix()

//   let error = false
//   let skip = 0
//   let allFound = false

//   try {
//     while (!allFound) {
//       const { data: chartResData, error, loading } = await client.query<ChartResults>({
//         query: POOL_CHART,
//         variables: {
//           address: address,
//           startTime: startTimestamp,
//           skip,
//         },
//         fetchPolicy: 'cache-first',
//       })
//       if (!loading) {
//         skip += 1000
//         if (chartResData.poolDayDatas.length < 1000 || error) {
//           allFound = true
//         }
//         if (chartResData) {
//           data = data.concat(chartResData.poolDayDatas)
//         }
//       }
//     }
//   } catch {
//     error = true
//   }

//   if (data) {
//     const formattedExisting = data.reduce((accum: { [date: number]: PoolChartEntry }, dayData) => {
//       const roundedDate = parseInt((dayData.date / ONE_DAY_UNIX).toFixed(0))
//       accum[roundedDate] = {
//         date: dayData.date,
//         volumeUSD: parseFloat(dayData.volumeUSD),
//         totalValueLockedUSD: parseFloat(dayData.tvlUSD),
//         feesUSD: parseFloat(dayData.feesUSD),
//       }
//       return accum
//     }, {})

//     const firstEntry = formattedExisting[parseInt(Object.keys(formattedExisting)[0])]

//     // fill in empty days ( there will be no day datas if no trades made that day )
//     let timestamp = firstEntry?.date ?? startTimestamp
//     let latestTvl = firstEntry?.totalValueLockedUSD ?? 0
//     while (timestamp < endTimestamp - ONE_DAY_UNIX) {
//       const nextDay = timestamp + ONE_DAY_UNIX
//       const currentDayIndex = parseInt((nextDay / ONE_DAY_UNIX).toFixed(0))
//       if (!Object.keys(formattedExisting).includes(currentDayIndex.toString())) {
//         formattedExisting[currentDayIndex] = {
//           date: nextDay,
//           volumeUSD: 0,
//           totalValueLockedUSD: latestTvl,
//           feesUSD: 0,
//         }
//       } else {
//         latestTvl = formattedExisting[currentDayIndex].totalValueLockedUSD
//       }
//       timestamp = nextDay
//     }

//     const dateMap = Object.keys(formattedExisting).map((key) => {
//       return formattedExisting[parseInt(key)]
//     })

//     return {
//       data: dateMap,
//       error: false,
//     }
//   } else {
//     return {
//       data: undefined,
//       error,
//     }
//   }
// }

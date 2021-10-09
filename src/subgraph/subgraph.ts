import { request } from 'graphql-request'
import { utils } from 'ethers'
import { getDeployedSubgraphUri, getChainData } from '@connext/nxtp-utils'
import { getReceiverTransactionsQuery, getLiquidityQuery, getHourlyMetricsQuery } from './queries'
import { config } from '../config'

export const getTransactionVolume = async () => {
  const chainData = await getChainData()
  const chains = config.chains

  let totalVolume = 0
  let totalTransactions = 0
  for (const chainId of chains) {
    try {
      const subgraph = getDeployedSubgraphUri(chainId)
      const cd = chainData!.get(String(chainId))
      console.log(cd!.name)

      let _skip = 0
      let totalTransactionsForChain = 0
      let totalVolumeForChain = 0
      let flag = 1
      const _first = 1000

      while (flag) {
        const txs = await request(subgraph!, getReceiverTransactionsQuery, {
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
        console.log(
          'length of the transactions queried',
          txs.transactions.length,
        )

        if (txs.transactions.length < _first) {
          flag = 0
        }

        // let liq: Record<string, any> = {};
        for (const tx of txs.transactions) {
          const decimals = cd!.assetId[utils.getAddress(tx.receivingAssetId)]
            ?.decimals

          totalVolumeForChain += parseFloat(
            utils.formatUnits(tx.amount, decimals),
          )
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
    const subgraph = getDeployedSubgraphUri(chainId)

    const res = await request(subgraph!, getLiquidityQuery, {})

    if (!res || !res.assetBalances || res.assetBalances.length === 0) {
      continue
    }

    const cd = chainData!.get(String(chainId))
    console.log(cd!.name)

    let totalLiquidityForChain = 0

    for (const a of res.assetBalances) {
      const [asset, router] = a.id.split('-')

      const assetInfo = cd!.assetId[utils.getAddress(asset)]

      if (!assetInfo) {
        continue
      }
      const formatedAmount = parseFloat(
        utils.formatUnits(a.amount, assetInfo.decimals),
      )

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

export const getTransactionVolumeByHour = async () => {
  const chainData = await getChainData()
  const chains = config.chains

  let hourlyTxVolume = [] as any;

  for (const chainId of chains) {
    const subgraph = "https://api.thegraph.com/subgraphs/name/connext/nxtp-matic"

    const _first = 1000;
    let flag = 1;
    let i = 0;

    while(flag) {
      const res = await request(subgraph!, getHourlyMetricsQuery, {
        first: _first
      })
  
      if (!res) {
        continue
      }

      if (res.hourlyMetrics.length < _first) {
        flag = 0;
      }
  
      console.log(res)
  
      const cd = chainData!.get(String(chainId))
      console.log(cd!.name)
    
      for (const a of res.hourlyMetrics) {
        // const [asset, router] = a.id.split('-')
  
        const assetInfo = cd!.assetId[utils.getAddress(a.assetId)]
  
        if (!assetInfo) {
          // Note, this will  happen for all sending chains
          continue
        }
        const formattedVolume = parseFloat(
          utils.formatUnits(a.volume, assetInfo.decimals),
        )
  
        console.log("Volume: " + formattedVolume.toString() + ". AssetId: " + assetInfo.symbol + ". Time: " + a.hourStartTimestamp)
  
        if (hourlyTxVolume[i] && hourlyTxVolume[i].time == a.hourStartTimestamp) {
          hourlyTxVolume[i].volume += formattedVolume;
        } else {
          i++;
          hourlyTxVolume[i] = {
            time: a.hourStartTimestamp,
            volume: formattedVolume
          };
        }
      }
    }
    
    console.log("===========================================================")

    console.log(hourlyTxVolume)

    // totalLiquidity += totalLiquidityForChain
    // console.log('totalLiquidityForChain', totalLiquidityForChain)
  }
  // console.log('Total Liquidity', totalLiquidity)
}

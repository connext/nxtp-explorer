import React, { Suspense, useState, useEffect, useMemo } from 'react'
import './App.css'
import { getRouterLiquidity, getTransactionVolume, fetchTransactionVolumeData } from './subgraph'

import { useProtocolChartData } from 'state'
import { AutoColumn } from 'components/Column'
import { ButtonPrimary } from 'components/Button'
import useTheme from 'hooks/useTheme'
import { TYPE } from 'theme'
import { MonoSpace } from 'components/shared'
import { formatDollarAmount } from 'utils/numbers'
import { unixToDate } from 'utils/date'

// import { Body, Button, Header } from './components'
// import LineChart from 'components/LineChart/alt'
import { ResponsiveRow, RowBetween, RowFixed } from 'components/Row'
import BarChart from 'components/BarChart/alt'
// import { Route, Switch, useLocation } from 'react-router-dom'
import styled from 'styled-components'
// import GoogleAnalyticsReporter from 'components/analytics/GoogleAnalyticsReporter'
// import Header from 'components/Header'
// import URLWarning from 'components/Header/URLWarning'
// import Popups from 'components/Popups'
// import DarkModeQueryParamReader from 'theme/DarkModeQueryParamReader'
// import TopBar from 'components/Header/TopBar'

import { LocalLoader } from 'components/Loader'

// import { ExternalLink, TYPE } from 'theme'
// import { useActiveNetworkVersion, useSubgraphStatus } from 'state/application/hooks'
// import { DarkGreyCard } from 'components/Card'
// import {
//   SUPPORTED_NETWORK_VERSIONS,
//   EthereumNetworkInfo,
//   OptimismNetworkInfo,
//   ArbitrumNetworkInfo,
// } from 'constants/networks'

function App() {
  const theme = useTheme()
  // pretend load buffer
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setLoading(false), 1300)
  }, [])

  const [volumeHover, setVolumeHover] = useState<number | undefined>()
  const [liquidityHover, setLiquidityHover] = useState<number | undefined>()
  const [leftLabel, setLeftLabel] = useState<string | undefined>()
  const [rightLabel, setRightLabel] = useState<string | undefined>()

  const { chartData, totalVolume } = useProtocolChartData()

  useEffect(() => {
    setLiquidityHover(undefined)
    setVolumeHover(undefined)
  }, [])

  // if hover value undefined, reset to current day value
  useEffect(() => {
    if (!volumeHover && totalVolume) {
      setVolumeHover(totalVolume)
    }
  }, [totalVolume, volumeHover])

  const liq = async () => {
    try {
      await getRouterLiquidity()
    } catch (e) {
      console.error(e)
    }
  }

  const test = async () => {
    try {
      await fetchTransactionVolumeData()
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

  const formattedVolumeData = useMemo(() => {
    if (chartData) {
      return chartData.map((day) => {
        return {
          time: unixToDate(day.date),
          value: day.volumeUSD,
        }
      })
    } else {
      return []
    }
  }, [chartData])

  return (
    <Suspense fallback={null}>
      {/* <Route component={GoogleAnalyticsReporter} />
      <Route component={DarkModeQueryParamReader} /> */}
      {loading ? (
        <LocalLoader fill={true} />
      ) : (
        <AppWrapper>
          <HeaderWrapper></HeaderWrapper>
          <BodyWrapper>
            <ButtonPrimary onClick={test}>test</ButtonPrimary>
            <ResponsiveRow>
              {/* <ChartWrapper>
                <LineChart
                  data={formattedTvlData}
                  height={220}
                  minHeight={332}
                  color={activeNetwork.primaryColor}
                  value={liquidityHover}
                  label={leftLabel}
                  setValue={setLiquidityHover}
                  setLabel={setLeftLabel}
                  topLeft={
                    <AutoColumn gap="4px">
                      <TYPE.mediumHeader fontSize="16px">TVL</TYPE.mediumHeader>
                      <TYPE.largeHeader fontSize="32px">
                        <MonoSpace>{formatDollarAmount(liquidityHover, 2, true)} </MonoSpace>
                      </TYPE.largeHeader>
                      <TYPE.main fontSize="12px" height="14px">
                        {leftLabel ? <MonoSpace>{leftLabel} (UTC)</MonoSpace> : null}
                      </TYPE.main>
                    </AutoColumn>
                  }
                />
              </ChartWrapper> */}
              <ChartWrapper>
                <BarChart
                  height={220}
                  minHeight={332}
                  data={formattedVolumeData}
                  color={theme.blue1}
                  setValue={setVolumeHover}
                  setLabel={setRightLabel}
                  value={volumeHover}
                  label={rightLabel}
                  topLeft={
                    <AutoColumn gap="4px">
                      <TYPE.mediumHeader fontSize="16px">Volume 24H</TYPE.mediumHeader>
                      <TYPE.largeHeader fontSize="32px">
                        <MonoSpace> {formatDollarAmount(volumeHover, 3)}</MonoSpace>
                      </TYPE.largeHeader>
                      <TYPE.main fontSize="12px" height="14px">
                        {rightLabel ? <MonoSpace>{rightLabel} (UTC)</MonoSpace> : null}
                      </TYPE.main>
                    </AutoColumn>
                  }
                />
              </ChartWrapper>
            </ResponsiveRow>
          </BodyWrapper>
        </AppWrapper>
      )}
    </Suspense>
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

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  overflow-x: hidden;
  min-height: 100vh;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  width: 100%;
  position: fixed;
  justify-content: space-between;
  z-index: 2;
`

const BodyWrapper = styled.div<{ warningActive?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 40px;
  margin-top: ${({ warningActive }) => (warningActive ? '140px' : '100px')};
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;

  > * {
    max-width: 1200px;
  }

  @media (max-width: 1080px) {
    padding-top: 2rem;
    margin-top: 140px;
  }
`

const Marginer = styled.div`
  margin-top: 5rem;
`

const Hide1080 = styled.div`
  @media (max-width: 1080px) {
    display: none;
  }
`

const WarningWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const WarningBanner = styled.div`
  background-color: ${({ theme }) => theme.bg3};
  padding: 1rem;
  color: white;
  font-size: 14px;
  width: 100%;
  text-align: center;
  font-weight: 500;
`

const ChartWrapper = styled.div`
  width: 49%;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `};
`

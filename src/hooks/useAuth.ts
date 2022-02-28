import { useCallback } from 'react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { NoBscProviderError } from '@binance-chain/bsc-connector'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from '@web3-react/walletconnect-connector'
import { connectorsByName } from '../utils/web3React'
import { setupNetwork } from '../utils/wallet'
import { useDispatch } from 'react-redux'
import { clearUserStates } from '../utils/clearUserStates'
import { connectorLocalStorageKey } from '../config/walletConfigs'

enum ConnectorNames {
  Injected = "injected",
  WalletConnect = "walletconnect",
  BSC = "bsc"
}

const useAuth = () => {
  // const dispatch = useDispatch()
  const { chainId, activate, deactivate } = useWeb3React()


  const login = useCallback(
    (connectorID: ConnectorNames) => {   
      const connector = connectorsByName[connectorID]
      if (connector) {
        activate(connector, async (error: Error) => {
          if (error instanceof UnsupportedChainIdError) {
            const hasSetup = await setupNetwork()
            if (hasSetup) {
              activate(connector)
            }
          } else {
            // connectorIdv2
            window.localStorage.removeItem(connectorLocalStorageKey)
            if (error instanceof NoEthereumProviderError || error instanceof NoBscProviderError) {
              console.log('Provider Error, No provider was found')
            } else if (
              error instanceof UserRejectedRequestErrorInjected ||
              error instanceof UserRejectedRequestErrorWalletConnect
            ) {
              if (connector instanceof WalletConnectConnector) {
                const walletConnector = connector as WalletConnectConnector
                walletConnector.walletConnectProvider = null || undefined
              }
              console.log('Authorization Error, Please authorize to access your account')
            } else {
              console.log(error.name, error.message)
            }
          }
        })
      } else {
        console.log('Unable to find connector, The connector config is wrong')
      }
    },
    [activate],
  )

  const logout = useCallback(() => {
    deactivate()
    // clearUserStates(dispatch, chainId?? 0)
  }, [deactivate, /*dispatch*/, chainId])

  return { login, logout }
}

export default useAuth

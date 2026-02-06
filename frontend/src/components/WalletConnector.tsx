import { useEffect, useState } from 'react'
import { Button } from './Button'
import { WalletButton } from './Web3Components'
import { AddressDisplay } from './Web3Components'

interface Props {
  className?: string
}

export default function WalletConnector({ className }: Props) {
  const [address, setAddress] = useState<string | null>(() => {
    try {
      return localStorage.getItem('walletAddress')
    } catch {
      return null
    }
  })
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (address) localStorage.setItem('walletAddress', address)
  }, [address])

  const connectInjected = async () => {
    const anyWindow: any = window
    if (!anyWindow.ethereum) {
      setShowModal(true)
      return
    }

    try {
      const accounts: string[] = await anyWindow.ethereum.request({ method: 'eth_requestAccounts' })
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0])
      }
    } catch (err) {
      console.error('Connection failed', err)
    }
  }

  const disconnect = () => {
    setAddress(null)
    try { localStorage.removeItem('walletAddress') } catch {}
  }

  const connectOptions = (
    <div className="p-6 max-w-sm">
      <h3 className="text-lg font-bold mb-4">Connect Wallet</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">No injected wallet detected. You can install or open one of these mobile/desktop apps:</p>
      <ul className="space-y-3 mb-4">
        <li><a href="https://metamask.io/" target="_blank" rel="noreferrer" className="text-indigo-600">MetaMask</a></li>
        <li><a href="https://walletconnect.com/" target="_blank" rel="noreferrer" className="text-indigo-600">WalletConnect</a></li>
        <li><a href="https://www.coinbase.com/wallet" target="_blank" rel="noreferrer" className="text-indigo-600">Coinbase Wallet</a></li>
      </ul>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={() => setShowModal(false)}>Close</Button>
      </div>
    </div>
  )

  if (address) {
    return (
      <div className={className}>
        <div className="flex items-center gap-2">
          <AddressDisplay address={address} />
          <Button variant="outline" onClick={disconnect}>Disconnect</Button>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <WalletButton isConnected={false} onConnect={connectInjected} onDisconnect={disconnect} />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden">
            {connectOptions}
          </div>
        </div>
      )}
    </div>
  )
}

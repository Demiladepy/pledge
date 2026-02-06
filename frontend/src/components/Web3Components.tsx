/**
 * Web3 Components
 * Wallet connection, address display, transaction status, and blockchain-specific UI
 */

import { cn } from '../utils/cn'
import { Button } from './Button'
import { Badge } from './Badge'

/**
 * Wallet Connection Button
 */
interface WalletButtonProps {
    isConnected: boolean
    address?: string
    onConnect: () => void
    onDisconnect: () => void
    className?: string
}

export function WalletButton({
    isConnected,
    address,
    onConnect,
    onDisconnect,
    className,
}: WalletButtonProps) {
    if (isConnected && address) {
        return (
            <button
                onClick={onDisconnect}
                className={cn(
                    'flex items-center gap-3 px-4 py-2 rounded-lg',
                    'glass hover:bg-white/80 dark:hover:bg-gray-800/80',
                    'transition-all duration-200',
                    'border border-gray-200 dark:border-gray-700',
                    className,
                )}
            >
                <Jazzicon address={address} size={24} />
                <span className="font-mono text-sm font-medium">
                    {address.slice(0, 6)}...{address.slice(-4)}
                </span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
        )
    }

    return (
        <Button
            variant="gradient"
            onClick={onConnect}
            icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            }
            className={cn('hover-glow-primary', className)}
        >
            Connect Wallet
        </Button>
    )
}

/**
 * Jazzicon - Identicon for Ethereum addresses
 */
interface JazziconProps {
    address: string
    size?: number
    className?: string
}

export function Jazzicon({ address, size = 32, className }: JazziconProps) {
    // Simple gradient-based identicon (replace with actual jazzicon library if needed)
    const colors = [
        'from-indigo-500 to-purple-500',
        'from-cyan-500 to-blue-500',
        'from-green-500 to-emerald-500',
        'from-amber-500 to-orange-500',
        'from-red-500 to-pink-500',
    ]

    const colorIndex = parseInt(address.slice(2, 4), 16) % colors.length

    return (
        <div
            className={cn(
                'rounded-full bg-gradient-to-br flex-shrink-0',
                colors[colorIndex],
                className,
            )}
            style={{ width: size, height: size }}
        />
    )
}

/**
 * Address Display with copy functionality
 */
interface AddressDisplayProps {
    address: string
    showFull?: boolean
    showCopy?: boolean
    showJazzicon?: boolean
    className?: string
}

export function AddressDisplay({
    address,
    showFull = false,
    showCopy = true,
    showJazzicon = true,
    className,
}: AddressDisplayProps) {
    const handleCopy = async () => {
        await navigator.clipboard.writeText(address)
        // TODO: Show toast notification
    }

    return (
        <div
            className={cn(
                'inline-flex items-center gap-2 px-3 py-2 rounded-lg',
                'bg-gray-100 dark:bg-gray-800',
                'border border-gray-200 dark:border-gray-700',
                className,
            )}
        >
            {showJazzicon && <Jazzicon address={address} size={20} />}
            <span className="font-mono text-sm font-medium">
                {showFull ? address : `${address.slice(0, 6)}...${address.slice(-4)}`}
            </span>
            {showCopy && (
                <button
                    onClick={handleCopy}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    aria-label="Copy address"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </button>
            )}
        </div>
    )
}

/**
 * Transaction Status Component
 */
interface TransactionStatusProps {
    status: 'pending' | 'success' | 'error'
    txHash?: string
    message?: string
    explorerUrl?: string
    className?: string
}

export function TransactionStatus({
    status,
    txHash,
    message,
    explorerUrl,
    className,
}: TransactionStatusProps) {
    const statusConfig = {
        pending: {
            bg: 'bg-info-50 dark:bg-info-950',
            border: 'border-info-200 dark:border-info-800',
            text: 'text-info-700 dark:text-info-300',
            icon: (
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            ),
            title: 'Transaction Pending',
            defaultMessage: 'Confirming on blockchain...',
        },
        success: {
            bg: 'bg-success-50 dark:bg-success-950',
            border: 'border-success-200 dark:border-success-800',
            text: 'text-success-700 dark:text-success-300',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            ),
            title: 'Transaction Successful',
            defaultMessage: 'Your transaction has been confirmed!',
        },
        error: {
            bg: 'bg-error-50 dark:bg-error-950',
            border: 'border-error-200 dark:border-error-800',
            text: 'text-error-700 dark:text-error-300',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
            ),
            title: 'Transaction Failed',
            defaultMessage: 'Your transaction could not be completed.',
        },
    }

    const config = statusConfig[status]

    return (
        <div
            className={cn(
                'flex items-start gap-3 p-4 rounded-lg border',
                config.bg,
                config.border,
                status === 'success' && 'animate-celebrate',
                className,
            )}
        >
            <div className={config.text}>{config.icon}</div>
            <div className="flex-1">
                <p className={cn('font-semibold', config.text)}>{config.title}</p>
                <p className={cn('text-sm mt-1', config.text)}>{message || config.defaultMessage}</p>
                {txHash && (
                    <div className="mt-2 flex items-center gap-2">
                        <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                            {txHash.slice(0, 10)}...{txHash.slice(-8)}
                        </span>
                        {explorerUrl && (
                            <a
                                href={`${explorerUrl}/tx/${txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                View on Explorer →
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

/**
 * Network Badge
 */
interface NetworkBadgeProps {
    chainId: number
    className?: string
}

export function NetworkBadge({ chainId, className }: NetworkBadgeProps) {
    const networks: Record<number, { name: string; color: string }> = {
        1: { name: 'Ethereum', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
        8453: { name: 'Base', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' },
        84532: { name: 'Base Sepolia', color: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' },
        10: { name: 'Optimism', color: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' },
        137: { name: 'Polygon', color: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' },
    }

    const network = networks[chainId] || { name: `Chain ${chainId}`, color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' }

    return (
        <Badge variant="info" className={cn(network.color, className)}>
            {network.name}
        </Badge>
    )
}

/**
 * Gas Estimate Display
 */
interface GasEstimateProps {
    gasLimit: string
    gasPrice: string
    estimatedCost: string
    currency?: string
    className?: string
}

export function GasEstimate({
    gasLimit,
    gasPrice,
    estimatedCost,
    currency = 'ETH',
    className,
}: GasEstimateProps) {
    return (
        <div className={cn('space-y-2', className)}>
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Gas Limit</span>
                <span className="font-mono font-medium">{gasLimit}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Gas Price</span>
                <span className="font-mono font-medium">{gasPrice} Gwei</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="font-semibold text-gray-900 dark:text-white">Estimated Cost</span>
                <span className="font-mono font-bold text-lg text-gray-900 dark:text-white">
                    {estimatedCost} {currency}
                </span>
            </div>
        </div>
    )
}

/**
 * Token Amount Input
 */
interface TokenAmountInputProps {
    value: string
    onChange: (value: string) => void
    balance?: string
    symbol?: string
    usdValue?: string
    error?: string
    className?: string
}

export function TokenAmountInput({
    value,
    onChange,
    balance,
    symbol = 'ETH',
    usdValue,
    error,
    className,
}: TokenAmountInputProps) {
    const handleMax = () => {
        if (balance) {
            onChange(balance)
        }
    }

    return (
        <div className={cn('space-y-2', className)}>
            <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Amount
                </label>
                {balance && (
                    <button
                        onClick={handleMax}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                        Balance: {balance} {symbol}
                    </button>
                )}
            </div>

            <div className="relative">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="0.0"
                    className={cn(
                        'w-full px-4 py-4 pr-20 border-2 rounded-lg',
                        'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
                        'text-2xl font-mono font-bold',
                        'placeholder-gray-400 dark:placeholder-gray-500',
                        'border-gray-300 dark:border-gray-600',
                        'focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400',
                        'focus:ring-4 focus:ring-indigo-500/10',
                        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
                    )}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{symbol}</span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                {usdValue && !error && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        ≈ ${usdValue} USD
                    </span>
                )}
                {error && (
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                        {error}
                    </span>
                )}
                {balance && (
                    <button
                        onClick={handleMax}
                        className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                        MAX
                    </button>
                )}
            </div>
        </div>
    )
}

import { Sun, Moon, Wifi, WifiOff } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { WalletConnect } from './WalletConnect';
import { useChainId } from 'wagmi';

interface HeaderProps {
  isWalletConnected: boolean;
  walletAddress: string | null;
}

export function Header({ 
  isWalletConnected, 
  walletAddress
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const relayerStatus: 'online' | 'syncing' | 'error' = 'online';
  const chainId = useChainId();

  const getNetworkName = (chainId: number) => {
    const networks: Record<number, string> = {
      80002: 'Polygon Amoy',
      137: 'Polygon',
      84532: 'Base Sepolia',
      8453: 'Base',
      11155111: 'Sepolia',
      1: 'Ethereum',
    };
    return networks[chainId] || `Chain ${chainId}`;
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-6 py-4">
      <div className="flex items-center justify-end gap-4">
        {/* Network Selector */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium">{getNetworkName(chainId)}</span>
        </div>

        {/* Relayer Status */}
        <div className={`
          flex items-center gap-2 px-3 py-2 rounded-lg border
          ${relayerStatus === 'online' 
            ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20'
            : relayerStatus === 'syncing'
            ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20'
            : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20'
          }
        `}>
          {relayerStatus === 'online' ? (
            <Wifi className="w-4 h-4" />
          ) : (
            <WifiOff className="w-4 h-4" />
          )}
          <span className="text-sm font-medium capitalize">{relayerStatus}</span>
        </div>

        {/* Wallet Connection */}
        <WalletConnect />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          ) : (
            <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          )}
        </button>
      </div>
    </header>
  );
}

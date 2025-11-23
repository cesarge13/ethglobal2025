import { 
  LayoutDashboard, 
  Sprout, 
  CreditCard, 
  LineChart, 
  Wallet, 
  Activity, 
  Settings,
  Shield,
  FileText
} from 'lucide-react';

interface SidebarProps {
  currentScreen: string;
  onNavigate: (screen: any) => void;
}

export function Sidebar({ currentScreen, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'farmer-dashboard', label: 'Validación Agrícola', icon: Shield },
    { id: 'lots', label: 'Lots', icon: Sprout },
    { id: 'credits', label: 'Credits', icon: CreditCard },
    { id: 'agroscore', label: 'AgroScore', icon: LineChart },
    { id: 'payments', label: 'Payments', icon: Wallet },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'evvm-mate', label: 'EVVM MATE', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white">OrigenMX</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Agro Micro-Credit</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${isActive 
                  ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer - Powered by */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-800">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Powered by</p>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2 py-1 rounded bg-purple-100 dark:bg-purple-500/10 text-xs text-purple-700 dark:text-purple-400">
            Polygon
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 dark:bg-blue-500/10 text-xs text-blue-700 dark:text-blue-400">
            EVVM MATE
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded bg-cyan-100 dark:bg-cyan-500/10 text-xs text-cyan-700 dark:text-cyan-400">
            Filecoin
          </span>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { User, Wallet, Globe, Link2, CheckCircle, XCircle } from 'lucide-react';

export function Settings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'wallet' | 'networks' | 'integrations'>('profile');

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'wallet' as const, label: 'Wallet', icon: Wallet },
    { id: 'networks' as const, label: 'Networks & Status', icon: Globe },
    { id: 'integrations' as const, label: 'Integrations', icon: Link2 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account and system configuration
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-slate-700">
        <nav className="flex gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-600 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800">
            <h3 className="text-lg text-gray-900 dark:text-white mb-4">Profile Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Producer Name
                </label>
                <input
                  type="text"
                  defaultValue="Juan Pérez García"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="juan.perez@cooperativa.mx"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cooperative
                </label>
                <input
                  type="text"
                  defaultValue="Cooperativa Agrícola del Valle"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Tab */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800">
            <h3 className="text-lg text-gray-900 dark:text-white mb-4">Connected Wallet</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    0xA3f7...F3D4
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    MetaMask • Polygon Amoy
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400">Connected</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">USDC Balance</p>
                  <p className="text-xl text-gray-900 dark:text-white mt-1">250.00</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">MATIC Balance</p>
                  <p className="text-xl text-gray-900 dark:text-white mt-1">5.42</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Networks & Status Tab */}
      {activeTab === 'networks' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800">
            <h3 className="text-lg text-gray-900 dark:text-white mb-4">Network Connections</h3>
            <div className="space-y-4">
              {/* Polygon */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Polygon (Amoy)</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Smart contracts & credits</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-green-600 dark:text-green-400">Connected</span>
                  </div>
                  <button className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                    Test Connection
                  </button>
                </div>
              </div>

              {/* EVVM MATE */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">EVVM MATE (Sepolia)</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">AgroScore computation</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-green-600 dark:text-green-400">Online</span>
                  </div>
                  <button className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    Test Connection
                  </button>
                </div>
              </div>

              {/* Filecoin */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-500/10 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Filecoin Onchain Cloud</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Evidence storage (Synapse SDK)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-green-600 dark:text-green-400">Connected</span>
                  </div>
                  <button className="px-3 py-1 text-sm bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors">
                    Test Connection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800">
            <h3 className="text-lg text-gray-900 dark:text-white mb-4">Active Integrations</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">CreditVault Smart Contract</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    0x742d...8f2a
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">x402 Autopay Agent</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Automatic installment collection
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Synapse SDK</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Filecoin storage integration
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Sprout, TrendingUp, DollarSign, CreditCard, Plus, ArrowRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { origenApi, Lot, ActivityEvent } from '../services/origenApi';

interface DashboardProps {
  onNavigate: (screen: string) => void;
  onViewLot: (lotId: string) => void;
}

export function Dashboard({ onNavigate, onViewLot }: DashboardProps) {
  const [stats, setStats] = useState<any>(null);
  const [recentLots, setRecentLots] = useState<Lot[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, lotsData, activityData] = await Promise.all([
        origenApi.getDashboardStats(),
        origenApi.getLots(),
        origenApi.getActivities()
      ]);
      
      setStats(statsData);
      setRecentLots(lotsData.slice(0, 5));
      setRecentActivity(activityData.slice(0, 5));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const scoreColors = {
    high: '#22C55E',
    medium: '#F97316',
    low: '#EF4444'
  };

  const pieData = [
    { name: 'High (80+)', value: stats.scoreDistribution.high, color: scoreColors.high },
    { name: 'Medium (60-79)', value: stats.scoreDistribution.medium, color: scoreColors.medium },
    { name: 'Low (<60)', value: stats.scoreDistribution.low, color: scoreColors.low }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case 'Harvested':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'Certified':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lot':
        return <Sprout className="w-5 h-5 text-green-500" />;
      case 'credit':
        return <CreditCard className="w-5 h-5 text-blue-500" />;
      case 'payment':
        return <DollarSign className="w-5 h-5 text-purple-500" />;
      case 'system':
        return <AlertCircle className="w-5 h-5 text-cyan-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-500 to-green-700 dark:from-green-600 dark:to-green-800 rounded-2xl p-8 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
        
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl mb-2">OrigenMX – Producer Dashboard</h1>
              <p className="text-green-100">Agricultural traceability, AgroScore and micro-credit in one place</p>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm">
                <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse" />
                Demo version – testnet
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('register-lot')}
              className="px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Register New Lot
            </button>
            <button
              onClick={() => onNavigate('credits')}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors font-medium flex items-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Request Credit
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-500/10 rounded-lg flex items-center justify-center">
              <Sprout className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Total</span>
          </div>
          <h3 className="text-2xl text-gray-900 dark:text-white mb-1">{stats.totalLots}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Registered Lots</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className={`text-xs px-2 py-1 rounded ${stats.avgScore >= 80 ? 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'}`}>
              {stats.avgScore >= 80 ? 'High' : 'Medium'}
            </span>
          </div>
          <h3 className="text-2xl text-gray-900 dark:text-white mb-1">{stats.avgScore}/100</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Average AgroScore</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">USDC</span>
          </div>
          <h3 className="text-2xl text-gray-900 dark:text-white mb-1">${stats.eligibleCredit.toLocaleString()}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Eligible Credit</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-500/10 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <span className="text-xs px-2 py-1 rounded bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              {stats.activeCreditsCount}
            </span>
          </div>
          <h3 className="text-2xl text-gray-900 dark:text-white mb-1">${stats.activeCreditAmount.toLocaleString()}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Credits</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AgroScore Distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800">
          <h3 className="text-lg text-gray-900 dark:text-white mb-4">AgroScore Distribution</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <div className="text-3xl text-gray-900 dark:text-white">{stats.avgScore}/100</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Overall Score</div>
          </div>
        </div>

        {/* Monthly Credits */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-gray-900 dark:text-white">Disbursed Credits (USDC)</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Repayment: <span className="text-green-600 dark:text-green-400 font-medium">{stats.repaymentRate}%</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyDisbursements}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="amount" fill="#22C55E" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lots Snapshot & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lots Snapshot */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-gray-900 dark:text-white">Recent Lots</h3>
            <button
              onClick={() => onNavigate('lots')}
              className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {recentLots.map((lot) => (
              <div
                key={lot.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                onClick={() => onViewLot(lot.id)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Sprout className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{lot.id}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{lot.cropType}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(lot.status)}
                      <span className="text-xs text-gray-500 dark:text-gray-400">{lot.status}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    lot.agroScore >= 80 
                      ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400'
                      : lot.agroScore >= 60
                      ? 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
                      : 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400'
                  }`}>
                    Score: {lot.agroScore}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {lot.creditStatus}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-gray-900 dark:text-white">Recent Activity</h3>
            <button
              onClick={() => onNavigate('activity')}
              className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((event, index) => (
              <div key={event.id} className="flex gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                    {getActivityIcon(event.type)}
                  </div>
                  {index < recentActivity.length - 1 && (
                    <div className="absolute top-10 left-5 w-px h-6 bg-gray-200 dark:bg-slate-700" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white font-medium">{event.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{event.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(event.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

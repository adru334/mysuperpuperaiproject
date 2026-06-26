import React, { useState, useEffect } from 'react';
import { Token, NewsItem, HackerAttackState, MarketItem } from '../types';
import { SoundManager } from './SoundManager';
import {
  TrendingUp,
  ShieldAlert,
  Newspaper,
  Award,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Activity,
  User,
  Coffee,
  HelpCircle,
  Clock,
  RefreshCw,
  Cpu,
  ShoppingCart,
  Usb,
  Disc,
  Package,
  HardDrive,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ComputerScreenProps {
  tokens: Token[];
  walletBalance: number;
  bitcoinHoldings: { [key: string]: number };
  news: NewsItem[];
  hackerAttack: HackerAttackState;
  firewallLevel: number;
  stats: {
    totalEarned: number;
    successfulDefenses: number;
    failedDefenses: number;
    totalCallsPicked: number;
    coffeeDrunk: number;
  };
  onBuyToken: (tokenId: string, amount: number) => void;
  onSellToken: (tokenId: string, amount: number) => void;
  onUpgradeFirewall: () => void;
  onResolveHack: (success: boolean) => void;
  onDrinkCoffee: () => void;
  caffeine: number;
  onBuyMarketItem?: (itemName: string, cost: number, coinRewards: Record<string, number>, isScam: boolean, rating: number) => void;
  marketItems: MarketItem[];
  marketRefreshTimeLeft: number;
  reputation: number;
}

export function getReputationTier(reputation: number) {
  if (reputation >= 85) return { label: 'Уважаемый Брокер 🌟', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30' };
  if (reputation >= 65) return { label: 'Надежный Партнер 👍', color: 'text-cyan-400 border-cyan-500/20 bg-cyan-950/20' };
  if (reputation >= 45) return { label: 'Обычный Трейдер 🤝', color: 'text-amber-400 border-amber-500/20 bg-amber-950/20' };
  if (reputation >= 25) return { label: 'Подозрительный Тип 🤨', color: 'text-orange-400 border-orange-500/25 bg-orange-950/30' };
  return { label: 'Выгнан с биржи (Изгой) 💀', color: 'text-rose-400 border-rose-500/30 bg-rose-950/40 font-bold' };
}

export default function ComputerScreen({
  tokens,
  walletBalance,
  bitcoinHoldings,
  news,
  hackerAttack,
  firewallLevel,
  stats,
  onBuyToken,
  onSellToken,
  onUpgradeFirewall,
  onResolveHack,
  onDrinkCoffee,
  caffeine,
  onBuyMarketItem,
  marketItems,
  marketRefreshTimeLeft,
  reputation,
}: ComputerScreenProps) {
  const [activeTab, setActiveTab] = useState<'market' | 'news' | 'security' | 'stats' | 'shop'>('market');
  const [selectedTokenId, setSelectedTokenId] = useState<string>('rk');
  const [tradeAmount, setTradeAmount] = useState<number>(1);
  const [activePortIndices, setActivePortIndices] = useState<number[]>([]);
  const [defusedPorts, setDefusedPorts] = useState<number[]>([]);

  const selectedToken = tokens.find((t) => t.id === selectedTokenId) || tokens[0];

  // Set trade amount min/max helpers
  const handleSetMax = (action: 'buy' | 'sell') => {
    SoundManager.playClick();
    if (action === 'buy') {
      const maxBuy = Math.floor(walletBalance / selectedToken.price);
      setTradeAmount(maxBuy > 0 ? maxBuy : 0);
    } else {
      const owned = bitcoinHoldings[selectedToken.id] || 0;
      setTradeAmount(owned);
    }
  };

  // Setup Hacking game when hacker attack launches
  useEffect(() => {
    if (hackerAttack.isActive) {
      setActiveTab('security');
      // Generate some active port index IDs (e.g. 4 random ports out of 9 to block)
      const ports: number[] = [];
      while (ports.length < 4) {
        const rand = Math.floor(Math.random() * 9);
        if (!ports.includes(rand)) {
          ports.push(rand);
        }
      }
      setActivePortIndices(ports);
      setDefusedPorts([]);
    }
  }, [hackerAttack.isActive]);

  const handleDefusePort = (index: number) => {
    if (defusedPorts.includes(index)) return;
    SoundManager.playBlock();
    const newDefused = [...defusedPorts, index];
    setDefusedPorts(newDefused);

    // If defused all active ports successfully
    const activeLeft = activePortIndices.filter(p => !newDefused.includes(p));
    if (activeLeft.length === 0) {
      onResolveHack(true);
    }
  };

  // Auto path calculation for inline SVG line charts representing historical token trends
  const renderMiniChart = (history: number[], color: string) => {
    if (history.length < 2) return null;
    const maxVal = Math.max(...history) * 1.05;
    const minVal = Math.min(...history) * 0.95;
    const spread = maxVal - minVal || 1;

    const width = 120;
    const height = 40;

    const points = history
      .map((val, idx) => {
        const x = (idx / (history.length - 1)) * width;
        const y = height - ((val - minVal) / spread) * height;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg className="w-[120px] h-[40px] overflow-visible">
        <polyline fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
      </svg>
    );
  };

  // Main high-fidelity chart for selected token
  const renderMainChart = (token: Token) => {
    const history = token.history;
    if (history.length < 2) return null;

    const maxVal = Math.max(...history) * 1.1;
    const minVal = Math.min(...history) * 0.9;
    const spread = maxVal - minVal || 1;

    const width = 500;
    const height = 200;

    const points = history
      .map((val, idx) => {
        const x = (idx / (history.length - 1)) * width;
        const y = height - ((val - minVal) / spread) * height;
        return `${x},${y}`;
      })
      .join(' ');

    // Area points for gradient background under chart line
    const areaPoints = `${points} ${width},${height} 0,${height}`;

    return (
      <div className="relative w-full h-[220px] bg-stone-900/60 border border-stone-800 rounded-lg p-2 overflow-hidden flex flex-col justify-between">
        {/* Dynamic decorative grid lines */}
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 pointer-events-none opacity-[0.06]">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="border-t border-l border-white" />
          ))}
        </div>

        {/* Labels */}
        <div className="flex justify-between text-[11px] font-mono text-zinc-500 select-none z-10 p-1">
          <span>Макс: {Math.round(maxVal)}₽</span>
          <span className="text-[#3b82f6]">График курса {token.ticker}/RUB</span>
          <span>Мин: {Math.round(minVal)}₽</span>
        </div>

        {/* Custom SVG Drawing */}
        <div className="flex-1 w-full relative min-h-[160px]">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
            {/* Area gradient fill */}
            <defs>
              <linearGradient id={`gradient-${token.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={token.color} stopOpacity="0.30" />
                <stop offset="100%" stopColor={token.color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon points={areaPoints} fill={`url(#gradient-${token.id})`} />

            {/* Line */}
            <polyline fill="none" stroke={token.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={points} />

            {/* Current point flashing bullet */}
            {history.length > 0 && (
              <circle
                cx={width}
                cy={height - ((history[history.length - 1] - minVal) / spread) * height}
                r="5"
                fill={token.color}
                className="animate-ping"
              />
            )}
            {history.length > 0 && (
              <circle
                cx={width}
                cy={height - ((history[history.length - 1] - minVal) / spread) * height}
                r="4"
                fill={token.color}
              />
            )}
          </svg>
        </div>

        {/* Dynamic timeline indicator */}
        <div className="flex justify-between text-[10px] font-mono text-zinc-600 border-t border-stone-800/60 pt-1">
          <span>{history.length} мин назад</span>
          <span>Сейчас</span>
        </div>
      </div>
    );
  };

  // Price difference helpers
  const getPriceDiff = (history: number[]) => {
    if (history.length < 2) return { val: 0, percent: 0, isUp: true };
    const current = history[history.length - 1];
    const prev = history[history.length - 2];
    const diff = current - prev;
    const percent = (diff / prev) * 100;
    return {
      val: Math.round(diff * 10) / 10,
      percent: Math.round(percent * 10) / 10,
      isUp: diff >= 0,
    };
  };

  return (
    <div className="w-full h-[880px] md:h-[780px] bg-[#0a0f1d] border-8 border-slate-800 rounded-2xl relative shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden">
      {/* CRT Glass Curvature / Scanline glow layers */}
      <div className="crt-scanlines pointer-events-none absolute inset-0 z-30 opacity-[0.09] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%]" />
      <div className="pointer-events-none absolute inset-0 z-30 shadow-[inset_0_0_80px_rgba(34,197,94,0.12)] ring-1 ring-emerald-500/10" />

      {/* OS Header */}
      <div className="bg-slate-905 bg-slate-900 border-b-4 border-slate-800 px-4 py-2.5 flex justify-between items-center select-none shrink-0 font-mono text-xs">
        <div className="flex items-center gap-2 text-cyan-400">
          <Cpu className="w-4 h-4 animate-spin-slow" />
          <span className="font-bold text-slate-200">БрокерОС v2.4</span>
          <span className="bg-slate-850 bg-[#1e293b] text-cyan-400 px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold">Активен</span>
        </div>

        {/* Clock & Status Indicators */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-slate-400">
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-semibold font-sans ${getReputationTier(reputation).color}`}>
            <Award className="w-3 h-3 shrink-0" />
            <span>{getReputationTier(reputation).label} ({Math.round(reputation)}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px]">Файрвол: Lvl {firewallLevel}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>2026-СЕЗОН</span>
          </div>
        </div>
      </div>

      {/* Main OS Body */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 bg-slate-950">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-44 bg-slate-900/40 border-r-2 md:border-r-4 border-slate-800 flex md:flex-col justify-start md:py-4 select-none shrink-0 overflow-x-auto font-mono text-sm">
          <button
            onClick={() => { SoundManager.playClick(); setActiveTab('market'); }}
            className={`w-full text-left px-4 py-3 flex items-center gap-2.5 transition-colors border-b md:border-b-0 md:border-l-4 ${
              activeTab === 'market'
                ? 'bg-slate-800/80 text-cyan-400 border-cyan-500 font-bold'
                : 'text-slate-400 border-transparent hover:bg-slate-805 hover:bg-slate-800/30 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Биржа</span>
          </button>

          <button
            onClick={() => { SoundManager.playClick(); setActiveTab('news'); }}
            className={`w-full text-left px-4 py-3 flex items-center gap-2.5 transition-colors border-b md:border-b-0 md:border-l-4 relative ${
              activeTab === 'news'
                ? 'bg-slate-800/80 text-cyan-400 border-cyan-500 font-bold'
                : 'text-slate-400 border-transparent hover:bg-slate-805 hover:bg-slate-800/30 hover:text-white'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>Новости</span>
            {news.length > 0 && (
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            )}
          </button>

          <button
            onClick={() => { SoundManager.playClick(); setActiveTab('security'); }}
            className={`w-full text-left px-4 py-3 flex items-center gap-2.5 transition-colors border-b md:border-b-0 md:border-l-4 relative ${
              hackerAttack.isActive ? 'bg-red-950/50 text-red-400 border-red-500 font-bold animate-pulse' :
              activeTab === 'security'
                ? 'bg-slate-800/80 text-cyan-400 border-cyan-500 font-bold'
                : 'text-slate-400 border-transparent hover:bg-slate-805 hover:bg-slate-800/30 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Защита</span>
            {hackerAttack.isActive && (
              <span className="absolute top-2.5 right-3 px-1 bg-red-600 text-white font-mono text-[9px] rounded font-bold animate-ping uppercase">
                Атака!
              </span>
            )}
          </button>

          <button
            onClick={() => { SoundManager.playClick(); setActiveTab('shop'); }}
            className={`w-full text-left px-4 py-3 flex items-center gap-2.5 transition-colors border-b md:border-b-0 md:border-l-4 ${
              activeTab === 'shop'
                ? 'bg-slate-800/80 text-cyan-400 border-cyan-500 font-bold'
                : 'text-slate-400 border-transparent hover:bg-slate-805 hover:bg-slate-800/30 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Рынок</span>
          </button>

          <button
            onClick={() => { SoundManager.playClick(); setActiveTab('stats'); }}
            className={`w-full text-left px-4 py-3 flex items-center gap-2.5 transition-colors md:border-l-4 ${
              activeTab === 'stats'
                ? 'bg-slate-800/80 text-cyan-400 border-cyan-500 font-bold'
                : 'text-slate-400 border-transparent hover:bg-slate-805 hover:bg-slate-800/30 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Достижения</span>
          </button>

          {/* Quick Energy Refresher */}
          <div className="hidden md:block mt-auto p-4 border-t-2 border-slate-800">
            <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-mono">
              <span className="flex items-center gap-1"><Coffee className="w-3.5 h-3.5 text-amber-500" /> Кофеин:</span>
              <span className="font-bold text-amber-400">{caffeine}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded border border-slate-800 overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-amber-450 bg-amber-500 transition-all duration-300"
                style={{ width: `${caffeine}%` }}
              />
            </div>
            <button
              onClick={onDrinkCoffee}
              disabled={caffeine >= 100}
              className={`w-full py-1.5 text-xs font-mono font-bold rounded-lg border-2 text-center transition-all ${
                caffeine >= 100
                  ? 'border-slate-800 text-slate-600 cursor-not-allowed bg-slate-900/20'
                  : 'border-amber-600 bg-amber-950/20 text-amber-400 hover:bg-amber-950/60 cursor-pointer animate-pulse'
              }`}
            >
              Выпить кружку кофе
            </button>
          </div>
        </div>

        {/* Tab Displays */}
        <div className="flex-1 p-5 overflow-y-auto flex flex-col min-h-0 relative select-none">
          {activeTab === 'market' && (
            <div className="flex-1 flex flex-col gap-5 min-h-0">
              {/* Asset Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 flex-shrink-0">
                {tokens.map((token) => {
                  const diff = getPriceDiff(token.history);
                  const isOwned = (bitcoinHoldings[token.id] || 0) > 0;
                  const isSelected = selectedTokenId === token.id;

                  return (
                    <div
                      key={token.id}
                      onClick={() => { SoundManager.playClick(); setSelectedTokenId(token.id); }}
                      className={`p-3 rounded-lg border-2 transition-all cursor-pointer select-none flex flex-col gap-1 relative overflow-hidden ${
                        isSelected
                          ? `border-[${token.color}] bg-[#1c1917]/50 shadow-[0_0_12px_rgba(255,255,255,0.05)]`
                          : 'border-stone-800 bg-stone-900/30 hover:border-stone-700'
                      }`}
                      style={{ borderColor: isSelected ? token.color : undefined }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-stone-200 uppercase tracking-wider">{token.ticker}</span>
                        {isOwned && (
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: token.color }}
                            title="Вам принадлежит монета"
                          />
                        )}
                      </div>
                      <div className="text-sm font-bold text-stone-100 font-mono tracking-tight mt-1">
                        {Math.round(token.price * 10) / 10}₽
                      </div>
                      <div className={`font-mono text-[10px] flex items-center justify-start ${diff.isUp ? 'text-emerald-400' : 'text-rose-500'}`}>
                        {diff.isUp ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                        <span>{diff.isUp ? '+' : ''}{diff.percent}%</span>
                      </div>
                      
                      {/* Highlight subtle corner bar if selected */}
                      {isSelected && (
                        <div
                          className="absolute bottom-0 right-0 w-3 h-3 rounded-tl-md"
                          style={{ backgroundColor: token.color }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Chart & Live Trading view */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-5 min-h-[240px]">
                {/* Main Graph Area */}
                <div className="lg:col-span-2 flex flex-col gap-2 min-h-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedToken.color }} />
                      <h3 className="font-mono font-bold text-sm text-stone-200">
                        {selectedToken.name} ({selectedToken.ticker})
                      </h3>
                    </div>
                    <span className="font-mono text-xs text-stone-400">
                      Ваш баланс: <strong className="text-emerald-400">{(bitcoinHoldings[selectedToken.id] || 0)} ед.</strong>
                    </span>
                  </div>

                  {renderMainChart(selectedToken)}

                  {/* Little helper status label */}
                  <span className="text-[11px] font-mono text-zinc-500 p-1 bg-stone-900/20 rounded border border-stone-800">
                    * {selectedToken.description}
                  </span>
                </div>

                {/* Operations Panel */}
                <div className="bg-stone-900/30 border border-stone-800 p-4 rounded-xl flex flex-col justify-between font-mono">
                  <div>
                    <h3 className="text-stone-300 text-xs font-bold uppercase tracking-wider mb-3.5 border-b border-stone-800 pb-2">
                      Торговые операции
                    </h3>

                    {/* Balance Info */}
                    <div className="flex justify-between items-center bg-stone-950 p-2.5 rounded-lg border border-stone-800 mb-4 text-xs">
                      <span className="text-stone-400 flex items-center gap-1">
                        <Wallet className="w-3.5 h-3.5 text-emerald-400" /> Счёт рублями:
                      </span>
                      <span className="font-bold text-emerald-400 text-sm">
                        {Math.round(walletBalance)}₽
                      </span>
                    </div>

                    {/* Amount Input */}
                    <div className="flex flex-col gap-1.5 mb-4">
                      <label className="text-[11px] text-stone-400">Количество лотов коина:</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max="100000"
                          value={tradeAmount}
                          onChange={(e) => setTradeAmount(Math.max(0, parseInt(e.target.value) || 0))}
                          className="flex-1 bg-stone-950 border border-stone-800 rounded-lg p-2 font-bold text-stone-100 placeholder-zinc-700 text-center text-sm focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          onClick={() => setTradeAmount(tradeAmount + 1)}
                          className="bg-stone-800 border border-stone-700 hover:bg-stone-700 text-zinc-200 px-2.5 py-2 text-xs font-bold rounded-lg"
                        >
                          +
                        </button>
                        <button
                          onClick={() => setTradeAmount(Math.max(1, tradeAmount - 1))}
                          className="bg-stone-800 border border-stone-700 hover:bg-stone-700 text-zinc-200 px-3 py-2 text-xs font-bold rounded-lg"
                        >
                          -
                        </button>
                      </div>

                      {/* Percent shortcuts */}
                      <div className="grid grid-cols-2 gap-2 mt-1.5 text-[11px]">
                        <button
                          onClick={() => handleSetMax('buy')}
                          className="bg-stone-900 border border-stone-800 hover:bg-stone-800 px-2 py-1 text-zinc-300 rounded hover:text-emerald-400 transition-colors"
                        >
                          Макс покупка
                        </button>
                        <button
                          onClick={() => handleSetMax('sell')}
                          className="bg-stone-900 border border-stone-800 hover:bg-stone-800 px-2 py-1 text-zinc-300 rounded hover:text-rose-400 transition-colors"
                        >
                          Все на продажу
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Buy/Sell Action Buttons */}
                  <div className="flex flex-col gap-2.5">
                    <button
                      onClick={() => onBuyToken(selectedToken.id, tradeAmount)}
                      disabled={tradeAmount <= 0 || walletBalance < selectedToken.price * tradeAmount}
                      className={`w-full py-2.5 rounded-lg border-2 text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                        tradeAmount <= 0 || walletBalance < selectedToken.price * tradeAmount
                          ? 'border-stone-800 text-zinc-600 bg-stone-950 cursor-not-allowed'
                          : 'border-emerald-600 bg-emerald-950/20 hover:bg-emerald-950/50 text-emerald-400 cursor-pointer shadow-[0_4px_12px_rgba(16,185,129,0.1)]'
                      }`}
                    >
                      <span>Купить за</span>
                      <strong className="text-stone-100">{Math.round(selectedToken.price * tradeAmount)}₽</strong>
                    </button>

                    <button
                      onClick={() => onSellToken(selectedToken.id, tradeAmount)}
                      disabled={tradeAmount <= 0 || (bitcoinHoldings[selectedToken.id] || 0) < tradeAmount}
                      className={`w-full py-2.5 rounded-lg border-2 text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                        tradeAmount <= 0 || (bitcoinHoldings[selectedToken.id] || 0) < tradeAmount
                          ? 'border-stone-800 text-zinc-600 bg-stone-950 cursor-not-allowed'
                          : 'border-rose-600 bg-rose-950/10 hover:bg-rose-950/40 text-rose-400 cursor-pointer'
                      }`}
                    >
                      <span>Продать за</span>
                      <strong className="text-stone-100">{Math.round(selectedToken.price * tradeAmount)}₽</strong>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div className="flex-1 flex flex-col font-mono text-stone-200">
              <h3 className="text-[#3b82f6] text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-stone-800 pb-2">
                <Newspaper className="w-5 h-5 text-sky-400" /> Лента новостей инвестор-нета
              </h3>

              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {news.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500 border border-stone-800/40 rounded-xl bg-stone-900/10">
                    Лента новостей пуста. Подождите, новые слухи собираются аналитиками...
                  </div>
                ) : (
                  news.map((item, idx) => (
                    <motion.div
                      key={item.id || idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3.5 rounded-lg bg-stone-900/40 border border-stone-800 flex items-start gap-3 hover:bg-stone-900/60 transition-colors"
                    >
                      <div className="mt-1 p-1 bg-stone-950 rounded border border-stone-800">
                        {item.impactType === 'positive' ? (
                          <span className="text-emerald-400 text-xs font-bold">▲ PUMP</span>
                        ) : item.impactType === 'negative' ? (
                          <span className="text-rose-500 text-xs font-bold">▼ DUMP</span>
                        ) : (
                          <span className="text-sky-400 text-xs font-bold">■ NEWS</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-stone-200 text-sm leading-relaxed">{item.text}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-zinc-500">
                          <span>Влияние: <strong className="text-stone-300 uppercase">{item.impactTokenId}</strong></span>
                          <span>{item.timestamp}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="flex-1 flex flex-col font-mono text-zinc-300">
              {/* If Hacker Attack is ACTIVE */}
              <AnimatePresence mode="wait">
                {hackerAttack.isActive ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex-1 flex flex-col items-center justify-between p-4 bg-red-950/20 border-2 border-red-500/50 rounded-xl animate-pulse-slow gap-4"
                  >
                    <div className="text-center">
                      <span className="p-2.5 bg-red-600 text-white font-bold rounded-lg inline-flex items-center gap-2 shadow-lg shadow-red-600/10 mb-3 animate-bounce">
                        <ShieldAlert className="w-5 h-5" /> СИСТЕМА УГРОЗЫ: АКТИВНЫЙ ВЗЛОМ!
                      </span>
                      <p className="text-red-400 text-xs mt-1.5">
                        Хакер пытается извлечь кодовую фразу из вашего кошелька! Осталось времени: <strong className="text-stone-100 text-sm font-bold">{hackerAttack.timeLeft} сек</strong>
                      </p>
                    </div>

                    {/* Simple Hacker Defense game */}
                    <div className="w-full max-w-sm bg-stone-950 border border-red-500/30 p-4 rounded-xl flex flex-col gap-3">
                      <div className="text-[11px] text-zinc-400 text-center border-b border-stone-800 pb-1.5 flex items-center justify-between px-1">
                        <span>ПОРТЫ ЗАПИТКИ ТРАФИКА:</span>
                        <span className="text-rose-400 font-bold bg-rose-950/30 px-1.5 py-0.5 rounded border border-rose-500/25">Блок: {defusedPorts.length}/4</span>
                      </div>

                      {/* Ports visual block matrix */}
                      <div className="grid grid-cols-3 gap-2 p-1 bg-stone-900/30 rounded-lg">
                        {Array.from({ length: 9 }).map((_, idx) => {
                          const isActive = activePortIndices.includes(idx);
                          const isDefused = defusedPorts.includes(idx);

                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                if (isActive) {
                                  handleDefusePort(idx);
                                } else {
                                  SoundManager.playFail();
                                  onResolveHack(false); // Wrong node clicks penalizes time/attempts
                                }
                              }}
                              className={`h-14 font-mono font-bold text-xs uppercase flex flex-col items-center justify-center rounded-lg border-2 transition-all ${
                                isDefused
                                  ? 'border-emerald-600 bg-emerald-950/20 text-emerald-400'
                                  : isActive
                                  ? 'border-red-500 bg-red-900/35 hover:bg-red-800/60 text-white animate-pulse focus:outline-none focus:ring-2 focus:ring-red-400'
                                  : 'border-stone-800 bg-stone-900/60 text-stone-600 hover:border-stone-700 hover:text-stone-500'
                              }`}
                            >
                              {isDefused ? (
                                <>
                                  <span className="text-[9px]">BLOCK</span>
                                  <span>[OK]</span>
                                </>
                              ) : isActive ? (
                                <>
                                  <span className="text-[9px] animate-bounce text-red-400 font-extrabold font-mono font-stretch">THREAT</span>
                                  <span>0x{idx * 16}A</span>
                                </>
                              ) : (
                                <>
                                  <span className="text-[9px] tracking-tight text-stone-600">INACTIVE</span>
                                  <span>CLOSED</span>
                                </>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div className="text-[10px] text-zinc-500 text-center leading-relaxed italic">
                        * Кликайте по красным мигающим угрозам (PORTS) для их блокировки до завершения таймера!
                      </div>
                    </div>

                    <button
                      onClick={() => onResolveHack(false)}
                      className="text-xs text-rose-400 hover:text-rose-300 font-bold underline cursor-pointer"
                    >
                      Сдаться хакеру (Штраф -150₽)
                    </button>
                  </motion.div>
                ) : (
                  /* Firewall Upgrades section */
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-[#10b981] text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-stone-800 pb-2">
                        <Shield className="w-5 h-5 text-emerald-400" /> Центр кибер-безопасности «Душа-Заслон»
                      </h3>

                      <p className="text-sm text-stone-300 leading-relaxed mb-5">
                        Наш узел подключен к децентрализованным распределенным сетям. Хакеры регулярно пытаются перехватить наши seed-фразы. Повышайте уровень файрвола, чтобы чувствовать себя в полной безопасности.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/30">
                          <h4 className="text-zinc-200 text-xs font-bold uppercase mb-2 text-emerald-400 tracking-wider">Текущая защита</h4>
                          <ul className="text-xs text-stone-400 space-y-2 font-mono">
                            <li className="flex justify-between"><span>Уровень ячейки:</span> <strong className="text-stone-200">{firewallLevel}</strong></li>
                            <li className="flex justify-between">
                              <span>Шанс авто-отражения:</span> 
                              <strong className="text-stone-200">{firewallLevel === 1 ? '0%' : firewallLevel === 2 ? '25%' : firewallLevel === 3 ? '52%' : '80%'}</strong>
                            </li>
                            <li className="flex justify-between"><span>Время на деактивацию:</span> <strong className="text-stone-200">{20 + firewallLevel * 5} сек</strong></li>
                          </ul>
                        </div>

                        <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/30 flex flex-col justify-between">
                          <div>
                            <h4 className="text-zinc-200 text-xs font-bold uppercase mb-1 tracking-wider text-sky-400">Техподдержка</h4>
                            <p className="text-[11px] text-zinc-500 leading-relaxed">
                              Каждый уровень файрвола добавляет ценные секунды во время взлома и дает шанс автоматически дать пинок хакерам.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-stone-800 pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="text-center md:text-left">
                        <span className="text-[10px] text-zinc-500 block uppercase font-mono">Следующий уровень файрвола:</span>
                        <strong className="text-stone-200 font-mono text-sm leading-none">
                          {firewallLevel >= 4 ? 'МАКСИМАЛЬНЫЙ УРОВЕНЬ' : `Уровень ${firewallLevel + 1}`}
                        </strong>
                      </div>

                      {firewallLevel < 4 ? (
                        <button
                          onClick={onUpgradeFirewall}
                          disabled={walletBalance < (firewallLevel * 600)}
                          className={`py-2.5 px-6 font-bold text-xs uppercase rounded-lg border-2 transition-all flex items-center gap-2 ${
                            walletBalance < (firewallLevel * 600)
                              ? 'border-stone-800 text-stone-600 bg-stone-950 cursor-not-allowed'
                              : 'border-emerald-600 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/50 cursor-pointer shadow-[0_4px_12px_rgba(16,185,129,0.1)] animate-pulse'
                          }`}
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Обновить за {firewallLevel * 600}₽</span>
                        </button>
                      ) : (
                        <span className="px-4 py-2 border-2 border-emerald-500/20 bg-emerald-950/10 text-emerald-400 text-xs rounded-lg uppercase font-bold select-none">
                          Защита максимальна
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {activeTab === 'shop' && (() => {
            const minutes = Math.floor(marketRefreshTimeLeft / 60);
            const seconds = marketRefreshTimeLeft % 60;
            const iconMap = {
              usb: Usb,
              disc: Disc,
              package: Package,
              harddrive: HardDrive,
              cpu: Cpu,
              gift: Gift
            };

            return (
              <div className="flex-1 flex flex-col font-mono text-stone-300 min-h-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-2 mb-3 shrink-0">
                  <h3 className="text-cyan-400 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 sm:w-5 h-5 flex-shrink-0" /> Теневой рынок
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] font-mono">
                    <div className="text-zinc-400 flex items-center gap-1 bg-stone-950/40 px-2.1 py-1 rounded border border-stone-850">
                      <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse flex-shrink-0" />
                      <span>Обновление: <strong className="text-cyan-400 font-bold">{minutes}:${seconds < 10 ? '0' : ''}${seconds}</strong></span>
                    </div>
                    <div className="text-zinc-500 bg-stone-950/40 px-2.1 py-1 rounded border border-stone-850">
                      Баланс: <strong className="text-emerald-400 font-bold">{Math.round(walletBalance)}₽</strong>
                    </div>
                  </div>
                </div>

                {/* Subtitle / Ambient flavor */}
                <p className="text-[10px] sm:text-[11px] text-zinc-400 mb-3 leading-relaxed max-w-2xl shrink-0">
                  Добро пожаловать в лавку «BrokerOS». Здесь торговцы продают физические диски и накопители с коинами в обход биржи. <span className="text-cyan-400 font-bold">Один клик — и монеты на счету!</span>
                </p>

                {/* Grid of items (Changed from 3 cols to 2 cols to make windows larger, and reduced font sizes inside) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto pr-1 flex-1 min-h-0 pb-4">
                  {(marketItems || []).map((item) => {
                    const IconComponent = iconMap[item.iconName] || Usb;
                    const canAfford = walletBalance >= item.cost;
                    
                    // Compute content description
                    const rewardsText = Object.entries(item.rewards).length === 0 
                      ? 'Микс (РК, КК, МК, ЕК, ТК)'
                      : Object.entries(item.rewards).map(([cid, amt]) => {
                          const token = tokens.find(t => t.id === cid);
                          return `+${amt} ${token ? token.ticker : cid.toUpperCase()}`;
                        }).join(', ');

                    // Handle Click Purchase
                    const handlePurchaseClick = () => {
                      let finalRewards = { ...item.rewards };
                      if (Object.entries(item.rewards).length === 0) {
                        finalRewards = {
                          rk: Math.floor(Math.random() * 3) + 1,        // 1-3 RK
                          kk: Math.floor(Math.random() * 10) + 5,       // 5-15 KK
                          mk: Math.floor(Math.random() * 40) + 20,      // 20-60 MK
                          ek: Math.floor(Math.random() * 8) + 4,        // 4-12 EK
                          tk: Math.floor(Math.random() * 60) + 30,      // 30-90 TK
                        };
                      }
                      if (onBuyMarketItem) {
                        onBuyMarketItem(item.name, item.cost, finalRewards, item.isScam, item.rating);
                      }
                    };

                    // Determine rating tier color and text label
                    let ratingText = 'Средний';
                    let ratingColorClass = 'text-amber-400 bg-amber-955/20 border-amber-500/20';
                    if (item.rating > 50) {
                      ratingText = 'Положительный';
                      ratingColorClass = 'text-emerald-400 bg-emerald-955/20 border-emerald-500/20';
                    } else if (item.rating < 50) {
                      ratingText = 'Отрицательный';
                      ratingColorClass = 'text-rose-400 bg-rose-955/20 border-rose-500/20';
                    }

                    return (
                      <div
                        key={item.id}
                        className="bg-stone-900/30 hover:bg-stone-900/50 transition-all border border-stone-800 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between relative overflow-hidden group shadow-lg min-h-[380px] sm:min-h-[420px]"
                      >
                        {/* Top content */}
                        <div className="flex-1">
                          {/* Icon & Name Row */}
                          <div className="flex items-start gap-2.5 mb-2.5">
                            <div
                              className="p-1.5 rounded-lg bg-stone-950 border text-stone-100 group-hover:scale-105 transition-transform shrink-0"
                              style={{ borderColor: `${item.color}30`, color: item.color }}
                            >
                              <IconComponent className="w-3.5 h-3.5 sm:w-4 h-4 flex-shrink-0" />
                            </div>
                            <div className="min-w-0 pr-1">
                              <h4 className="font-bold text-stone-200 text-[11px] sm:text-xs tracking-tight group-hover:text-white transition-colors leading-tight flex flex-wrap items-center gap-1.5">
                                {item.name}
                                {item.badge && (
                                  <span className="bg-cyan-950/80 border border-cyan-500/20 text-cyan-400 font-mono text-[8px] px-1 py-0.2 rounded uppercase font-bold tracking-wider shrink-0">
                                    {item.badge}
                                  </span>
                                )}
                              </h4>
                              <span className="text-[9px] sm:text-[9.5px] font-bold uppercase tracking-wider block mt-0.5" style={{ color: item.color }}>
                                {rewardsText}
                              </span>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-[10px] sm:text-[10.5px] text-zinc-400 leading-normal font-sans mb-3 text-pretty">
                            {item.description}
                          </p>

                          {/* Rating and Scam Info Block */}
                          <div className="bg-stone-950/30 border border-stone-850/40 rounded-lg p-2.5 mb-3 font-mono text-[9px] sm:text-[9.5px] space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-zinc-500">Рейтинг продавца:</span>
                              <span className={`px-1.5 py-0.2 rounded border text-[8.5px] sm:text-[9px] font-bold uppercase ${ratingColorClass}`}>
                                {item.rating}% ({ratingText})
                              </span>
                            </div>
                            <div className="flex justify-between items-center border-t border-stone-850/20 pt-1.5">
                              <span className="text-zinc-500">Вероятность скама:</span>
                              <span className={`font-bold ${item.scamChance > 50 ? 'text-rose-400' : item.scamChance > 20 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                {item.scamChance}%
                              </span>
                            </div>
                          </div>

                          {/* Reviews Sub-Block */}
                          <div className="pt-2 border-t border-stone-800/30 mb-2.5">
                            <span className="text-[8.5px] font-bold text-zinc-500 block uppercase mb-1.5 tracking-wider">Отзывы покупателей:</span>
                            <div className="space-y-1.5">
                              {item.reviews.map((review, rIdx) => (
                                <div key={rIdx} className="bg-stone-950/15 p-2 rounded border border-stone-900/40 leading-relaxed italic text-[9px] sm:text-[9.5px] text-zinc-300">
                                  « {review} »
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Purchase Button row */}
                        <div className="mt-auto pt-2.5 border-t border-stone-800/30 flex justify-between items-center shrink-0">
                          <div>
                            <span className="text-[8px] text-zinc-500 block uppercase font-mono">Цена:</span>
                            <span className="font-bold text-amber-400 text-xs sm:text-sm font-mono">{item.cost}₽</span>
                          </div>

                          <button
                            onClick={handlePurchaseClick}
                            disabled={!canAfford}
                            className={`py-1 px-3 rounded-lg font-mono text-[9.5px] sm:text-[10px] font-bold uppercase border transition-all flex items-center gap-1 ${
                              canAfford
                                ? 'border-emerald-600 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/50 cursor-pointer shadow-[0_2px_8px_rgba(16,185,129,0.05)]'
                                : 'border-stone-800 text-stone-600 bg-stone-950/50 cursor-not-allowed'
                            }`}
                          >
                            Купить
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {activeTab === 'stats' && (
            <div className="flex-1 flex flex-col font-mono text-stone-300">
              <h3 className="text-emerald-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-stone-800 pb-2">
                <Award className="w-5 h-5 text-emerald-400" /> Статистика за рабочую сессию
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl pb-6">
                {/* RPG Reputation Card */}
                <div className={`p-3.5 rounded-lg border flex items-center gap-3 col-span-1 sm:col-span-2 ${getReputationTier(reputation).color}`}>
                  <div className="p-2 rounded bg-stone-900 text-indigo-400 border border-stone-800 shrink-0">
                    <Award className="w-5.5 h-5.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9.5px] text-zinc-400 uppercase font-bold tracking-wider">Репутация трейдера:</span>
                      <strong className="text-stone-100 text-[10px] uppercase font-mono">{getReputationTier(reputation).label} ({Math.round(reputation)}%)</strong>
                    </div>
                    <div className="w-full bg-stone-950/80 h-1.5 rounded-full overflow-hidden border border-stone-800/20">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 transition-all duration-500"
                        style={{ width: `${reputation}%` }}
                      />
                    </div>
                    <p className="text-[9.5px] text-zinc-400 mt-1 pb-0.5 leading-tight font-sans">
                      * Вежливое общение со звонящими покупателями и продавцами повышает репутацию. Грубость или умышленное оскорбление снизит ваш рейтинг.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border border-stone-800/60 bg-stone-900/10 flex items-center gap-3">
                  <div className="p-2 rounded bg-stone-900 text-emerald-400 border border-stone-800">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Заработано всего:</span>
                    <strong className="text-emerald-400 text-base">{stats.totalEarned}₽</strong>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border border-stone-800/60 bg-stone-900/10 flex items-center gap-3">
                  <div className="p-2 rounded bg-stone-900 text-emerald-500 border border-stone-800">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Хакеры отражены:</span>
                    <strong className="text-emerald-400 text-base">{stats.successfulDefenses}</strong>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border border-stone-800/60 bg-stone-900/10 flex items-center gap-3">
                  <div className="p-2 rounded bg-stone-900 text-rose-500 border border-stone-800">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Успешные взломы:</span>
                    <strong className="text-rose-400 text-base">{stats.failedDefenses}</strong>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border border-stone-800/60 bg-stone-900/10 flex items-center gap-3">
                  <div className="p-2 rounded bg-stone-900 text-[#fde047] border border-stone-800">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Звонки продавцов приняты:</span>
                    <strong className="text-stone-100 text-base">{stats.totalCallsPicked}</strong>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border border-stone-800/60 bg-stone-900/10 flex items-center gap-3">
                  <div className="p-2 rounded bg-stone-900 text-amber-500 border border-stone-800">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Кофе выпито (кружек):</span>
                    <strong className="text-amber-400 text-base">{stats.coffeeDrunk}</strong>
                  </div>
                </div>
              </div>

              {/* Game reference */}
              <div className="mt-6 p-4 rounded-xl border-2 border-stone-800/40 bg-stone-900/20 text-xs text-zinc-400 leading-relaxed max-w-xl">
                <span className="text-amber-400 font-bold block mb-1 uppercase text-[10px] tracking-wider">Как играть:</span>
                • Скупайте монеты (РК, КК, МК, ЕК, ТК) на низах, а когда приходят оповещения или звонки продавцов, выгодно торгуйтесь.<br/>
                • Отвечайте на телефонные звонки. Будьте вежливы или шутите, чтобы получить безумные персональные скидки в стиле RPG Undertale!<br/>
                • Защищайте свой сервер во вкладке «Защита», когда хакер совершает кибер-атаку. Взлом обнуляет часть валюты и накладывает финансовый штраф.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

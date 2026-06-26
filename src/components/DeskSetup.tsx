import React from 'react';
import { Token, NewsItem, HackerAttackState, CallCharacter } from '../types';
import ComputerScreen from './ComputerScreen';
import PhoneComponent from './PhoneComponent';
import { SoundManager } from './SoundManager';
import { motion, AnimatePresence } from 'motion/react';
import { Coffee, Bookmark, Star, Shield, HelpCircle, Settings } from 'lucide-react';

interface DeskSetupProps {
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
  incomingCallCharacter: CallCharacter | null;
  onAnswerCall: () => void;
  onDeclineCall: () => void;
  onBuyToken: (tokenId: string, amount: number) => void;
  onSellToken: (tokenId: string, amount: number) => void;
  onUpgradeFirewall: () => void;
  onResolveHack: (success: boolean) => void;
  onDrinkCoffee: () => void;
  caffeine: number;
  onBuyMarketItem?: (itemName: string, cost: number, coinRewards: Record<string, number>, isScam: boolean, rating: number) => void;
  marketItems: import('../types').MarketItem[];
  marketRefreshTimeLeft: number;
  reputation: number;
  onOpenMainMenu?: () => void;
}

export default function DeskSetup({
  tokens,
  walletBalance,
  bitcoinHoldings,
  news,
  hackerAttack,
  firewallLevel,
  stats,
  incomingCallCharacter,
  onAnswerCall,
  onDeclineCall,
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
  onOpenMainMenu,
}: DeskSetupProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 relative bg-[#020617] text-slate-300 font-sans overflow-hidden min-h-screen">
      {/* Star Field & Neon background overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e1b4b_0%,transparent_60%)] opacity-35" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-900/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Decorative top ambient indicator light */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-cyan-600 via-indigo-600 to-amber-500 opacity-60" />

      <div className="w-full max-w-7xl z-10 flex flex-col gap-6">
        {/* Header / System Bar */}
        <div className="w-full bg-slate-900/80 border border-slate-800/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between px-6 py-3.5 gap-4 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-violet-500 flex items-center justify-center text-[10px] font-black text-white">★</span>
            <h1 className="text-sm font-bold uppercase tracking-widest text-slate-100 font-mono">ТОРГОВЫЙ СМАРТ-КАБИНЕТ</h1>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse" />
              <span className="text-[11px] font-mono text-slate-300 uppercase">Связь стабильна</span>
            </div>
            <span className="text-slate-700 hidden md:inline">|</span>
            <span className="text-[11px] font-mono text-slate-400 hidden md:inline">Система: Lvl {firewallLevel}</span>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-indigo-300 bg-indigo-950/20 px-2.5 py-1 rounded-lg border border-indigo-500/20">
              <Star className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />
              <span>Репутация: {Math.round(reputation)}%</span>
            </div>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <span className="font-mono text-cyan-400 font-bold text-xs bg-cyan-950/40 border border-cyan-500/20 px-3 py-1.5 rounded-lg">
              {Math.round(walletBalance)}₽
            </span>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <button
              onClick={() => {
                SoundManager.playClick();
                onOpenMainMenu?.();
              }}
              className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-300 hover:text-white bg-slate-800/60 hover:bg-slate-750 px-2.5 py-1.5 rounded-lg border border-slate-700/60 transition-all cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Меню</span>
            </button>
          </div>
        </div>

        {/* Interactive Workspace Desk Layout (Items sit beautifully on top of the desk) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end relative mt-2">
          
          {/* COLUMN 1 (CENTER & LEFT): Big Computer CTR Monitor with Stands, now expanded to cover 9 columns */}
          <div className="lg:col-span-9 flex flex-col items-center justify-end order-1 h-full">
            <div className="w-full">
              <ComputerScreen
                tokens={tokens}
                walletBalance={walletBalance}
                bitcoinHoldings={bitcoinHoldings}
                news={news}
                hackerAttack={hackerAttack}
                firewallLevel={firewallLevel}
                stats={stats}
                onBuyToken={onBuyToken}
                onSellToken={onSellToken}
                onUpgradeFirewall={onUpgradeFirewall}
                onResolveHack={onResolveHack}
                onDrinkCoffee={onDrinkCoffee}
                caffeine={caffeine}
                onBuyMarketItem={onBuyMarketItem}
                marketItems={marketItems}
                marketRefreshTimeLeft={marketRefreshTimeLeft}
                reputation={reputation}
              />
            </div>

            {/* Stand of computer monitor from Design HTML */}
            <div className="w-44 h-4 bg-zinc-800 border-t border-zinc-700/60" />
            <div className="w-56 h-2 bg-zinc-700 rounded-t-lg shadow-2xl" />
          </div>

          {/* COLUMN 2 (RIGHT): Portfolio Status, Yellow Sticky Notepad, and steaming Espresso cup */}
          <div className="lg:col-span-3 flex flex-col gap-4 justify-end order-2 h-full">
            
            {/* Portfolio Status Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-xl font-mono">
              <h3 className="text-xs font-bold uppercase text-slate-400 mb-2 tracking-widest">Текущий Счёт</h3>
              <div className="text-2xl font-bold text-white mb-1 tracking-tight">{Math.round(walletBalance)}₽</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span>Прибыль за сессию:</span> 
                <strong className="font-bold">+{Math.max(0, Math.round(stats.totalEarned))}₽</strong>
              </div>
            </div>

            {/* Yellow Sticky Goal Notepad in Hand-written Retro Style */}
            <div className="bg-[#fef9c3] text-stone-850 rounded-lg p-5 shadow-2xl flex flex-col gap-3 transform rotate-1 border border-yellow-200 font-mono relative">
              <div className="absolute top-0 inset-x-8 h-2.5 bg-yellow-250/60 border-t-2 border-dashed border-yellow-400/50" />
              <h3 className="font-bold text-yellow-850 text-xs border-b border-yellow-300 pb-1.5 uppercase font-mono tracking-widest flex items-center gap-1.5 mt-1.5">
                <Bookmark className="w-3.5 h-3.5 text-yellow-700 fill-yellow-700" /> ЗАМЕТКИ ТРЕЙДЕРА
              </h3>
              <ul className="text-[10px] text-stone-700 flex flex-col gap-2 leading-relaxed">
                <li className="flex items-start gap-1 pb-1 border-b border-yellow-200/60">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span><strong>Рокет Босс:</strong> пришелец в фиолетовой кофте! Космические приветствия вызывают прилив его щедрости.</span>
                </li>
                <li className="flex items-start gap-1 pb-1 border-b border-yellow-200/60">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span><strong>Зорид:</strong> сильный майнер. Обожает шутки про фермы и видеокарты.</span>
                </li>
                <li className="flex items-start gap-1 pb-1 border-b border-yellow-200/60">
                  <span className="text-yellow-[650] font-bold">•</span>
                  <span><strong>Алекс:</strong> крипто-энтузиаст, маржинальные каламбуры растопят его цену.</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span><strong>Вортекс:</strong> системщик. Дарите айти-шутки для получения бесплатных патчей!</span>
                </li>
              </ul>
              <div className="mt-1 text-[9px] italic text-yellow-600/80 text-right font-semibold">
                * Отражайте атаки хакеров вовремя!
              </div>
            </div>

            {/* Coffee machine cup option */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              onClick={() => {
                if (caffeine < 100) {
                  SoundManager.playClick();
                  onDrinkCoffee();
                } else {
                  SoundManager.playFail();
                }
              }}
              className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-xl flex items-center gap-3.5 cursor-pointer hover:border-amber-500/50 transition-all select-none"
            >
              <div className="w-11 h-11 bg-amber-950/50 border-2 border-amber-800 rounded-full flex items-center justify-center relative flex-shrink-0">
                <div className="absolute inset-1 bg-amber-950 rounded-full border border-stone-800 flex items-center justify-center">
                  <Coffee className="w-4 h-4 text-amber-500" />
                </div>
                <div className="absolute -right-1.5 top-3 w-2.5 h-4 border-2 border-amber-800 rounded-r-md" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-xs font-mono font-bold text-slate-200 flex items-center justify-between">
                  <span>Кружка Кофе</span>
                  <span className="text-amber-400 font-bold text-[10px]">{caffeine}% Энергии</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5 leading-tight truncate">
                  * Нажмите, чтобы выпить кофе (+20%)
                </p>
              </div>
            </motion.div>

          </div>
        </div>

        {/* High Fidelity Smartphone Container - absolutely positioned, slides up from the bottom when there is an incoming call */}
        <AnimatePresence>
          {incomingCallCharacter && (
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 100 }}
              className="fixed bottom-6 left-6 md:left-12 z-40 flex flex-col items-center gap-2 drop-shadow-2xl"
            >
              <div className="text-center font-mono text-stone-200 text-[10px] tracking-wider uppercase bg-slate-900/90 border border-red-500/30 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                Звонок на Смартфон
              </div>
              
              <PhoneComponent
                incomingCallCharacter={incomingCallCharacter}
                onAnswerCall={onAnswerCall}
                onDeclineCall={onDeclineCall}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Desk Edge from Design HTML */}
        <div className="h-8 bg-zinc-900 border-t border-zinc-800 flex items-center justify-center gap-8 mt-4 rounded-xl shadow-2xl">
           <div className="w-12 h-1 bg-zinc-700 rounded-full opacity-60"></div>
           <div className="w-12 h-1 bg-zinc-700 rounded-full opacity-60"></div>
           <div className="w-12 h-1 bg-zinc-700 rounded-full opacity-60"></div>
        </div>

      </div>
    </div>
  );
}

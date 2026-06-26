/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Token, NewsItem, HackerAttackState, CallCharacter, DialogueOption, MarketItem } from './types';
import { CHARACTERS, NEWS_TEMPLATES, generateMarketItems } from './data';
import { SoundManager } from './components/SoundManager';
import DeskSetup from './components/DeskSetup';
import DialogueBox from './components/DialogueBox';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Shield, ShieldAlert, Sparkles, X, Info, Play, Sliders, Volume2, VolumeX, Settings, Award, RefreshCw, HelpCircle } from 'lucide-react';

const INITIAL_TOKENS: Token[] = [
  {
    id: 'rk',
    name: 'Рокет Коин',
    ticker: 'РК',
    price: 300,
    history: [290, 310, 295, 305, 300],
    color: '#f43f5e',
    bgLight: 'rgba(244, 63, 94, 0.15)',
    borderClass: 'border-rose-500',
    description: 'Надежный, взрывной межпланетный токен от Rocket Boss. Самый прибыльный и востребованный актив на рынке.'
  },
  {
    id: 'kk',
    name: 'Космо Коин',
    ticker: 'КК',
    price: 60,
    history: [55, 62, 59, 61, 60],
    color: '#06b6d4',
    bgLight: 'rgba(6, 182, 212, 0.15)',
    borderClass: 'border-cyan-500',
    description: 'Технологичный космический токен, защищенный децентрализованными мастер-нодами.'
  },
  {
    id: 'mk',
    name: 'Мем Коин',
    ticker: 'МК',
    price: 20,
    history: [25, 18, 22, 19, 20],
    color: '#ec4899',
    bgLight: 'rgba(236, 72, 153, 0.15)',
    borderClass: 'border-pink-500',
    description: 'Мемная монета. Имеет запредельную волатильность. Растет от твитов известных инфлюенсеров.'
  },
  {
    id: 'ek',
    name: 'Енот Коин',
    ticker: 'ЕК',
    price: 120,
    history: [110, 115, 125, 118, 120],
    color: '#ef4444',
    bgLight: 'rgba(239, 68, 68, 0.15)',
    borderClass: 'border-red-500',
    description: 'Пушистый и хитрый токен от лесного синдиката Енотов. Медленно, но верно крадется по графикам вверх.'
  },
  {
    id: 'tk',
    name: 'Тех Коин',
    ticker: 'ТК',
    price: 8,
    history: [12, 5, 15, 9, 8],
    color: '#22c55e',
    bgLight: 'rgba(34, 197, 94, 0.15)',
    borderClass: 'border-emerald-500',
    description: 'Энергоэффективный технический блокчейн-сервис. Растет от внедрения передовых протоколов шифрования.'
  }
];

export default function App() {
  // Save/Load states from Local Storage
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem('crypto_office_balance');
    return saved ? parseFloat(saved) : 500;
  });

  const [bitcoinHoldings, setBitcoinHoldings] = useState<{ [key: string]: number }>(() => {
    const saved = localStorage.getItem('crypto_office_holdings');
    return saved ? JSON.parse(saved) : { rk: 2, kk: 0, mk: 5, ek: 0, tk: 10 };
  });

  const [tokens, setTokens] = useState<Token[]>(INITIAL_TOKENS);
  const [reputation, setReputation] = useState<number>(() => {
    const saved = localStorage.getItem('crypto_office_reputation');
    return saved ? parseFloat(saved) : 75; // starts at 75%
  });
  const [volume, setVolume] = useState<number>(() => SoundManager.getVolume());
  const [showMainMenu, setShowMainMenu] = useState<boolean>(true);
  const [showSettingsInMenu, setShowSettingsInMenu] = useState<boolean>(false);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const showMainMenuRef = useRef(showMainMenu);
  useEffect(() => {
    showMainMenuRef.current = showMainMenu;
  }, [showMainMenu]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [caffeine, setCaffeine] = useState<number>(80);
  const [firewallLevel, setFirewallLevel] = useState<number>(1);
  const [stats, setStats] = useState({
    totalEarned: 500,
    successfulDefenses: 0,
    failedDefenses: 0,
    totalCallsPicked: 0,
    coffeeDrunk: 0,
  });

  // Call System
  const [incomingCallCharacter, setIncomingCallCharacter] = useState<CallCharacter | null>(null);
  const [activeDialogueCharacter, setActiveDialogueCharacter] = useState<CallCharacter | null>(null);
  const [currentDialogueNodeId, setCurrentDialogueNodeId] = useState<string>('start');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hacker Attack State
  const [hackerAttack, setHackerAttack] = useState<HackerAttackState>({
    isActive: false,
    timeLeft: 0,
    targetWalletSeed: '',
    attemptsLeft: 3,
    currentCode: [],
    correctSequence: [],
    threatLevel: 'low',
  });

  // Dynamic Market Items and refresh timer (2 minutes = 120 seconds)
  const [marketItems, setMarketItems] = useState<MarketItem[]>(() => {
    return generateMarketItems();
  });
  const [marketRefreshTimeLeft, setMarketRefreshTimeLeft] = useState<number>(120);

  // 1.5 Market refresh timer countdown
  useEffect(() => {
    if (showMainMenu) return;
    const marketInterval = setInterval(() => {
      setMarketRefreshTimeLeft((prev) => {
        if (prev <= 1) {
          setMarketItems(generateMarketItems());
          showToast('🛒 Ассортимент теневого рынка «BrokerOS» обновился! Загляните во вкладку «Рынок».');
          return 120;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(marketInterval);
  }, [showMainMenu]);

  // Keep references for timers
  const hackerTimerRef = useRef<NodeJS.Timeout | null>(null);
  const alarmTimerRef = useRef<NodeJS.Timeout | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastPickedCharRef = useRef<string>('');

  // Save Progress whenever key states alter
  useEffect(() => {
    localStorage.setItem('crypto_office_balance', walletBalance.toString());
    localStorage.setItem('crypto_office_holdings', JSON.stringify(bitcoinHoldings));
    localStorage.setItem('crypto_office_reputation', reputation.toString());
  }, [walletBalance, bitcoinHoldings, reputation]);

  // Clean up all intervals on component unmount
  useEffect(() => {
    return () => {
      if (hackerTimerRef.current) clearInterval(hackerTimerRef.current);
      if (alarmTimerRef.current) clearInterval(alarmTimerRef.current);
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, []);

  // Show dynamic game toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    SoundManager.setVolume(newVol);
    SoundManager.playBleep(350, 'triangle', 0.05);
  };

  const handleStartNewGame = () => {
    // Clear active intervals/timeouts
    if (hackerTimerRef.current) {
      clearInterval(hackerTimerRef.current);
      hackerTimerRef.current = null;
    }
    if (alarmTimerRef.current) {
      clearInterval(alarmTimerRef.current);
      alarmTimerRef.current = null;
    }
    if (callTimerRef.current) {
      clearTimeout(callTimerRef.current);
      callTimerRef.current = null;
    }

    localStorage.removeItem('crypto_office_balance');
    localStorage.removeItem('crypto_office_holdings');
    localStorage.removeItem('crypto_office_reputation');
    
    setWalletBalance(500);
    setBitcoinHoldings({ rk: 2, kk: 0, mk: 5, ek: 0, tk: 10 });
    setReputation(75);
    setFirewallLevel(1);
    setCaffeine(80);
    setTokens(INITIAL_TOKENS);
    setIncomingCallCharacter(null);
    setActiveDialogueCharacter(null);
    setHackerAttack({
      isActive: false,
      timeLeft: 0,
      targetWalletSeed: '',
      attemptsLeft: 3,
      currentCode: [],
      correctSequence: [],
      threatLevel: 'low',
    });
    setStats({
      totalEarned: 500,
      successfulDefenses: 0,
      failedDefenses: 0,
      totalCallsPicked: 0,
      coffeeDrunk: 0,
    });
    setNews([]);
    setShowMainMenu(false);
    setShowResetConfirm(false);
    SoundManager.playSuccess();
    showToast("🌟 Новая рабочая сессия начата с чистого листа!");
  };

  // 1. Core Price Ticker fluctuation Loop
  useEffect(() => {
    if (showMainMenu) return;
    const interval = setInterval(() => {
      setTokens((prevTokens) =>
        prevTokens.map((token) => {
          // Volatility modifier based on token type
          let coeff = 0.05;
          if (token.id === 'mk') coeff = 0.25; // extreme volatile
          if (token.id === 'rk') coeff = 0.02; // stable
          if (token.id === 'ek') coeff = 0.08;
          if (token.id === 'tk') coeff = 0.18;

          const randomWalk = (Math.random() - 0.49) * 2 * coeff; // slightly upwards drift
          const currentPrice = token.price;
          // Calculate next price strictly > 1₽
          const nextPrice = Math.max(1, currentPrice * (1 + randomWalk));

          // Append to history list (max 25 entries for the mini charts)
          const newHistory = [...token.history, nextPrice];
          if (newHistory.length > 25) {
            newHistory.shift();
          }

          return {
            ...token,
            price: Math.round(nextPrice * 10) / 10,
            history: newHistory,
          };
        })
      );

      // Caffeine decay loop slowly
      setCaffeine((prev) => Math.max(0, prev - 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [showMainMenu]);

  // 2. Scheduled News updates every 25 seconds
  useEffect(() => {
    if (showMainMenu) return;
    const newsInterval = setInterval(() => {
      const randomTemplate = NEWS_TEMPLATES[Math.floor(Math.random() * NEWS_TEMPLATES.length)];
      
      // Calculate local time string
      const date = new Date();
      const timestamp = date.toTimeString().split(' ')[0];

      const newNewsItem: NewsItem = {
        id: Math.random().toString(),
        text: randomTemplate.text,
        impactType: randomTemplate.impactType as 'positive' | 'negative' | 'neutral',
        impactTokenId: randomTemplate.impactTokenId,
        intensity: randomTemplate.intensity,
        timestamp,
      };

      setNews((prev) => [newNewsItem, ...prev].slice(0, 20));

      // Force high intensity impact on target token price immediately!
      setTokens((prevTokens) =>
        prevTokens.map((t) => {
          if (t.id === randomTemplate.impactTokenId) {
            const nextPrice = Math.max(
              1.5,
              t.price * (randomTemplate.impactType === 'positive' ? randomTemplate.intensity : randomTemplate.intensity)
            );
            const history = [...t.history, nextPrice];
            if (history.length > 25) history.shift();
            
            return {
              ...t,
              price: Math.round(nextPrice * 10) / 10,
              history,
            };
          }
          return t;
        })
      );

      showToast(`НОВОСТИ: ${randomTemplate.text.substring(0, 45)}...`);
    }, 24000);

    return () => clearInterval(newsInterval);
  }, [showMainMenu]);

  // 3. Scheduler for Seller Phone calls
  useEffect(() => {
    if (showMainMenu) return;
    const scheduleNextCall = () => {
      const waitTime = 30000 + Math.random() * 25000; // 30-55 seconds wait
      callTimerRef.current = setTimeout(() => {
        // Find available character different from the previous one
        const callers = CHARACTERS.filter((c) => c.id !== lastPickedCharRef.current);
        const nextChar = callers[Math.floor(Math.random() * callers.length)];

        if (nextChar && !hackerAttack.isActive && !activeDialogueCharacter) {
          lastPickedCharRef.current = nextChar.id;
          setIncomingCallCharacter(nextChar);
          SoundManager.playRing();

          // Auto disconnect if not answered in 14 seconds
          setTimeout(() => {
            setIncomingCallCharacter((prev) => {
              if (prev && prev.id === nextChar.id) {
                showToast(`Пропущенный звонок от: ${nextChar.name}`);
                return null;
              }
              return prev;
            });
          }, 14000);
        }
        scheduleNextCall();
      }, waitTime);
    };

    scheduleNextCall();
    return () => {
      if (callTimerRef.current) clearTimeout(callTimerRef.current);
    };
  }, [hackerAttack.isActive, activeDialogueCharacter, showMainMenu]);

  // 4. Hacker Attacks schedules
  useEffect(() => {
    if (showMainMenu) return;
    const launchHackerScheduler = () => {
      // 50-80 seconds interval between cyber incidents
      const waitTime = 45000 + Math.random() * 35000;
      const timer = setTimeout(() => {
        // Trigger cyber hacker attack if no dialogue is active
        if (!hackerAttack.isActive && !activeDialogueCharacter) {
          triggerHackerBreach();
        }
        launchHackerScheduler();
      }, waitTime);

      return timer;
    };

    const intervalTimer = launchHackerScheduler();
    return () => clearTimeout(intervalTimer);
  }, [hackerAttack.isActive, activeDialogueCharacter, firewallLevel, showMainMenu]);

  const triggerHackerBreach = () => {
    // Check firewall auto defend block roll: 
    // Level 1: 0% / Level 2: 20% / Level 3: 45% / Level 4: 75%
    const defendChance = firewallLevel === 1 ? 0 : firewallLevel === 2 ? 0.20 : firewallLevel === 3 ? 0.45 : 0.75;
    if (Math.random() < defendChance) {
      showToast('🛡️ Файрвол заблокировал удаленную попытку взлома!');
      SoundManager.playBlock();
      setStats((prev) => ({ ...prev, successfulDefenses: prev.successfulDefenses + 1 }));
      return;
    }

    // Otherwise launch countdown attack
    SoundManager.playAlarm();
    const duration = 20 + firewallLevel * 5; // Adds extra action seconds per firewall tier
    setHackerAttack({
      isActive: true,
      timeLeft: duration,
      targetWalletSeed: Math.floor(Math.random() * 9000 + 1000).toString(),
      attemptsLeft: 3,
      currentCode: [],
      correctSequence: [],
      threatLevel: firewallLevel >= 3 ? 'low' : 'medium',
    });

    // Clear any dangling alarms first
    if (alarmTimerRef.current) {
      clearInterval(alarmTimerRef.current);
    }

    // Ring alarm alarm sound loop
    const alarmInterval = setInterval(() => {
      if (showMainMenuRef.current) return; // PAUSED IN MENU
      SoundManager.playAlarm();
    }, 1200);
    alarmTimerRef.current = alarmInterval;

    hackerTimerRef.current = setInterval(() => {
      if (showMainMenuRef.current) return; // PAUSED IN MENU
      setHackerAttack((prev) => {
        if (prev.timeLeft <= 1) {
          if (hackerTimerRef.current) clearInterval(hackerTimerRef.current);
          if (alarmTimerRef.current) {
            clearInterval(alarmTimerRef.current);
            alarmTimerRef.current = null;
          }
          executeHackerPenalty(); // Penalty happens if timer clocks down to zero
          return { ...prev, isActive: false };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
  };

  const executeHackerPenalty = () => {
    SoundManager.playFail();

    // Deduct cash balance and part of holding values
    const cashLoss = 150;
    setWalletBalance((w) => Math.max(0, w - cashLoss));

    setBitcoinHoldings((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        updated[key] = Math.max(0, Math.floor(updated[key] * 0.85)); // Loses 15% holdings in cold wallets
      });
      return updated;
    });

    setStats((prev) => ({ ...prev, failedDefenses: prev.failedDefenses + 1 }));
    showToast('🚨 ВЗЛОМ УСПЕШЕН: Похищено 150₽ и 15% ваших криптовалютных заначек!');
  };

  const handleResolveHack = (success: boolean) => {
    if (hackerTimerRef.current) {
      clearInterval(hackerTimerRef.current);
    }
    if (alarmTimerRef.current) {
      clearInterval(alarmTimerRef.current);
      alarmTimerRef.current = null;
    }
    // Clean states
    setHackerAttack((prev) => ({ ...prev, isActive: false }));

    if (success) {
      SoundManager.playSuccess();
      const prize = 120;
      setWalletBalance((prev) => prev + prize);
      setStats((prev) => ({
        ...prev,
        successfulDefenses: prev.successfulDefenses + 1,
        totalEarned: prev.totalEarned + prize,
      }));
      showToast('🛡️ БРАВО! Вы успешно отразили атаку и получили вознаграждение 120₽!');
    } else {
      executeHackerPenalty();
    }
  };

  // 5. Upgrade player system firewall
  const handleUpgradeFirewall = () => {
    const cost = firewallLevel * 600;
    if (walletBalance >= cost) {
      SoundManager.playSuccess();
      setWalletBalance((w) => w - cost);
      setFirewallLevel((prev) => prev + 1);
      showToast(`🛡️ Файрвол обновлен до уровня ${firewallLevel + 1}! Исходная защита повышена.`);
    } else {
      SoundManager.playFail();
    }
  };

  // 6. Buying Crypto Assets on exchange manually
  const handleBuyTokenManually = (tokenId: string, amount: number) => {
    const token = tokens.find((t) => t.id === tokenId);
    if (!token || amount <= 0) return;

    const totalCost = token.price * amount;
    if (walletBalance >= totalCost) {
      SoundManager.playSuccess();
      setWalletBalance((prev) => prev - totalCost);
      setBitcoinHoldings((prev) => ({
        ...prev,
        [tokenId]: (prev[tokenId] || 0) + amount,
      }));
      showToast(`Куплено ${amount} лотов ${token.ticker} за ${Math.round(totalCost)}₽!`);
    } else {
      SoundManager.playFail();
      showToast('Ошибка: Недостаточно средств!');
    }
  };

  // 6.5 Buying marketplace physical items
  const handleBuyMarketItem = (
    itemName: string,
    cost: number,
    coinRewards: Record<string, number>,
    isScam: boolean,
    rating: number
  ) => {
    if (walletBalance >= cost) {
      setWalletBalance((prev) => prev - cost);
      
      if (isScam) {
        SoundManager.playFail();
        showToast(`⚠️ ОБМАН! Вы купили "${itemName}" за ${cost}₽ с рук, но носитель оказался пустым! (Оценка товара была всего ${rating}%)`);
        return;
      }

      SoundManager.playSuccess();
      setBitcoinHoldings((prev) => {
        const updated = { ...prev };
        Object.entries(coinRewards).forEach(([coinId, amt]) => {
          updated[coinId] = (updated[coinId] || 0) + amt;
        });
        return updated;
      });
      
      const rewardsList = Object.entries(coinRewards)
        .map(([cid, amt]) => {
          const token = tokens.find((t) => t.id === cid);
          return `${amt} ${token ? token.ticker : cid.toUpperCase()}`;
        })
        .join(', ');

      showToast(`🛒 Куплено: "${itemName}" за ${cost}₽! Получено: ${rewardsList}`);
    } else {
      SoundManager.playFail();
      showToast('Ошибка: Недостаточно рублей для покупки данного товара!');
    }
  };

  // 7. Selling Crypto Assets on exchange manually
  const handleSellTokenManually = (tokenId: string, amount: number) => {
    const token = tokens.find((t) => t.id === tokenId);
    const owned = bitcoinHoldings[tokenId] || 0;
    if (!token || amount <= 0 || owned < amount) {
      SoundManager.playFail();
      showToast('Недостаточно лотов для продажи!');
      return;
    }

    const totalGain = token.price * amount;
    SoundManager.playSuccess();
    setWalletBalance((prev) => prev + totalGain);
    setBitcoinHoldings((prev) => ({
      ...prev,
      [tokenId]: owned - amount,
    }));
    setStats((prev) => ({
      ...prev,
      totalEarned: prev.totalEarned + totalGain,
    }));
    showToast(`Продано ${amount} лотов ${token.ticker} за ${Math.round(totalGain)}₽!`);
  };

  // 8. pick up calls from smartphone
  const handleAnswerCall = () => {
    if (incomingCallCharacter) {
      SoundManager.playClick();
      setActiveDialogueCharacter(incomingCallCharacter);
      setCurrentDialogueNodeId('start');
      setIncomingCallCharacter(null); // Clean ringing screen indicator
      setStats((prev) => ({ ...prev, totalCallsPicked: prev.totalCallsPicked + 1 }));
    }
  };

  // 9. Decline calls
  const handleDeclineCall = () => {
    SoundManager.playClick();
    setIncomingCallCharacter(null);
  };

  // 10. Drink coffee logic
  const handleDrinkCoffee = () => {
    if (caffeine < 100) {
      SoundManager.playSuccess();
      setCaffeine((prev) => Math.min(100, prev + 20));
      setStats((prev) => ({ ...prev, coffeeDrunk: prev.coffeeDrunk + 1 }));
      showToast('☕ ГЛОК-ГЛОК! Кофеиновый буст! Заряд энергии на максимуме (+20% энергии).');
    }
  };

  // 11. Handle Choice click inside Undertale Dialogue Box
  const handleSelectDialogueOption = (option: DialogueOption) => {
    if (!activeDialogueCharacter) return;

    // Apply multiplier cost modifiers depending on seller dialogue paths
    const modifier = option.costModifier !== undefined ? option.costModifier : 1;

    // Execute character buy rewards on the dialouge side
    if (option.type === 'buy') {
      let tokenId = 'kk'; // defaults
      let defaultPriceAtExchange = 100;
      let buyUnits = 5;

      if (activeDialogueCharacter.id === 'zorid') {
        tokenId = 'kk';
        defaultPriceAtExchange = 100;
        buyUnits = 5;
      } else if (activeDialogueCharacter.id === 'kira') {
        tokenId = 'mk';
        defaultPriceAtExchange = 40;
        buyUnits = 10;
      } else if (activeDialogueCharacter.id === 'alex') {
        tokenId = 'ek';
        defaultPriceAtExchange = 120;
        buyUnits = 4;
      } else if (activeDialogueCharacter.id === 'vortex') {
        tokenId = 'tk';
        defaultPriceAtExchange = 50;
        buyUnits = 8;
      } else if (activeDialogueCharacter.id === 'rocket_boss') {
        tokenId = 'rk';
        defaultPriceAtExchange = 300;
        buyUnits = 2;
      } else if (activeDialogueCharacter.id === 'mark') {
        tokenId = 'ek';
        defaultPriceAtExchange = 200;
        buyUnits = 3;
      }

      const currentActualCost = defaultPriceAtExchange * modifier;
      
      // Perform payment deduction
      if (walletBalance >= currentActualCost) {
        SoundManager.playSuccess();
        setWalletBalance((prev) => prev - currentActualCost);
        setBitcoinHoldings((prev) => ({
          ...prev,
          [tokenId]: (prev[tokenId] || 0) + buyUnits,
        }));
        showToast(`УСПЕШНО: Вы выкупили ${buyUnits} лотов по специальной цене!`);
      } else {
        SoundManager.playFail();
        showToast('Отказ: Не хватило рублей!');
        // Terminate call because of insufficient funds
        setActiveDialogueCharacter(null);
        return;
      }
    }

    // Apply reputation change
    if (option.reputationModifier !== undefined) {
      setReputation((prev) => {
        const nextRep = Math.min(100, Math.max(0, prev + option.reputationModifier!));
        if (option.reputationModifier! < 0) {
          showToast(`⚠️ РЕПУТАЦИЯ СНИЗИЛАСЬ: ${option.reputationModifier}% (Итого: ${Math.round(nextRep)}%)`);
        } else if (option.reputationModifier! > 0) {
          showToast(`🌟 РЕПУТАЦИЯ ПОВЫСИЛАСЬ: +${option.reputationModifier}% (Итого: ${Math.round(nextRep)}%)`);
        }
        return nextRep;
      });
    }

    // If next node exists, route to it
    if (option.nextDialogueId) {
      setCurrentDialogueNodeId(option.nextDialogueId);
    } else {
      // End dialogue
      SoundManager.playClick();
      setActiveDialogueCharacter(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-[#fb923c] relative overflow-hidden flex flex-col justify-between">
      {/* Dynamic game layout rendering */}
      <AnimatePresence mode="wait">
        {showMainMenu ? (
          /* MAIN MENU SCREEN */
          <motion.div
            key="mainmenu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#020617] flex flex-col items-center justify-center p-4 overflow-y-auto font-mono text-slate-200"
          >
            {/* Ambient CRT Scanning Lines and Radial Gradients */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,41,59,0.3)_0%,#020617_100%)] pointer-events-none" />

            {/* Glowing Cyber Accent Lights */}
            <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-2xl bg-slate-900/45 border-2 border-slate-800/80 p-6 md:p-10 rounded-3xl backdrop-blur-md shadow-2xl relative z-10 flex flex-col items-center">
              
              {/* Logo/Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wider mb-4 animate-pulse">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>ВЕРСИЯ БИЛДА v2.4.1</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-indigo-400 drop-shadow-[0_4px_12px_rgba(251,146,60,0.15)] select-none">
                  BROKER.OS
                </h1>
                
                <p className="text-xs md:text-sm text-zinc-400 font-sans tracking-wide mt-2 font-medium uppercase">
                  Межгалактический симулятор теневого трейдера
                </p>
              </div>

              {/* Subview router: Main Buttons vs Reset Confirm vs Settings vs Guide */}
              {showResetConfirm ? (
                /* CUSTOM RESET CONFIRMATION SCREEN */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full text-center"
                >
                  <h2 className="text-lg font-bold text-rose-500 border-b border-slate-800 pb-2 mb-6 flex items-center justify-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" /> СБРОС СТАТИСТИКИ И БАЛАНСА
                  </h2>

                  <div className="bg-rose-950/20 border border-rose-900/40 p-5 rounded-2xl text-left mb-6 font-sans text-xs leading-relaxed space-y-3">
                    <p className="text-rose-400 font-extrabold uppercase tracking-wider text-center text-[11px] mb-2 font-mono">
                      ⚠️ ВНИМАНИЕ! КРИТИЧЕСКАЯ ОПЕРАЦИЯ ⚠️
                    </p>
                    <p className="text-stone-300 font-medium">
                      Вы собираетесь уничтожить текущую теневую сессию и стереть все данные из памяти BROKER.OS.
                    </p>
                    <div className="pl-4 border-l-2 border-rose-700/60 space-y-1.5 text-zinc-400 font-mono">
                      <div>• Накопленный баланс: <strong className="text-white">{Math.round(walletBalance)}₽</strong></div>
                      <div>• Будут ликвидированы все крипто-портфели</div>
                      <div>• Репутация вернется к базовым 75%</div>
                      <div>• Уровень защиты файрвола сбросится до 1</div>
                    </div>
                    <p className="text-rose-400 font-semibold pt-1">
                      Это действие абсолютно необратимо. Начать сессию заново?
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        handleStartNewGame();
                      }}
                      className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-xs tracking-wider transition-all border border-rose-500/30 uppercase cursor-pointer hover:shadow-[0_0_15px_rgba(244,63,94,0.25)]"
                    >
                      ДА, НАЧАТЬ ЗАНОВО
                    </button>
                    <button
                      onClick={() => {
                        SoundManager.playClick();
                        setShowResetConfirm(false);
                      }}
                      className="flex-1 py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs tracking-wider transition-all border border-slate-700 uppercase cursor-pointer"
                    >
                      ОТМЕНА
                    </button>
                  </div>
                </motion.div>
              ) : showSettingsInMenu ? (
                /* SETTINGS OVERLAY */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full"
                >
                  <h2 className="text-lg font-bold text-orange-400 border-b border-slate-800 pb-2 mb-6 flex items-center gap-2">
                    <Sliders className="w-5 h-5" /> НАСТРОЙКИ СИСТЕМЫ
                  </h2>

                  {/* Volume Controller */}
                  <div className="mb-8 bg-slate-950/40 p-5 rounded-2xl border border-slate-800/60">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-semibold flex items-center gap-2">
                        {volume > 0 ? (
                          <Volume2 className="w-5 h-5 text-indigo-400" />
                        ) : (
                          <VolumeX className="w-5 h-5 text-zinc-500" />
                        )}
                        Громкость звуковых эффектов
                      </span>
                      <strong className="text-indigo-400 font-mono text-sm">{Math.round(volume * 100)}%</strong>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs text-zinc-500 font-mono">0%</span>
                      <input 
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="flex-1 accent-indigo-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer outline-none border border-slate-700/50"
                      />
                      <span className="text-xs text-zinc-500 font-mono">100%</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-3 font-sans leading-relaxed">
                      * Эффекты генерируются процедурно через Web Audio API. При изменении ползунка прозвучит пробный сигнал.
                    </p>
                  </div>

                  {/* Danger Zone */}
                  <div className="mb-8 bg-rose-950/20 p-5 rounded-2xl border border-rose-900/30">
                    <h3 className="text-rose-400 text-sm font-bold flex items-center gap-2 mb-2">
                      <RefreshCw className="w-4 h-4" /> Сбросить локальную память
                    </h3>
                    <p className="text-zinc-400 text-[11px] mb-4 font-sans leading-relaxed">
                      Это удалит все сбережения (рубли), купленные токены, репутацию и вернет игру в исходное состояние.
                    </p>
                    <button
                      onClick={() => {
                        SoundManager.playClick();
                        setShowSettingsInMenu(false);
                        setShowResetConfirm(true);
                      }}
                      className="w-full py-2.5 rounded-xl bg-rose-900/40 hover:bg-rose-900/80 text-rose-200 border border-rose-700/50 transition-all font-bold text-xs hover:shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                    >
                      СБРОСИТЬ И НАЧАТЬ ЗАНОВО
                    </button>
                  </div>

                  {/* Back to main menu */}
                  <button
                    onClick={() => {
                      SoundManager.playClick();
                      setShowSettingsInMenu(false);
                    }}
                    className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold transition-all border border-slate-700 text-center text-sm"
                  >
                    НАЗАД В МЕНЮ
                  </button>
                </motion.div>
              ) : showHowToPlay ? (
                /* INSTRUCTIONS OVERLAY */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full font-sans text-sm text-zinc-300 leading-relaxed"
                >
                  <h2 className="text-lg font-bold text-[#fb923c] font-mono border-b border-slate-800 pb-2 mb-5 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-[#fb923c]" /> РУКОВОДСТВО ДЛЯ БРОКЕРА
                  </h2>

                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                    <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60 font-sans">
                      <strong className="text-slate-100 font-mono text-xs block uppercase mb-1">📈 Торговля на бирже</strong>
                      Покупайте недооцененные крипто-активы на вкладках терминала и продавайте их с наценкой, когда график идет вверх.
                    </div>

                    <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60 font-sans">
                      <strong className="text-slate-100 font-mono text-xs block uppercase mb-1">📞 Входящие звонки</strong>
                      Отвечайте на звонки и ведите переговоры. Опции диалогов влияют на репутацию и цены сделок. Показывайте харизму и вежливость!
                    </div>

                    <div className="bg-indigo-950/20 p-3.5 rounded-xl border border-indigo-900/30 font-sans">
                      <strong className="text-indigo-400 font-mono text-xs block uppercase mb-1">🌟 Репутация</strong>
                      Репутация определяет ваше положение. Вежливый тон укрепляет рейтинг, а грубые ответы превратят вас в изгоя, ухудшив условия на теневом рынке.
                    </div>

                    <div className="bg-rose-950/10 p-3.5 rounded-xl border border-rose-900/30 font-sans">
                      <strong className="text-rose-400 font-mono text-xs block uppercase mb-1">💻 Отражение кибератак</strong>
                      Хакеры регулярно штурмуют ваш файрвол. При взломе вводите зашифрованные комбинации, чтобы защитить свои рубли, или вовремя улучшайте файрвол.
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      SoundManager.playClick();
                      setShowHowToPlay(false);
                    }}
                    className="w-full mt-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold transition-all border border-slate-700 text-center text-sm font-mono"
                  >
                    ПОНЯЛ, НАЗАД
                  </button>
                </motion.div>
              ) : (
                /* GENERAL BUTTONS */
                <div className="w-full flex flex-col gap-3.5">
                  {/* Button: Continue / Start Game */}
                  {localStorage.getItem('crypto_office_balance') ? (
                    <button
                      onClick={() => {
                        SoundManager.playSuccess();
                        setShowMainMenu(false);
                      }}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-center text-sm tracking-wider uppercase border border-emerald-400/30 transition-all hover:scale-[1.02] shadow-[0_4px_15px_rgba(16,185,129,0.25)] flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-white animate-bounce" /> ПРОДОЛЖИТЬ РАБОТУ ({Math.round(walletBalance)}₽)
                    </button>
                  ) : null}

                  <button
                    onClick={() => {
                      SoundManager.playClick();
                      if (localStorage.getItem('crypto_office_balance')) {
                        setShowResetConfirm(true);
                      } else {
                        handleStartNewGame();
                      }
                    }}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-extrabold text-center text-sm tracking-wider uppercase border border-orange-400/30 transition-all hover:scale-[1.02] shadow-[0_4px_15px_rgba(249,115,22,0.2)] flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-slate-950" /> НАЧАТЬ СЕССИЮ С ЧИСТОГО ЛИСТА
                  </button>

                  {/* Button: Settings */}
                  <button
                    onClick={() => {
                      SoundManager.playClick();
                      setShowSettingsInMenu(true);
                    }}
                    className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-center text-sm tracking-wide transition-all border border-slate-700/80 flex items-center justify-center gap-2"
                  >
                    <Settings className="w-4 h-4" /> НАСТРОЙКИ ЗВУКА И СИСТЕМЫ
                  </button>

                  {/* Button: Guide */}
                  <button
                    onClick={() => {
                      SoundManager.playClick();
                      setShowHowToPlay(true);
                    }}
                    className="w-full py-3.5 px-6 rounded-2xl bg-slate-800/40 hover:bg-slate-800/80 text-slate-300 font-bold text-center text-sm tracking-wide transition-all border border-slate-800 flex items-center justify-center gap-2"
                  >
                    <HelpCircle className="w-4 h-4" /> ИНСТРУКЦИЯ И ОБУЧЕНИЕ
                  </button>

                  {/* Aesthetic quote */}
                  <div className="mt-8 text-center text-[10px] text-zinc-500 leading-relaxed max-w-sm select-none">
                    «Покупай на слухах, продавай на фактах. Остерегайся теневых регуляторов и хакеров.»
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : activeDialogueCharacter ? (
          /* FULL SCREEN UNDERTALE DIALOGUE STYLING */
          <motion.div
            key="dialogue"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4 md:p-10 font-mono"
          >
            {/* Dark cozy halo behind dialogue */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(18,16,16,0.85)_0%,#000000_100%)] pointer-events-none" />

            {/* Retro title bar */}
            <div className="mb-6 text-center select-none z-10">
              <span className="text-[11px] uppercase tracking-widest text-zinc-500 block">Разговор по защищенному спутнику</span>
              <h2 className="text-[#fb923c] text-sm font-bold flex items-center justify-center gap-2 mt-1">
                <span className="animate-pulse">♥</span> АКТИВНОЕ СОЕДИНЕНИЕ <span className="animate-pulse">♥</span>
              </h2>
            </div>

            {/* Main dialogue box container wrapper */}
            <div className="w-full max-w-4xl z-10 flex flex-col gap-4">
              <DialogueBox
                character={activeDialogueCharacter}
                currentNodeId={currentDialogueNodeId}
                onSelectOption={handleSelectDialogueOption}
                walletBalance={walletBalance}
              />

              {/* Little detail info indicator at bottom */}
              <div className="flex justify-between items-center text-[10px] text-zinc-500 px-3 select-none">
                <span>* Нажмите в любом месте диалога для моментальной прокрутки текста</span>
                <span className="text-emerald-400 font-bold">Баланс: {Math.round(walletBalance)}₽</span>
              </div>
            </div>
          </motion.div>
        ) : (
          /* WORKSPACE RETRO DESK SCREEN */
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 select-none"
          >
            <DeskSetup
              tokens={tokens}
              walletBalance={walletBalance}
              bitcoinHoldings={bitcoinHoldings}
              news={news}
              hackerAttack={hackerAttack}
              firewallLevel={firewallLevel}
              stats={stats}
              incomingCallCharacter={incomingCallCharacter}
              onAnswerCall={handleAnswerCall}
              onDeclineCall={handleDeclineCall}
              onBuyToken={handleBuyTokenManually}
              onSellToken={handleSellTokenManually}
              onUpgradeFirewall={handleUpgradeFirewall}
              onResolveHack={handleResolveHack}
              onDrinkCoffee={handleDrinkCoffee}
              caffeine={caffeine}
              onBuyMarketItem={handleBuyMarketItem}
              marketItems={marketItems}
              marketRefreshTimeLeft={marketRefreshTimeLeft}
              reputation={reputation}
              onOpenMainMenu={() => setShowMainMenu(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Game Notification alerts */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-stone-900 border-2 border-amber-500/80 shadow-[0_10px_30px_rgba(245,158,11,0.25)] flex items-center gap-3.5 max-w-sm font-mono text-xs select-none backdrop-blur-md"
          >
            <div className="p-2 bg-amber-950 text-amber-400 rounded-lg border border-amber-600/30">
              <Info className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1">
              <span className="font-extrabold uppercase text-amber-400 block tracking-wider">Оповещение брокера</span>
              <p className="text-stone-200 mt-0.5 leading-relaxed font-semibold">{toastMessage}</p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-stone-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

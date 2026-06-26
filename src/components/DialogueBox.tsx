import React, { useState, useEffect, useRef } from 'react';
import { CallCharacter, DialogueNode, DialogueOption } from '../types';
import { SoundManager } from './SoundManager';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Volume2, VolumeX, MessageSquareCode } from 'lucide-react';

interface DialogueBoxProps {
  character: CallCharacter;
  currentNodeId: string;
  onSelectOption: (option: DialogueOption) => void;
  walletBalance: number;
}

export default function DialogueBox({
  character,
  currentNodeId,
  onSelectOption,
  walletBalance,
}: DialogueBoxProps) {
  const [typedText, setTypedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [shakeAvatar, setShakeAvatar] = useState(false);

  const node = character.greetingNodes.find((n) => n.id === currentNodeId) || character.greetingNodes[0];
  const fullText = node.text;

  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const letterIndexRef = useRef(0);

  useEffect(() => {
    // Reset typing state on node change
    setTypedText('');
    setIsTypingComplete(false);
    letterIndexRef.current = 0;

    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
    }

    const typeLetter = () => {
      if (letterIndexRef.current < fullText.length) {
        const nextChar = fullText[letterIndexRef.current];
        setTypedText((prev) => prev + nextChar);

        // Sound bleep (not for space/newlines)
        if (soundEnabled && nextChar !== ' ' && nextChar !== '\n' && nextChar !== '*') {
          SoundManager.playBleep(character.bleepPitch, character.bleepType, 0.05);
        }

        // Randomly shake avatar on talking
        if (Math.random() > 0.85) {
          setShakeAvatar(true);
          setTimeout(() => setShakeAvatar(false), 80);
        }

        letterIndexRef.current += 1;
      } else {
        setIsTypingComplete(true);
        if (typingTimerRef.current) {
          clearInterval(typingTimerRef.current);
        }
      }
    };

    typingTimerRef.current = setInterval(typeLetter, character.dialogueSpeed);

    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
      }
    };
  }, [currentNodeId, fullText, character, soundEnabled]);

  const handleSkipTyping = () => {
    if (!isTypingComplete) {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
      }
      setTypedText(fullText);
      setIsTypingComplete(true);
      SoundManager.playClick();
    }
  };

  // Render character portrait as pixel-style SVG vector
  const renderAvatarSVG = () => {
    switch (character.id) {
      case 'rocket_boss':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Dark background matrix glow */}
            <rect width="100" height="100" fill="#1e1e2f" rx="10" />
            
            {/* Purple hoodie cowl / background hood */}
            <ellipse cx="50" cy="54" rx="34" ry="36" fill="#6b21a8" stroke="black" strokeWidth="4" />
            <circle cx="50" cy="50" r="28" fill="#5b21b6" />
            
            {/* Muscular Lime-Green Chest definition */}
            <path d="M 30,82 Q 50,75 70,82 L 72,100 L 28,100 Z" fill="#b5e215" stroke="black" strokeWidth="3" />
            {/* Chest striations */}
            <path d="M 46,80 L 46,100" stroke="#84a600" strokeWidth="2.5" />
            <path d="M 54,80 L 54,100" stroke="#84a600" strokeWidth="2.5" />
            <path d="M 38,88 Q 50,85 62,88" fill="none" stroke="#84a600" strokeWidth="2" />

            {/* Glowing neon-green round alien head (No ears! No nose!) */}
            <ellipse cx="50" cy="40" rx="26" ry="25" fill="#c4f114" stroke="black" strokeWidth="4" />
            
            {/* Large glossy slanted black alien eyes */}
            <g transform="translate(50, 40)">
              {/* Left Eye */}
              <ellipse cx="-11" cy="-2" rx="7" ry="11" transform="rotate(-15 -11 -2)" fill="black" />
              <circle cx="-13" cy="-5" r="2" fill="white" />
              {/* Right Eye */}
              <ellipse cx="11" cy="-2" rx="7" ry="11" transform="rotate(15 11 -2)" fill="black" />
              <circle cx="9" cy="-5" r="2" fill="white" />
            </g>

            {/* Warm confident human teeth smile */}
            <path d="M 40,51 Q 50,58 60,51" fill="none" stroke="black" strokeWidth="3.5" />
            <path d="M 42,51 Q 50,55 58,51 Z" fill="white" stroke="black" strokeWidth="1.5" />

            {/* Purple Zipped Vest Hood edges */}
            <path d="M 24,76 C 24,76 34,70 38,82" fill="none" stroke="#7e22ce" strokeWidth="5.5" strokeLinecap="round" />
            <path d="M 76,76 C 76,76 66,70 62,82" fill="none" stroke="#7e22ce" strokeWidth="5.5" strokeLinecap="round" />
            {/* White Hoodie Drawstring cords */}
            <line x1="38" y1="80" x2="38" y2="94" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <line x1="62" y1="80" x2="62" y2="94" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'alex':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" fill="#0f172a" rx="10" />
            {/* Advisor Suit */}
            <path d="M 20,80 L 80,80 L 80,100 L 20,100 Z" fill="#1e293b" />
            {/* White Shirt & Red Tie */}
            <polygon points="50,80 40,100 60,100" fill="white" />
            <polygon points="50,84 46,100 54,100" fill="#ef4444" />
            {/* Face */}
            <rect x="32" y="30" width="36" height="38" rx="8" fill="#fbcfe8" stroke="black" strokeWidth="3" />
            {/* Trader Headset */}
            <rect x="28" y="42" width="6" height="14" rx="2" fill="#ef4444" />
            <path d="M 32,32 Q 50,18 68,32" fill="none" stroke="#ef4444" strokeWidth="3.5" />
            {/* Mic boom */}
            <path d="M 32,52 L 44,56" fill="none" stroke="black" strokeWidth="2.5" />
            <circle cx="44" cy="56" r="2.5" fill="#ef4444" />
            {/* Hair */}
            <path d="M 30,34 L 70,34 L 66,24 L 34,24 Z" fill="#78350f" />
            {/* Friendly Glasses */}
            <rect x="36" y="40" width="10" height="8" rx="1.5" fill="rgba(6,182,212,0.4)" stroke="black" strokeWidth="2" />
            <rect x="54" y="40" width="10" height="8" rx="1.5" fill="rgba(6,182,212,0.4)" stroke="black" strokeWidth="2" />
            <line x1="46" y1="44" x2="54" y2="44" stroke="black" strokeWidth="2" />
            {/* Confident Smile */}
            <path d="M 45,58 Q 50,62 55,58" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );

      case 'zorid':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" fill="#1e1b4b" rx="10" />
            {/* Metallic Suit */}
            <path d="M 15,82 Q 50,72 85,82 L 85,100 L 15,100 Z" fill="#334155" stroke="black" strokeWidth="3" />
            {/* Face */}
            <rect x="30" y="24" width="40" height="42" rx="12" fill="#fed7aa" stroke="black" strokeWidth="3" />
            {/* Cybernetic eye and headset */}
            <rect x="25" y="40" width="8" height="16" rx="2" fill="#22d3ee" stroke="black" strokeWidth="2" />
            {/* Cyber Visor Plate */}
            <rect x="35" y="32" width="30" height="12" rx="3" fill="#0f172a" stroke="black" strokeWidth="2.5" />
            <motion.circle
              cx="50"
              cy="38"
              r="3.5"
              animate={{ fill: ['#00ffff', '#fbbf24', '#00ffff'] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
            {/* Mining beard / Cyber parts */}
            <path d="M 32,58 Q 50,75 68,58" fill="none" stroke="#22d3ee" strokeWidth="4" />
            <line x1="50" y1="58" x2="50" y2="65" stroke="black" strokeWidth="2" />
            {/* Smile under mask */}
            <path d="M 44,53 Q 50,56 56,53" fill="none" stroke="black" strokeWidth="2.5" />
          </svg>
        );

      case 'vortex':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" fill="#022c22" rx="10" />
            {/* Futuristic Tech Gear Jacket */}
            <path d="M 18,78 Q 50,68 82,78 L 82,100 L 18,100 Z" fill="#065f46" stroke="black" strokeWidth="3" />
            <rect x="42" y="78" width="16" height="22" fill="#022c22" />
            <line x1="50" y1="78" x2="50" y2="100" stroke="#34d399" strokeWidth="2" />
            {/* Tech head */}
            <rect x="28" y="22" width="44" height="46" rx="10" fill="#34d399" stroke="black" strokeWidth="3.5" />
            {/* Neon Visor Shield */}
            <rect x="22" y="32" width="56" height="16" rx="4" fill="#052e16" stroke="#34d399" strokeWidth="3" />
            <line x1="26" y1="40" x2="74" y2="40" stroke="#34d399" strokeWidth="2" />
            {/* Circuit pattern details */}
            <line x1="36" y1="22" x2="36" y2="28" stroke="black" strokeWidth="2" />
            <line x1="64" y1="22" x2="64" y2="28" stroke="black" strokeWidth="2" />
            {/* Mechanical smile indicator */}
            <path d="M 43,58 H 57" stroke="black" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );

      case 'kira':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" fill="#4d0c2e" rx="10" />
            {/* Bright pink hair buns */}
            <circle cx="26" cy="24" r="13" fill="#ec4899" stroke="black" strokeWidth="3" />
            <circle cx="74" cy="24" r="13" fill="#ec4899" stroke="black" strokeWidth="3" />
            {/* Soft pink suit */}
            <path d="M 22,82 Q 50,70 78,82 L 78,100 L 22,100 Z" fill="#ec4899" stroke="black" strokeWidth="3" />
            <path d="M 38,80 L 50,94 L 62,80" fill="#fc82c3" />
            {/* Cute Face */}
            <rect x="28" y="28" width="44" height="44" rx="14" fill="#ffedd5" stroke="black" strokeWidth="3.5" />
            {/* Anime eyes */}
            <ellipse cx="40" cy="45" r="4.5" ry="6" fill="#1e1b4b" stroke="black" strokeWidth="2" />
            <circle cx="38" cy="42" r="1.5" fill="white" />
            <ellipse cx="60" cy="45" r="4.5" ry="6" fill="#1e1b4b" stroke="black" strokeWidth="2" />
            <circle cx="58" cy="42" r="1.5" fill="white" />
            {/* Cheerful blushing cheeks */}
            <ellipse cx="34" cy="54" rx="4" ry="2" fill="#fda4af" />
            <ellipse cx="66" cy="54" rx="4" ry="2" fill="#fda4af" />
            {/* Sweet Cat Smile */}
            <path d="M 46,55 Q 50,58 54,55" fill="none" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        );

      case 'mark':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" fill="#1e293b" rx="10" />
            {/* Elite charcoal coat */}
            <path d="M 16,80 L 84,80 L 84,100 L 16,100 Z" fill="#334155" />
            {/* Crimson tie */}
            <polygon points="50,80 43,100 57,100" fill="white" />
            <polygon points="50,83 47,100 53,100" fill="#991b1b" />
            {/* Professional face */}
            <rect x="30" y="26" width="40" height="42" rx="8" fill="#ffedd5" stroke="black" strokeWidth="3.5" />
            {/* Silver hair */}
            <path d="M 28,28 Q 50,14 72,28 L 68,20 H 32 Z" fill="#e2e8f0" stroke="black" strokeWidth="3" />
            {/* Confident business eyes */}
            <circle cx="41" cy="38" r="2.5" fill="black" />
            <circle cx="59" cy="38" r="2.5" fill="black" />
            {/* Glasses wire */}
            <rect x="36" y="34" width="28" height="8" rx="1" fill="none" stroke="black" strokeWidth="1.5" opacity="0.8" />
            {/* Subtle smile */}
            <path d="M 44,53 Q 50,56 56,53" fill="none" stroke="black" strokeWidth="2.5" />
          </svg>
        );

      default:
        return (
          <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-white rounded">
            <MessageSquareCode className="w-12 h-12" />
          </div>
        );
    }
  };

  return (
    <div
      onClick={handleSkipTyping}
      className="p-6 md:p-8 bg-neutral-950 border-4 border-white outline outline-4 outline-neutral-950 outline-offset-2 rounded-2xl select-none cursor-pointer flex flex-col md:flex-row gap-8 items-center flex-1 h-full shadow-[0_0_40px_rgba(255,255,255,0.12)] relative overflow-hidden"
    >
      {/* Background terminal glare and phosphor grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)] pointer-events-none" />
      <div className="crt-scanlines pointer-events-none absolute inset-0 z-10 opacity-[0.04] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px]" />

      {/* Control panel buttons inside dialogue */}
      <div className="absolute top-4 right-4 flex items-center gap-3 z-20" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="text-zinc-500 hover:text-white p-1.5 rounded-lg border border-zinc-800 bg-neutral-900/60 transition-all"
          title={soundEnabled ? 'Выключить звук кликов' : 'Включить звук кликов'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-[#fde047]" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Decorative top tab helper */}
      <div className="absolute top-0 left-8 bg-white text-black px-4 py-0.5 rounded-b font-mono text-[9px] uppercase tracking-wider font-extrabold z-10">
        Линия связи: Активна
      </div>

      {/* Retro Character Graphic */}
      <div className="flex-shrink-0 flex flex-col items-center gap-3 z-10 mt-2 md:mt-0">
        <motion.div
          animate={shakeAvatar ? { x: [-3, 3, -3, 3, 0] } : {}}
          transition={{ duration: 0.15 }}
          className="w-28 h-28 md:w-36 md:h-36 bg-black border-4 border-white p-2 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-[inset_0_0_20px_rgba(255,255,255,0.15)]"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#ffffff]/10 to-transparent pointer-events-none" />
          {renderAvatarSVG()}
        </motion.div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Продавец коинов</span>
          <span className="text-md font-mono text-[#fde047] uppercase font-black tracking-widest">{character.name}</span>
        </div>
      </div>

      {/* Dialogue Content */}
      <div className="flex-1 flex flex-col justify-between w-full h-full min-h-[160px] z-10">
        {/* Animated Typewriter Text */}
        <div className="font-mono text-white text-base md:text-lg leading-relaxed mb-6 whitespace-pre-wrap min-h-[80px]">
          {typedText}
          {!isTypingComplete && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2.5 h-5 bg-white ml-1 align-middle"
            />
          )}
        </div>

        {/* Options Selection Panel */}
        <AnimatePresence>
          {isTypingComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              onClick={(e) => e.stopPropagation()} // Stop propagation so it doesn't trigger skip click
            >
              {node.options.map((option, index) => {
                // Check if player has enough money to buy
                const isBuy = option.type === 'buy';
                const modifier = option.costModifier !== undefined ? option.costModifier : 1;
                // Cost calculation
                let cost = 0;
                if (character.id === 'zorid') cost = 100 * modifier;
                else if (character.id === 'kira') cost = 40 * modifier;
                else if (character.id === 'alex') cost = 120 * modifier;
                else if (character.id === 'vortex') cost = 50 * modifier;
                else if (character.id === 'rocket_boss') cost = 300 * modifier;
                else if (character.id === 'mark') cost = 200 * modifier;

                const hasEnoughMoney = !isBuy || walletBalance >= cost;

                return (
                  <button
                    key={index}
                    disabled={isBuy && !hasEnoughMoney}
                    onClick={() => {
                       SoundManager.playClick();
                       onSelectOption(option);
                    }}
                    className={`p-3.5 border-2 border-white rounded-xl text-left font-mono text-xs md:text-sm transition-all flex items-center gap-3 group relative overflow-hidden select-none hover:bg-white hover:text-black ${
                      isBuy && !hasEnoughMoney
                        ? 'opacity-35 cursor-not-allowed border-zinc-700 text-zinc-600 hover:bg-transparent hover:text-zinc-600'
                        : 'cursor-pointer text-white'
                    }`}
                  >
                    {/* Retro undertale heart selector */}
                    <div className="w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <Heart className="w-4 h-4 text-[#ef4444] fill-[#ef4444] animate-pulse" />
                    </div>

                    <span className="flex-1 font-bold">
                      {option.text}
                    </span>

                    {/* Price Tag if applicable */}
                    {isBuy && cost > 0 && (
                      <span className={`text-[10px] md:text-xs font-mono font-extrabold px-2 py-0.5 rounded border border-white/20 group-hover:border-black/40 ${
                        hasEnoughMoney ? 'text-green-400 bg-green-950/40 group-hover:text-green-800 group-hover:bg-green-100/40' : 'text-rose-400 bg-rose-950/40 group-hover:text-rose-700 group-hover:bg-rose-100/40'
                      }`}>
                        {Math.round(cost)}₽
                      </span>
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

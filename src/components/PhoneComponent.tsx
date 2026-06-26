import React from 'react';
import { CallCharacter } from '../types';
import { motion } from 'motion/react';
import { Phone, PhoneCall, PhoneOff, Compass, ShieldAlert, Cpu, Wallet, Clock } from 'lucide-react';

interface PhoneComponentProps {
  incomingCallCharacter: CallCharacter | null;
  onAnswerCall: () => void;
  onDeclineCall: () => void;
}

export default function PhoneComponent({
  incomingCallCharacter,
  onAnswerCall,
  onDeclineCall,
}: PhoneComponentProps) {
  const isRinging = !!incomingCallCharacter;

  return (
    <motion.div
      animate={isRinging ? {
        x: [-2.5, 2.5, -2.5, 2.5, 0],
        y: [-1, 1, -1, 1, 0],
        rotate: [-0.8, 0.8, -0.8, 0.8, 0]
      } : {}}
      transition={isRinging ? { repeat: Infinity, duration: 0.12 } : {}}
      className={`w-[245px] h-[490px] bg-zinc-950 border-[6px] ${
        isRinging ? 'border-red-500 shadow-[0_0_35px_rgba(239,68,68,0.5)]' : 'border-zinc-800 shadow-2xl'
      } rounded-[48px] p-2 flex flex-col relative overflow-hidden select-none`}
    >
      {/* Phone cut-out speaker notch (Modern smartphone style) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-black rounded-full z-40 flex items-center justify-between px-3">
        <div className="w-10 h-1 bg-zinc-800 rounded-full" />
        <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full border border-zinc-800 flex items-center justify-center">
          <div className="w-1 h-1 bg-cyan-900 rounded-full" />
        </div>
      </div>

      {/* Screen area (Edge to edge glass look) */}
      <div className={`flex-1 rounded-[40px] border overflow-hidden flex flex-col p-4 justify-between relative transition-all duration-300 ${
        isRinging
          ? 'bg-gradient-to-b from-stone-950 via-rose-950/20 to-stone-950 border-rose-500/80'
          : 'bg-gradient-to-b from-slate-900 via-slate-950 to-zinc-950 border-zinc-800'
      }`}>
        {/* Ringing status soundwaves background */}
        {isRinging && (
          <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center z-0">
            <div className="w-44 h-44 rounded-full border-2 border-red-500/50 animate-ping absolute" />
            <div className="w-32 h-32 rounded-full border-2 border-red-500/30 animate-ping absolute" style={{ animationDelay: '0.4s' }} />
          </div>
        )}

        {/* Top bar */}
        <div className="flex justify-between items-center text-[10px] text-zinc-400 font-mono shrink-0 z-10 pt-3">
          <span className="font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            LTE
          </span>
          <span>100% 🔋</span>
        </div>

        {/* Dynamic Display Area */}
        <div className="flex-1 flex flex-col justify-center items-center py-4 z-10 w-full">
          {isRinging ? (
            /* INCOMING CALL VIEW */
            <div className="flex flex-col items-center justify-center w-full">
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-white mb-4 shadow-xl shadow-red-900/35 border-2 border-red-400/30"
              >
                <PhoneCall className="w-9 h-9" />
              </motion.div>
              <div className="text-[10px] bg-red-500/20 text-red-400 font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-red-500/30 tracking-widest animate-pulse mb-3">
                ВХОДЯЩИЙ ЗВОНОК
              </div>
              <h4 className="text-white font-mono font-extrabold text-base tracking-wide truncate max-w-[170px] text-center mb-1">
                {incomingCallCharacter.name}
              </h4>
              <p className="text-xs text-zinc-400 font-mono">Шифрованная линия</p>
            </div>
          ) : (
            /* SMARTPHONE HOMESCREEN VIEW (Sensor Touch UI with beautiful interactive app widgets) */
            <div className="w-full h-full flex flex-col justify-between pt-2">
              {/* Dynamic digital Clock Widget */}
              <div className="text-center font-mono py-1.5 bg-slate-900/50 border border-slate-800/40 rounded-2xl p-2 mb-3">
                <div className="text-xs text-cyan-400 font-bold flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> СЕНСОР
                </div>
                <div className="text-white font-black text-sm tracking-widest mt-1">10:52 UTC</div>
                <div className="text-[9px] text-zinc-500 mt-0.5">ОЖИДАНИЕ СДЕЛКИ</div>
              </div>

              {/* Grid of Sensortouch Apps */}
              <div className="grid grid-cols-2 gap-3 flex-1 items-center justify-center px-1">
                <div className="flex flex-col items-center p-2 rounded-xl bg-slate-900/30 border border-slate-800/40 hover:bg-slate-900/60 active:scale-95 transition-all cursor-pointer">
                  <Wallet className="w-5 h-5 text-emerald-400 mb-1" />
                  <span className="text-[9px] text-zinc-400 font-mono font-semibold">Холдинг</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-xl bg-slate-900/30 border border-slate-800/40 hover:bg-slate-900/60 active:scale-95 transition-all cursor-pointer">
                  <Cpu className="w-5 h-5 text-cyan-400 mb-1" />
                  <span className="text-[9px] text-zinc-400 font-mono font-semibold">Майнинг</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-xl bg-slate-900/30 border border-slate-800/40 hover:bg-slate-900/60 active:scale-95 transition-all cursor-pointer">
                  <ShieldAlert className="w-5 h-5 text-rose-400 mb-1" />
                  <span className="text-[9px] text-zinc-400 font-mono font-semibold">Угрозы</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-xl bg-slate-900/30 border border-slate-800/40 hover:bg-slate-900/60 active:scale-95 transition-all cursor-pointer">
                  <Compass className="w-5 h-5 text-amber-400 mb-1" />
                  <span className="text-[9px] text-zinc-400 font-mono font-semibold">Радар</span>
                </div>
              </div>

              <div className="text-center text-[9px] text-zinc-600 font-mono mt-2 tracking-wide uppercase">
                Смахните вверх
              </div>
            </div>
          )}
        </div>

        {/* Sound option indicator or Call Controls */}
        <div className="w-full z-10 shrink-0">
          {isRinging ? (
            /* SENSOR CALL ACCEPT/DECLINE CONTROLS */
            <div className="grid grid-cols-2 gap-3.5 pt-2 pb-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAnswerCall}
                className="flex flex-col items-center justify-center py-2.5 px-3 rounded-2xl bg-emerald-500 text-black hover:bg-emerald-400 active:bg-emerald-600 transition-all cursor-pointer font-mono text-[11px] font-black tracking-wider shadow-lg shadow-emerald-500/20 border border-emerald-400"
              >
                <PhoneCall className="w-4.5 h-4.5 mb-1 text-black" />
                <span>ОТВЕТИТЬ</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onDeclineCall}
                className="flex flex-col items-center justify-center py-2.5 px-3 rounded-2xl bg-rose-600 text-white hover:bg-rose-500 active:bg-rose-700 transition-all cursor-pointer font-mono text-[11px] font-black tracking-wider shadow-lg shadow-rose-600/25 border border-rose-500"
              >
                <PhoneOff className="w-4.5 h-4.5 mb-1 text-white" />
                <span>ОТКЛОНИТЬ</span>
              </motion.button>
            </div>
          ) : (
            /* SCREEN HUD BAR (Modern swipe home indicators) */
            <div className="flex justify-center py-1">
              <div className="w-20 h-1 bg-zinc-700 rounded-full animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

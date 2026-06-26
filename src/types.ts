export interface Token {
  id: string;
  name: string;
  ticker: string;
  price: number;
  history: number[];
  color: string;
  bgLight: string;
  borderClass: string;
  description: string;
}

export type DialogueOptionType = 'buy' | 'sell' | 'bargain' | 'hangup' | 'compromise' | 'joke';

export interface DialogueOption {
  text: string;
  type: DialogueOptionType;
  costModifier?: number; // E.g. buy with discount
  sellModifier?: number; // E.g. sell with premium
  nextDialogueId?: string;
  effect?: (state: any) => void;
  reputationModifier?: number; // E.g. rude decreases, polite increases
}

export interface DialogueNode {
  id: string;
  text: string;
  options: DialogueOption[];
}

export type CharacterId = 'rocket_boss' | 'alex' | 'zorid' | 'vortex' | 'kira' | 'mark' | 'hacker';

export interface CallCharacter {
  id: CharacterId;
  name: string;
  avatar: string; // SVG or ASCII Art / Custom graphic rendered dynamically
  dialogueSpeed: number; // ms per letter
  bleepPitch: number; // Hz for voice synth
  bleepType: 'sine' | 'square' | 'sawtooth' | 'triangle';
  greetingNodes: DialogueNode[];
}

export interface NewsItem {
  id: string;
  text: string;
  impactType: 'positive' | 'negative' | 'neutral';
  impactTokenId: string;
  intensity: number; // how much it forces price to change
  timestamp: string;
}

export interface HackerAttackState {
  isActive: boolean;
  timeLeft: number; // seconds to resolve or risk penalty
  targetWalletSeed: string; // the player must prevent cracking
  attemptsLeft: number;
  currentCode: string[]; // sequence of numbers/keys to match
  correctSequence: string[];
  threatLevel: 'low' | 'medium' | 'high';
}

export interface MarketItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  iconName: 'usb' | 'disc' | 'package' | 'harddrive' | 'cpu' | 'gift';
  rewards: Record<string, number>;
  badge?: string;
  color: string;
  rating: number; // 10 to 100
  reviews: string[];
  isScam: boolean;
  scamChance: number; // 100 - rating
}

import { create } from 'zustand';
import { LeadData } from '../types';

interface PrizeResult {
  prizeId: string;
  prizeName: string;
  gameType: string;
}

interface LeadSessionState {
  leadId: number | string | null;
  leadData: Partial<LeadData> | null;
  prizeResult: PrizeResult | null;
  gameType: string | null;
  startSession: (leadId: number | string, leadData: LeadData) => void;
  setPrizeResult: (result: PrizeResult) => void;
  setGameType: (gameType: string | null) => void;
  clearSession: () => void;
}

export const useLeadSessionStore = create<LeadSessionState>((set) => ({
  leadId: null,
  leadData: null,
  prizeResult: null,
  gameType: null,
  startSession: (leadId, leadData) =>
    set({ leadId, leadData, prizeResult: null, gameType: leadData.game_selected ?? null }),
  setPrizeResult: (result) => set({ prizeResult: result }),
  setGameType: (gameType) => set({ gameType }),
  clearSession: () => set({ leadId: null, leadData: null, prizeResult: null, gameType: null })
}));

export default useLeadSessionStore;

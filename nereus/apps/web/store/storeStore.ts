import {create} from "zustand";
export type market={
    pid:number
}
export const useStore = create((set, get) => ({
    marketList: [],
    
}));

// Optional selectors for convenience:

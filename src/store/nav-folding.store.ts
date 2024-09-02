import React from "react";
import { create } from "zustand";

interface NavFoldingStore {
    isFolding: boolean;
    setFolding: (isFolding:boolean) => void;
}

const useNavFoldingStore = create<NavFoldingStore>(set => ({
    isFolding: true,
    setFolding: isFolding => set(state => ({...state, isFolding}))
}));

export default useNavFoldingStore;
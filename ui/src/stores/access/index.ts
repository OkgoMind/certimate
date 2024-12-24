﻿import { create } from "zustand";
import { produce } from "immer";

import { type AccessModel } from "@/domain/access";
import { list as listAccess, save as saveAccess, remove as removeAccess } from "@/repository/access";

export interface AccessState {
  accesses: AccessModel[];
  loading: boolean;
  loadedAtOnce: boolean;

  fetchAccesses: () => Promise<void>;
  createAccess: (access: MaybeModelRecord<AccessModel>) => Promise<void>;
  updateAccess: (access: MaybeModelRecordWithId<AccessModel>) => Promise<void>;
  deleteAccess: (access: MaybeModelRecordWithId<AccessModel>) => Promise<void>;
}

export const useAccessStore = create<AccessState>((set) => {
  let fetcher: Promise<AccessModel[]> | null = null; // 防止多次重复请求

  return {
    accesses: [],
    loading: false,
    loadedAtOnce: false,

    createAccess: async (access) => {
      const record = await saveAccess(access);

      set(
        produce((state: AccessState) => {
          state.accesses.unshift(record);
        })
      );
    },

    updateAccess: async (access) => {
      const record = await saveAccess(access);

      set(
        produce((state: AccessState) => {
          const index = state.accesses.findIndex((e) => e.id === record.id);
          if (index !== -1) {
            state.accesses[index] = record;
          }
        })
      );
    },

    deleteAccess: async (access) => {
      await removeAccess(access);

      set(
        produce((state: AccessState) => {
          state.accesses = state.accesses.filter((a) => a.id !== access.id);
        })
      );
    },

    fetchAccesses: async () => {
      fetcher ??= listAccess();

      try {
        set({ loading: true });
        const accesses = await fetcher;
        set({ accesses: accesses ?? [], loadedAtOnce: true });
      } finally {
        fetcher = null;
        set({ loading: false });
      }
    },
  };
});

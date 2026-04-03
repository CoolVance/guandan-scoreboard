import type { ScoreboardStorage } from '../types/storage';

const STORAGE_KEY = 'scoreboard_v5';

/**
 * Persistence Adapter for Scoreboard
 * Provides a type-safe and centralized way to interact with localStorage.
 */
export const storageAdapter = {
  /**
   * Retrieves the full storage object.
   */
  get(): ScoreboardStorage {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Failed to parse storage data", e);
      return {};
    }
  },

  /**
   * Overwrites the entire storage object.
   */
  set(data: ScoreboardStorage): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save storage data", e);
    }
  },

  /**
   * Partially updates the storage object by merging new values.
   * This is the preferred method to prevent data loss across different modules.
   */
  update(partial: Partial<ScoreboardStorage>): ScoreboardStorage {
    const current = this.get();
    const newData = { ...current, ...partial };
    this.set(newData);
    return newData;
  },

  /**
   * Clears all scoreboard data.
   */
  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
};

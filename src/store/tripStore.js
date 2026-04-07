import { create } from 'zustand';
import { getItemById, keralaTripTemplate } from '../data/mockData';

/**
 * Trippy Global State (Zustand)
 *
 * savedTrips  – Array of trip objects (status: 'planning' | 'booked')
 * activeTripId – ID of the trip currently being viewed / edited
 * locks       – { lockKey: itemId } tracking user-confirmed items
 */
const useTripStore = create((set, get) => ({
  // ── State ───────────────────────────────────────────────────────
  savedTrips: [],
  activeTripId: null,
  locks: {},
  hasUnsavedChanges: false,
  
  // AI Planner Persistence
  plannerStep: 0,
  plannerMessages: [],

  // Canvas / Refinement Persistence
  canvasMessages: [
    { sender: 'bot', text: 'I am here to help you refine your Kerala itinerary! Want to swap a hotel, add more activities, or change flights?' }
  ],

  // ── Actions ─────────────────────────────────────────────────────

  /** Create a new trip from the chat flow and set it active */
  createTrip: (tripData) =>
    set((state) => ({
      savedTrips: [...state.savedTrips, { ...tripData, status: 'planning' }],
      activeTripId: tripData.id,
      locks: {}, // reset locks for new trip
      hasUnsavedChanges: false,
    })),

  /** Set the active trip (e.g. when tapping a saved trip card) */
  setActiveTrip: (tripId) => set({ activeTripId: tripId }),

  /** Get the full active trip object */
  getActiveTrip: () => {
    const { savedTrips, activeTripId } = get();
    return savedTrips.find((t) => t.id === activeTripId) || null;
  },

  /** Lock (add) an item to a specific slot */
  lockItem: (lockKey, itemId) =>
    set((state) => {
      const isMulti = lockKey.startsWith('activities_');
      if (isMulti) {
        const arr = Array.isArray(state.locks[lockKey]) ? state.locks[lockKey] : (state.locks[lockKey] ? [state.locks[lockKey]] : []);
        const idx = arr.indexOf(itemId);
        if (idx >= 0) {
          const nextArr = arr.filter(id => id !== itemId);
          if (nextArr.length === 0) {
            const nextLocks = { ...state.locks };
            delete nextLocks[lockKey];
            return { locks: nextLocks, hasUnsavedChanges: true };
          }
          return { locks: { ...state.locks, [lockKey]: nextArr }, hasUnsavedChanges: true };
        } else {
          return { locks: { ...state.locks, [lockKey]: [...arr, itemId] }, hasUnsavedChanges: true };
        }
      }
      return { locks: { ...state.locks, [lockKey]: itemId }, hasUnsavedChanges: true };
    }),

  /** Unlock (remove) an item from a specific slot */
  unlockItem: (lockKey, itemId) =>
    set((state) => {
      const next = { ...state.locks };
      const isMulti = lockKey.startsWith('activities_');
      if (isMulti && itemId) {
        const arr = Array.isArray(next[lockKey]) ? next[lockKey] : (next[lockKey] ? [next[lockKey]] : []);
        const nextArr = arr.filter(id => id !== itemId);
        if (nextArr.length === 0) {
          delete next[lockKey];
        } else {
          next[lockKey] = nextArr;
        }
      } else {
        delete next[lockKey];
      }
      return { locks: next, hasUnsavedChanges: true };
    }),

  /** Mark unsaved changes as saved */
  saveChanges: () =>
    set({ hasUnsavedChanges: false }),

  /** Check if a specific slot is locked */
  isLocked: (lockKey) => {
    const val = get().locks[lockKey];
    if (Array.isArray(val)) return val.length > 0;
    return val != null;
  },

  /** Get the locked item object for a slot */
  getLockedItem: (lockKey) => {
    const val = get().locks[lockKey];
    const itemId = Array.isArray(val) ? val[0] : val;
    return itemId ? getItemById(itemId) : null;
  },

  /** Calculate total price from all locked items */
  getTotalPrice: () => {
    const { locks } = get();
    let total = 0;
    Object.values(locks).forEach((val) => {
      if (Array.isArray(val)) {
        val.forEach((itemId) => {
          const item = getItemById(itemId);
          if (item) total += item.totalPrice ?? item.price ?? 0;
        });
      } else if (val) {
        const item = getItemById(val);
        if (item) {
          // Hotels use totalPrice, flights/activities use price
          total += item.totalPrice ?? item.price ?? 0;
        }
      }
    });
    return total;
  },

  /**
   * Check how many of the 5 core anchors are locked.
   * Core anchors: outboundFlight, hotel_alleppey, hotel_munnar, returnFlight, + at least 1 activity
   */
  getCoreAnchorsStatus: () => {
    const { locks } = get();
    const coreKeys = [
      'outboundFlight',
      'hotel_alleppey',
      'hotel_munnar',
      'returnFlight',
    ];
    const anchorsDone = coreKeys.filter((k) => locks[k] != null).length;
    const hasActivities =
      (Array.isArray(locks['activities_day1']) ? locks['activities_day1'].length > 0 : !!locks['activities_day1']) ||
      (Array.isArray(locks['activities_day2']) ? locks['activities_day2'].length > 0 : !!locks['activities_day2']) ||
      (Array.isArray(locks['activities_day3']) ? locks['activities_day3'].length > 0 : !!locks['activities_day3']);
    return {
      locked: anchorsDone + (hasActivities ? 1 : 0),
      total: 5,
      allDone: anchorsDone === 4 && hasActivities,
    };
  },

  /** Mark active trip as booked */
  bookTrip: () =>
    set((state) => ({
      savedTrips: state.savedTrips.map((t) =>
        t.id === state.activeTripId ? { ...t, status: 'booked' } : t
      ),
    })),

  // AI Planner Actions
  setPlannerStep: (step) => set({ plannerStep: step }),
  
  addPlannerMessages: (msgs) =>
    set((state) => ({
      plannerMessages: [...state.plannerMessages, ...msgs.map(m => ({ ...m, id: m.id || Math.random().toString(36).substr(2, 9) }))]
    })),

  updatePlannerMessage: (predicate, updateFn) =>
    set((state) => ({
      plannerMessages: state.plannerMessages.map(m => predicate(m) ? updateFn(m) : m)
    })),

  resetPlanner: () => set({ plannerStep: 0, plannerMessages: [] }),

  // Canvas Actions
  addCanvasMessages: (msgs) =>
    set((state) => ({
      canvasMessages: [...state.canvasMessages, ...msgs.map(m => ({ ...m, id: m.id || Math.random().toString(36).substr(2, 9) }))]
    })),

  updateCanvasMessage: (predicate, updateFn) =>
    set((state) => ({
      canvasMessages: state.canvasMessages.map(m => predicate(m) ? updateFn(m) : m)
    })),

  resetCanvasChat: () => set({ 
    canvasMessages: [{ sender: 'bot', text: 'I am here to help you refine your Kerala itinerary! Want to swap a hotel, add more activities, or change flights?' }] 
  }),
}));

export default useTripStore;

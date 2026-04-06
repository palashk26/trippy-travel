import { create } from 'zustand';
import { getItemById } from '../data/mockData';

/**
 * Trippy Global State (Zustand)
 *
 * savedTrips  – Array of trip objects (status: 'planning' | 'booked')
 * activeTripId – ID of the trip currently being viewed / edited
 * locks       – { lockKey: itemId } tracking user-confirmed items
 */
const useTripStore = create((set, get) => ({
  // ── State ───────────────────────────────────────────────────────
  savedTrips: [
    {
      id: 'trip_test_active',
      title: 'Kerala Nature Exploration',
      subtitle: 'Alleppey (2D) · Munnar (1D)',
      duration: '3D/2N',
      dates: 'Oct 12 - Oct 14',
      travelers: '2 Adults, 1 Room',
      coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
      tags: ['Nature', 'Made for Solo', 'Affordable'],
      status: 'active',
      days: [
        {
          id: 'day1',
          dayNumber: 1,
          title: 'Alleppey Beach',
          sections: [
            { type: 'flight', label: 'Arrive Flight', itemIds: ['fl_out_1', 'fl_out_2', 'fl_out_3'], lockKey: 'outboundFlight' },
            { type: 'hotel', label: 'Hotel Check-in', itemIds: ['htl_1', 'htl_2'], lockKey: 'hotel_alleppey' },
            { type: 'activity', label: 'Things To Do', itemIds: ['act_1', 'act_2'], lockKey: 'activities_day1' },
          ]
        },
        {
          id: 'day2',
          dayNumber: 2,
          title: 'Alleppey Backwaters',
          sections: [
            { type: 'activity', label: 'Things To Do', itemIds: ['act_3', 'act_4'], lockKey: 'activities_day2' },
          ]
        },
        {
          id: 'day3',
          dayNumber: 3,
          title: 'Munnar Mountains',
          sections: [
            { type: 'hotel', label: 'Hotel Check-out', itemIds: ['htl_1', 'htl_2'], lockKey: 'hotel_alleppey' },
            { type: 'transit', label: '⚠️ Transition Alert', itemIds: ['tr_1'], lockKey: 'transit_day3' },
            { type: 'hotel', label: 'Hotel Check-in', itemIds: ['htl_3', 'htl_4'], lockKey: 'hotel_munnar' },
            { type: 'activity', label: 'Things To Do', itemIds: ['act_5', 'act_6'], lockKey: 'activities_day3' },
            { type: 'hotel', label: 'Hotel Check-out', itemIds: ['htl_3', 'htl_4'], lockKey: 'hotel_munnar' },
            { type: 'flight', label: 'Depart Flight', itemIds: ['fl_ret_1', 'fl_ret_2'], lockKey: 'returnFlight' },
          ]
        }
      ]
    }
  ],
  activeTripId: 'trip_test_active',
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

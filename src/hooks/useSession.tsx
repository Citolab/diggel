import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { loadAssessmentStructure } from '../data/assessmentStructure';
import { TEST_URL_BY_ENV } from '../data/items';
import type { EnvironmentId } from '../environments/config';
import type { AppPhase, ItemDefinition, ItemResult, SessionState } from '../types';

const STORAGE_KEY = 'diggel-new-session';

const defaultState: SessionState = {
  loggedIn: false,
  isDemo: false,
  environment: null,
  phase: 'login',
  currentIndex: 0,
  results: [],
};

function load(): SessionState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return defaultState;
}

function persist(state: SessionState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/** Derive the app phase for the item at `index` from its QTI section. */
function phaseForIndex(items: ItemDefinition[], index: number): AppPhase {
  if (index >= items.length) return 'end';
  const section = items[index]?.section;
  return section === 'registration' ? 'registration' : 'feed';
}

interface SessionContextValue {
  session: SessionState;
  items: ItemDefinition[];
  currentItem: ItemDefinition | null;
  currentIndex: number;
  isComplete: boolean;
  /** True while the assessment structure is being fetched for the environment. */
  isLoadingStructure: boolean;
  enterDemo: () => void;
  selectEnvironment: (environment: EnvironmentId) => void;
  beginRegistration: () => void;
  recordResult: (result: ItemResult) => void;
  advance: (result?: ItemResult) => void;
  reset: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionState>(load);
  const [items, setItems] = useState<ItemDefinition[]>([]);
  const [isLoadingStructure, setIsLoadingStructure] = useState(false);
  // Kept in a ref so `advance` (a setState callback) can read the latest items.
  const itemsRef = useRef<ItemDefinition[]>([]);
  itemsRef.current = items;

  useEffect(() => {
    persist(session);
  }, [session]);

  // Derive the item structure from the environment's QTI assessment test.
  useEffect(() => {
    const environment = session.environment;
    if (!environment) {
      setItems([]);
      return;
    }

    let cancelled = false;
    setIsLoadingStructure(true);
    loadAssessmentStructure(TEST_URL_BY_ENV[environment])
      .then((loaded) => {
        if (!cancelled) setItems(loaded);
      })
      .catch((error) => {
        console.error(error);
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingStructure(false);
      });

    return () => {
      cancelled = true;
    };
  }, [session.environment]);

  const patch = useCallback((updater: (prev: SessionState) => SessionState) => {
    setSession((prev) => {
      const next = updater(prev);
      persist(next);
      return next;
    });
  }, []);

  const currentItem = items[session.currentIndex] ?? null;
  const isComplete =
    session.environment !== null &&
    items.length > 0 &&
    session.currentIndex >= items.length;

  const enterDemo = useCallback(() => {
    patch(() => ({
      loggedIn: true,
      isDemo: true,
      environment: null,
      phase: 'welcome',
      currentIndex: 0,
      results: [],
    }));
  }, [patch]);

  const selectEnvironment = useCallback(
    (environment: EnvironmentId) => {
      patch((s) => ({
        ...s,
        environment,
        phase: 'start',
        currentIndex: 0,
        results: [],
      }));
    },
    [patch]
  );

  const beginRegistration = useCallback(() => {
    patch((s) => ({ ...s, phase: 'registration', currentIndex: 0 }));
  }, [patch]);

  const recordResult = useCallback(
    (result: ItemResult) => {
      patch((prev) => {
        const index = prev.results.findIndex((r) => r.id === result.id);
        const results =
          index === -1
            ? [...prev.results, result]
            : prev.results.map((r) => (r.id === result.id ? result : r));
        return { ...prev, results };
      });
    },
    [patch]
  );

  const advance = useCallback(
    (result?: ItemResult) => {
      patch((prev) => {
        const envItems = itemsRef.current;
        const nextIndex = prev.currentIndex + 1;
        const nextPhase = phaseForIndex(envItems, nextIndex);

        let results = prev.results;
        if (result) {
          const index = results.findIndex((r) => r.id === result.id);
          results =
            index === -1
              ? [...results, result]
              : results.map((r) => (r.id === result.id ? result : r));
        }

        return {
          ...prev,
          currentIndex: Math.min(nextIndex, envItems.length),
          phase: nextPhase,
          results,
        };
      });
    },
    [patch]
  );

  const reset = useCallback(() => {
    persist(defaultState);
    setSession(defaultState);
  }, []);

  return (
    <SessionContext.Provider
      value={{
        session,
        items,
        currentItem,
        currentIndex: session.currentIndex,
        isComplete,
        isLoadingStructure,
        enterDemo,
        selectEnvironment,
        beginRegistration,
        recordResult,
        advance,
        reset,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession requires SessionProvider');
  return ctx;
}

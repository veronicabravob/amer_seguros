import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface SearchContextValue {
  search: string;
  setSearch: (value: string) => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState('');
  const value = useMemo(() => ({ search, setSearch }), [search]);
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

/** Search bound to the topbar input; used to filter the Pólizas listing, as in the original prototype. */
export function useGlobalSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useGlobalSearch must be used within SearchProvider');
  return ctx;
}

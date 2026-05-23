'use client';

import { Dispatch, SetStateAction, useMemo, useState } from 'react';

type Return<T> = {
  filteredData: T[];
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
};

export const useTableSearch = <T>(data: T[] = [], searchKey: keyof T): Return<T> => {
  const [search, setSearch] = useState('');

  const filteredData = useMemo((): T[] => {
    if (!search.trim()) return data;
    const lowerSearch = search.toLowerCase();

    return data.filter((item): boolean => {
      const value = item[searchKey];
      return String(value).toLowerCase().includes(lowerSearch);
    });
  }, [search, data, searchKey]);

  return { filteredData, search, setSearch };
};

'use client';

import { JSX, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/libs/redux/store';

export const ReduxProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  return <Provider store={store}>{children}</Provider>;
};

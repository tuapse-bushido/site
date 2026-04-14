'use client';

import { JSX, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from 'modules/client/redux';

export const ReduxProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  return <Provider store={store}>{children}</Provider>;
};

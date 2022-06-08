/** @format */

import { createContext, ReactNode, useContext, useState } from 'react';

interface CurrentCountryState {
  Country?: string;
  Population?: number;
  TotalCases?: number;
  TotalDeaths?: number;
  TotalTests?: number;
  Continent?: string;
}

interface CurrentCountryFuntions {
  updateCurrentCountry: (updatedCountry: CurrentCountryState) => void;
}

type CurrentCountryContextShape = CurrentCountryState & CurrentCountryFuntions;

const CurrentCountryContext = createContext<CurrentCountryContextShape | undefined>(undefined);

interface CurrentCountryProviderProps {
  children: ReactNode;
}

export const CurrentCountryProvider = ({ children }: CurrentCountryProviderProps) => {
  const [state, setState] = useState<CurrentCountryState>();

  function updateCurrentCountry(updatedToast: CurrentCountryState) {
    setState({ ...state, ...updatedToast });
  }

  const ctxValues: CurrentCountryContextShape = {
    Continent: state?.Continent ?? '',
    Country: state?.Country ?? '',
    TotalTests: state?.TotalTests ?? 0,
    TotalDeaths: state?.TotalDeaths ?? 0,
    TotalCases: state?.TotalCases ?? 0,
    Population: state?.TotalCases ?? 0,
    updateCurrentCountry
  };

  return <CurrentCountryContext.Provider value={ctxValues}>{children}</CurrentCountryContext.Provider>;
};

export const useCurrentCountry = () => {
  const toastCtx = useContext(CurrentCountryContext);
  if (toastCtx === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return toastCtx;
};

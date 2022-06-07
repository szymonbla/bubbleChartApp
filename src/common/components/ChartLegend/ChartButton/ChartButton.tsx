import { useState, Dispatch } from 'react';

import { Button } from '@mui/material';

interface ChartButtonProps {
  label: string;
  inactiveContinents: string[];
  setInactiveContinents: Dispatch<React.SetStateAction<string[]>>;
}

export const ChartButton = ({ label, inactiveContinents, setInactiveContinents }: ChartButtonProps) => {
  const [isActiveContinent, setIsActiveContinent] = useState<boolean>(true);

  const addContinent = (continentLabel: string) => {
    setInactiveContinents((prevState) => [...prevState, continentLabel]);
  };

  const removeContinent = (continentLabel: string) => {
    const newArray = inactiveContinents.filter((inactiveContinent) => inactiveContinent !== continentLabel);
    setInactiveContinents([...newArray]);
  };

  const handleClick = () => {
    if (isActiveContinent) {
      addContinent(label);
      setIsActiveContinent(!isActiveContinent);
      return;
    }
    removeContinent(label);
    setIsActiveContinent(!isActiveContinent);
  };

  return (
    <Button
      sx={{
        backgroundColor: isActiveContinent ? 'info.main' : 'grey.600',
        color: 'common.white',
        fontSize: '16px',
        fontWeight: '600',
        width: '200px',
        '&:hover': {
          backgroundColor: isActiveContinent ? 'info.main' : 'grey.600'
        }
      }}
      onClick={() => handleClick()}
    >
      {label}
    </Button>
  );
};

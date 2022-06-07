import { Dispatch } from 'react';

import { Box, Typography } from '@mui/material';

import { allContinents } from 'common/constants';
import { ChartButton } from './ChartButton';

interface ChartLegendProps {
  inactiveContinents: string[];
  setInactiveContinents: Dispatch<React.SetStateAction<string[]>>;
}

export const ChartLegend = ({ inactiveContinents, setInactiveContinents }: ChartLegendProps) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 4,
        mb: 5,
        width: '1050px'
      }}
    >
      <Typography variant="h1">World Covid Tracker - LIVE</Typography>
      <Typography variant="subtitle1">
        It shows relevant and up-to-date data about covid-19 all over the world.
      </Typography>
      <Typography variant="subtitle1">
        <b>Axis X</b> - Total cases <br></br> <b>Axis Y</b> - Population <br></br> <b>Axis Z</b> - Death Cases
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4 }}>
        {allContinents.map(({ label, id }) => (
          <ChartButton
            key={id}
            label={label}
            inactiveContinents={inactiveContinents}
            setInactiveContinents={setInactiveContinents}
          />
        ))}
      </Box>
    </Box>
  );
};

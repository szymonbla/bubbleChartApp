import { Box, Button, Typography } from '@mui/material';
import { allContinents } from 'common/constants';

export const ChartLegend = () => {
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
        {allContinents.map(({ name, id }) => (
          <Button
            sx={{
              backgroundColor: 'info.main',
              color: 'common.white',
              fontSize: '16px',
              fontWeight: '600',
              width: '200px',
              '&:hover': {
                backgroundColor: 'info.main'
              }
            }}
            key={id}
          >
            {name}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

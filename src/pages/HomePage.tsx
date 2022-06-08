import { useCallback, useEffect, useRef, useState } from 'react';

import { Box, Typography } from '@mui/material';

import { ScatterChart, ChartLegend } from 'common/components';
import { axiosRequest } from 'common/utils';
import { allContinents } from 'common/constants';
import { useCurrentCountry } from 'state';

export const HomePage = () => {
  const [inactiveContinents, setInactiveContinents] = useState<string[]>([]);
  const [dataCovid, setDataCovid] = useState<any>([]);
  const isMounted = useRef<boolean>();
  const [currentCountry, setCurrentCountry] = useState<string>('');
  const { Continent, Country, Population, TotalCases, TotalDeaths, TotalTests } = useCurrentCountry();

  const changeContinentData = useCallback(async () => {
    allContinents.forEach(async (continent) => {
      const { data } = await axiosRequest.get(`npm-covid-data/${continent.endpointName}`);
      setDataCovid((prevState: any) => [...prevState, ...data]);
    });
  }, []);

  useEffect(() => {
    if (isMounted.current) return;

    async function fetchAllArray() {
      try {
        await changeContinentData();
      } catch (err) {
        throw new Error('Something went wrong!');
      }
    }

    fetchAllArray();

    isMounted.current = true;
  }, [changeContinentData, setDataCovid]);

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      <ChartLegend inactiveContinents={inactiveContinents} setInactiveContinents={setInactiveContinents} />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <ScatterChart
          dataCovid={dataCovid}
          width={900}
          height={700}
          inactiveContinent={inactiveContinents}
          setCurrentCountry={setCurrentCountry}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, position: 'absolute', right: '5%', top: '5%' }}>
          <Typography variant="h5">Continent: {Continent}</Typography>
          <Typography variant="h5">Country: {Country}</Typography>
          <Typography variant="h5">Population: {Population}</Typography>
          <Typography variant="h5">TotalCases: {TotalCases}</Typography>
          <Typography variant="h5">TotalDeaths: {TotalDeaths}</Typography>
          <Typography variant="h5">TotalTests: {TotalTests}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

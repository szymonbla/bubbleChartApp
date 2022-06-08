import { useCallback, useEffect, useRef, useState } from 'react';

import { Box, Button, Typography } from '@mui/material';

import { ScatterChart, ChartLegend } from 'common/components';
import { axiosRequest } from 'common/utils';
import { allContinents } from 'common/constants';

interface DataResponse {
  Id?: number;
  Country: string;
  Population: number;
  TotalCases: number;
  TotalDeaths: number;
  TotalTests: number;
  Continent: string;
}

export const HomePage = () => {
  const [inactiveContinents, setInactiveContinents] = useState<string[]>([]);
  const [dataCovid, setDataCovid] = useState<any>([]);
  const isMounted = useRef<boolean>();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const currentCountryRef = useRef<DataResponse>({
    Continent: '',
    Country: '',
    Population: 0,
    TotalCases: 0,
    TotalDeaths: 0,
    TotalTests: 0
  });
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
          width={700}
          height={500}
          inactiveContinent={inactiveContinents}
          currentCountryRef={currentCountryRef}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, position: 'absolute', top: '5%', right: '5%' }}>
        <Typography variant="h5">Continent: {currentCountryRef.current.Continent}</Typography>
        <Typography variant="h5">Country: {currentCountryRef.current.Country}</Typography>
        <Typography variant="h5">Population: {currentCountryRef.current.Population}</Typography>
        <Typography variant="h5">TotalCases: {currentCountryRef.current.TotalCases}</Typography>
        <Typography variant="h5">TotalDeaths: {currentCountryRef.current.TotalDeaths}</Typography>
        <Typography variant="h5">TotalTests: {currentCountryRef.current.TotalTests}</Typography>
        <Button
          onClick={() => {
            setIsVisible(!isVisible);
          }}
        >
          Check bubble
        </Button>
      </Box>
    </Box>
  );
};

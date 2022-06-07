import { useCallback, useEffect, useRef, useState } from 'react';

import { Box } from '@mui/material';

import { ScatterChart, ChartLegend } from 'common/components';
import { axiosRequest } from 'common/utils';
import { allContinents } from 'common/constants';

export const HomePage = () => {
  const [inactiveContinents, setInactiveContinents] = useState<string[]>([]);
  const [dataCovid, setDataCovid] = useState<any>([]);
  const isMounted = useRef<boolean>();

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
      sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pb: '10%' }}
    >
      <ChartLegend inactiveContinents={inactiveContinents} setInactiveContinents={setInactiveContinents} />
      <ScatterChart dataCovid={dataCovid} width={900} height={700} inactiveContinent={inactiveContinents} />
    </Box>
  );
};

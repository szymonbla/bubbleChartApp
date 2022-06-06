import { useCallback, useEffect, useRef, useState } from 'react';

import { Box } from '@mui/material';

import { ScatterChart, ChartLegend } from 'common/components';
import { axiosRequest } from 'common/utils';
import { allContinents } from 'common/constants';

export const HomePage = () => {
  const [requestContinent, setRequestContinent] = useState(allContinents[2]);
  const [dataCovid, setDataCovid] = useState([]);

  const isMounted = useRef<boolean>();

  const changeContinentData = useCallback(async () => {
    const responseArray = await axiosRequest.get(`npm-covid-data/${requestContinent.name}`);
    setDataCovid(responseArray.data);

    return responseArray;
  }, [requestContinent]);

  useEffect(() => {
    if (isMounted.current) return;
    async function fetchAllArray() {
      try {
        await changeContinentData();
      } catch (err) {
        throw new Error('test');
      }
    }

    fetchAllArray();
    isMounted.current = true;
  }, [changeContinentData, requestContinent, setDataCovid]);

  return (
    <Box
      component="main"
      sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pb: '10%' }}
    >
      <ChartLegend />
      <ScatterChart dataCovid={dataCovid} width={900} height={700} continent={requestContinent} />
    </Box>
  );
};

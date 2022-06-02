import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button } from "@mui/material";

import { ScatterChart } from "common/components";
import { axiosRequest } from "common/utils";

export const HomePage = () => {
  const [dataCovid, setDataCovid] = useState([]);

  const isMounted = useRef<boolean>();
  const allContinents = [
    {
      id: 0,
      name: "asia",
    },
    {
      id: 1,
      name: "africa",
    },
    {
      id: 2,
      name: "europe",
    },
    {
      id: 3,
      name: "northamerica",
    },
    {
      id: 4,
      name: "southamerica",
    },
    {
      id: 5,
      name: "australia",
    },
  ];

  const [requestContinent, setRequestContinent] = useState(allContinents[2]);

  const changeContinentData = useCallback(async () => {
    const responseArray = await axiosRequest.get(
      `npm-covid-data/${requestContinent.name}`
    );
    setDataCovid(responseArray.data);

    return responseArray;
  }, [requestContinent]);

  useEffect(() => {
    if (isMounted.current) return;
    async function fetchAllArray() {
      try {
        await changeContinentData();
      } catch (err) {
        throw new Error("test");
      }
    }

    fetchAllArray();
    isMounted.current = true;
  }, [changeContinentData, requestContinent, setDataCovid]);

  return (
    <Box component="main" sx={{ display: "flex", height: "100vh" }}>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          flexWrap: "wrap",
          gap: 4,
        }}
      >
        {allContinents.map(({ name, id }) => (
          <Button
            sx={{
              backgroundColor: "info.main",
              color: "common.white",
              fontSize: "16px",
              fontWeight: "600",
              width: "200px",
              "&:hover": {
                backgroundColor: "info.main",
              },
            }}
            onClick={() => {
              setRequestContinent({ id, name });
              changeContinentData();
            }}
            key={name}
          >
            {name}
          </Button>
        ))}
      </Box>
      <ScatterChart
        dataCovid={dataCovid}
        width={900}
        height={700}
        continent={requestContinent}
      />
    </Box>
  );
};
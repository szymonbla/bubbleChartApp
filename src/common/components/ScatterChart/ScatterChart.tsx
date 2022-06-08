import { useRef, useEffect, LegacyRef, useCallback, useState, Dispatch } from 'react';

import { Box } from '@mui/material';
import * as d3 from 'd3';
import { allContinents } from 'common/constants';
import { v4 as uuidv4 } from 'uuid';
import { useCurrentCountry } from 'state';

interface DataResponse {
  Id: number;
  Country: string;
  Population: number;
  TotalCases: number;
  TotalDeaths: number;
  TotalTests: number;
  Continent: string;
}

interface ScatterChartProps {
  width: number;
  height: number;
  dataCovid: DataResponse[];
  inactiveContinent: string[];
  setCurrentCountry: Dispatch<React.SetStateAction<string>>;
}

export const ScatterChart = ({ dataCovid, height, width, inactiveContinent, setCurrentCountry }: ScatterChartProps) => {
  const svgRef = useRef<LegacyRef<SVGSVGElement>>();
  const { updateCurrentCountry, Population } = useCurrentCountry();

  const drawScatterChart = useCallback(
    (data: DataResponse[]) => {
      const minPopulation = () => {
        const newArra = dataCovid.sort((a, b) => Number(a.Population) - Number(b.Population));

        return {
          min: newArra[0].Population,
          max: newArra[newArra.length - 1].Population
        };
      };

      const calcCases = () => {
        const newArra = dataCovid.sort((a, b) => a.TotalCases - b.TotalCases);
        return {
          min: newArra[0],
          max: newArra[newArra.length - 1]
        };
      };

      const calcTotalDeaths = () => {
        const newArra = dataCovid.sort((a, b) => a.TotalDeaths - b.TotalDeaths);
        return {
          min: newArra[0],
          max: newArra[newArra.length - 1]
        };
      };

      // Container
      const svg = d3
        .select(svgRef.current as unknown as SVGSVGElement)
        .attr('width', width)
        .attr('height', height)
        .style('overflow', 'visible');

      // Axises

      const yAxis = d3.scaleLinear().domain([minPopulation().min, minPopulation().max]).range([height, 0]);

      const xAxis = d3.scaleLinear().domain([calcCases().min.TotalCases, calcCases().max.TotalCases]).range([0, width]);

      const zAxis = d3
        .scaleLinear()
        .domain([calcTotalDeaths().min.TotalDeaths, calcTotalDeaths().max.TotalDeaths])
        .range([1, 70]);

      svg
        .append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(xAxis))
        .style('font-size', '18px')
        .selectAll('text')
        .attr('y', 0)
        .attr('x', 9)
        .attr('dy', '.35em')
        .attr('transform', 'rotate(45)')
        .style('text-anchor', 'start');

      svg.append('g').call(d3.axisLeft(yAxis)).style('font-size', '18px');

      const showCountryData = (
        event: any,
        { Continent, Country, TotalCases, TotalDeaths, TotalTests }: DataResponse
      ) => {
        updateCurrentCountry({ Continent, Country, Population, TotalCases, TotalDeaths, TotalTests });
      };

      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', height + 100)
        .text('Total cases')
        .style('font-size', '20px');

      svg
        .append('text')
        .attr('y', -140)
        .attr('x', -(height / 2))
        .text('Population')
        .style('transform', 'rotate(-90deg)')
        .style('font-size', '20px');

      // Setting up data

      const correctContinentColor = (currentContinent: DataResponse) => {
        let continentColor = 'grey';

        allContinents.forEach((continent) => {
          if (continent.label === currentContinent.Continent) {
            continentColor = continent.backgroundColor;
          }
          return continentColor;
        });

        return continentColor;
      };

      // Tooltip

      svg
        .selectAll('dot')
        .data(data)
        .join('circle')
        .attr('class', 'bubbles')
        .style('stroke', 'black')
        .style('stroke-width', '1px')
        .attr('cx', (d) => Math.abs(xAxis(d.TotalCases)))
        .attr('cy', (d) => yAxis(d.Population))
        .attr('r', (d) => Math.abs(zAxis(d.TotalDeaths)))
        .style('fill', (d) => (inactiveContinent.includes(d.Continent) ? '#CBCFD' : correctContinentColor(d)))
        .on('mouseover', showCountryData);
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [width, height, dataCovid, inactiveContinent, updateCurrentCountry]
  );
  const generateKey = () => {
    return uuidv4();
  };

  useEffect(() => {
    if (dataCovid.length !== 0) drawScatterChart(dataCovid);
  }, [dataCovid, drawScatterChart]);

  return (
    <Box
      sx={{
        m: 5,
        flex: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <svg ref={svgRef as LegacyRef<SVGSVGElement>} key={generateKey()}></svg>
    </Box>
  );
};

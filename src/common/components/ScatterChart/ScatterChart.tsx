import { useRef, useEffect, LegacyRef, useState } from 'react';

import { Box } from '@mui/material';
import * as d3 from 'd3';
import { allContinents } from 'common/constants';
import { v4 as uuidv4 } from 'uuid';
import { useCurrentCountry } from 'state';

interface DataResponse {
  Id?: number;
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
  currentCountryRef: React.MutableRefObject<DataResponse>;
}

export const ScatterChart = ({ dataCovid, height, width, inactiveContinent, currentCountryRef }: ScatterChartProps) => {
  const svgRef = useRef<LegacyRef<SVGSVGElement>>('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const drawScatterChart = (data: DataResponse[]) => {
    const svg = d3
      .select(svgRef.current as unknown as SVGSVGElement)
      .attr('width', width)
      .attr('height', height)
      .style('overflow', 'visible');

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

    const showCurrentCountryData = (
      event: any,
      { Continent, Country, Population, TotalCases, TotalDeaths, TotalTests }: DataResponse
    ) => {
      return (currentCountryRef.current = { Continent, Country, Population, TotalCases, TotalDeaths, TotalTests });
    };

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
      let continentColor = '#000';

      allContinents.forEach((continent) => {
        if (continent.label === currentContinent.Continent) {
          continentColor = continent.backgroundColor;
        }
        return continentColor;
      });

      return continentColor;
    };

    svg
      .selectAll('dot')
      .data(data)
      .join('circle')
      .attr('class', 'bubbles')
      .style('stroke', 'black')
      .style('stroke-width', '2px')
      .style('cursor', 'pointer')
      .attr('cx', (d) => Math.abs(xAxis(d.TotalCases)))
      .attr('cy', (d) => yAxis(d.Population))
      .attr('r', (d) => Math.abs(zAxis(d.TotalDeaths)))
      .style('fill', (d) => (inactiveContinent.includes(d.Continent) ? '#000' : correctContinentColor(d)))
      .on('click', showCurrentCountryData);
  };

  const generateKey = () => {
    return uuidv4();
  };

  useEffect(() => {
    if (dataCovid.length !== 0) {
      drawScatterChart(dataCovid);
    }
  }, [currentCountryRef, dataCovid, drawScatterChart]);

  return (
    <Box
      sx={{
        m: 10,
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

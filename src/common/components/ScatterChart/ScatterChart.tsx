import { useRef, useEffect, LegacyRef, useCallback, useState } from 'react';

import { Box } from '@mui/material';
import * as d3 from 'd3';

interface DataResponse {
  Country: string;
  Population: number;
  TotalCases: number;
  TotalDeaths: number;
  Continent: string;
}

interface ScatterChartProps {
  width: number;
  height: number;
  dataCovid: DataResponse[];
  inactiveContinent: string[];
}

export const ScatterChart = ({ dataCovid, height, width, inactiveContinent }: ScatterChartProps) => {
  const svgRef = useRef<LegacyRef<SVGSVGElement>>();
  const [id, setId] = useState<number>(1);

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

      // Tooltip

      const tooltip = d3
        .select(svgRef.current as unknown as SVGSVGElement)
        .append('div')
        .style('opacity', 0)
        .attr('class', 'tooltip')
        .style('background-color', 'black')
        .style('border-radius', '5px')
        .style('padding', '10px')
        .style('color', 'white');

      const showTooltip = (event: MouseEvent, d: DataResponse) => {
        tooltip.transition().duration(200);
        tooltip
          .style('opacity', 1)
          .html('Country: ' + d.Country)
          .style('left', event.x / 2 + 'px')
          .style('top', event.y / 2 + 30 + 'px');
      };

      const moveTooltip = (event: MouseEvent) => {
        tooltip.style('left', event.x / 2 + 'px').style('top', event.y / 2 + 30 + 'px');
      };
      const hideTooltip = () => {
        tooltip.transition().duration(200).style('opacity', 0);
      };

      // Axises

      const yAxis = d3.scaleLinear().domain([minPopulation().min, minPopulation().max]).range([height, 0]);

      const xAxis = d3.scaleLinear().domain([calcCases().min.TotalCases, calcCases().max.TotalCases]).range([0, width]);

      const zAxis = d3
        .scaleLinear()
        .domain([calcTotalDeaths().min.TotalDeaths, calcTotalDeaths().max.TotalDeaths])
        .range([1, 50]);

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

      // axis label
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

      // setting up data
      svg
        .selectAll('dot')
        .data(data)
        .join('circle')
        .attr('cx', (d) => Math.abs(xAxis(d.TotalCases)))
        .attr('cy', (d) => yAxis(d.Population))
        .attr('r', (d) => Math.abs(zAxis(d.TotalDeaths)))
        .style('fill', (d) => (inactiveContinent.includes(d.Continent) ? '#CBCFD' : `#f3f343`))
        // .style('fill', () => `#${Math.floor(Math.random() * 16777215).toString(16)}`)
        .style('opacity', '1')
        .on('mouseover', showTooltip)
        .on('mousemove', moveTooltip)
        .on('mouseleave', hideTooltip);
    },
    [width, height, dataCovid, inactiveContinent]
  );

  useEffect(() => {
    if (dataCovid.length !== 0) drawScatterChart(dataCovid);
    setId(id + 1);
  }, [dataCovid, drawScatterChart, id]);

  return (
    <Box
      sx={{
        m: 5,
        flex: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <svg ref={svgRef as LegacyRef<SVGSVGElement>} key={id}></svg>
    </Box>
  );
};

import { useRef, useEffect, LegacyRef, useCallback } from "react";

import { Box } from "@mui/material";
import * as d3 from "d3";

interface DataResponse {
  Country: string;
  Population: number;
  TotalCases: number;
  TotalDeaths: number;
}

interface ScatterChartProps {
  dataCovid: DataResponse[];
  width: number;
  height: number;
  continent: {
    id: number;
    name: string;
  };
}

export const ScatterChart = ({
  dataCovid,
  height,
  width,
  continent,
}: ScatterChartProps) => {
  const svgRef = useRef<LegacyRef<SVGSVGElement>>();

  const drawScatterChart = useCallback(
    (dataCovid: DataResponse[]) => {
      const minPopulation = () => {
        const newArra = dataCovid.sort(
          (a, b) => Number(a.Population) - Number(b.Population)
        );

        return {
          min: newArra[0].Population,
          max: newArra[newArra.length - 1].Population,
        };
      };

      const calcCases = () => {
        const newArra = dataCovid.sort((a, b) => a.TotalCases - b.TotalCases);
        return {
          min: newArra[0],
          max: newArra[newArra.length - 1],
        };
      };

      const calcTotalDeaths = () => {
        const newArra = dataCovid.sort((a, b) => a.TotalDeaths - b.TotalDeaths);
        return {
          min: newArra[0],
          max: newArra[newArra.length - 1],
        };
      };

      // Container
      const svg = d3
        .select(svgRef.current as unknown as SVGSVGElement)
        .attr("width", width)
        .attr("height", height)
        .style("overflow", "visible");

      // Axises

      const xAxis = d3
        .scaleLinear()
        .domain([minPopulation().min, minPopulation().max])
        .range([0, width]);

      const yAxis = d3
        .scaleLinear()
        .domain([calcCases().min.TotalCases, calcCases().max.TotalCases])
        .range([height, 0]);

      const zAxis = d3
        .scaleLinear()
        .domain([
          calcTotalDeaths().min.TotalDeaths,
          calcTotalDeaths().max.TotalDeaths,
        ])
        .range([1, 100]);

      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xAxis))
        .style("margin-top", "1em")
        .style("font-size", "18px")
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start");

      svg.append("g").call(d3.axisLeft(yAxis)).style("font-size", "18px");

      // axis label
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height + 100)
        .text("Population")
        .style("font-size", "20px");

      svg
        .append("text")
        .attr("y", -140)
        .attr("x", -(height / 2))
        .text("Total cases")
        .style("transform", "rotate(-90deg)")
        .style("font-size", "20px");

      // setting up data
      svg
        .selectAll("dot")
        .data(dataCovid)
        .join("circle")
        .attr("cx", (d) => Math.abs(xAxis(d.TotalCases)))
        .attr("cy", (d) => yAxis(d.Population))
        .attr("r", (d) => Math.abs(zAxis(d.TotalDeaths)))
        .style(
          "fill",
          () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
        )
        .style("opacity", "1");
    },
    [height, width]
  );

  useEffect(() => {
    if (dataCovid.length !== 0) drawScatterChart(dataCovid);
  }, [dataCovid, drawScatterChart, height, width]);

  return (
    <Box
      sx={{
        m: 5,
        flex: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg ref={svgRef as LegacyRef<SVGSVGElement>} key={continent.id}></svg>
    </Box>
  );
};

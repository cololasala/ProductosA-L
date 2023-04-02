import { Chart } from "react-google-charts";
import { useState, useEffect } from "react";
import { Loading } from "./Loading";

export const optionsPiechart = {
  title: "Gráfico de porcentaje (primeros 10 en ranking)",
};

export const optionsBarChart = {
  chart: {
    title: "Cantidades vendida por articulo (primeros 10 en ranking)",
  },
};

export const GoogleCharts = ({ items }) => {
  const [itemsChart, setItemsChart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const arrayItems = items
      .map((i) => {
        return [i.name, i.total];
      })
      .slice(0, 11);      // solo tomo los primeros 10 articulos para los graficos

    arrayItems.unshift(["Articulos", "Totales vendidos"]);
    setItemsChart(arrayItems);
    setLoading(false)
  }, [items]);

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <Chart
        chartType="PieChart"
        data={itemsChart}
        options={optionsPiechart}
        width={"100%"}
        height={"400px"}
      />
      <Chart
        chartType="Bar"
        data={itemsChart}
        options={optionsBarChart}
        width={"100%"}
        height={"400px"}
      />
    </>
  );
};

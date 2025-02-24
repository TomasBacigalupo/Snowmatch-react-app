import merge from "lodash/merge";
import ReactApexChart from "react-apexcharts";
import { styled } from "@mui/material/styles";
import { Card, Typography, Stack } from "@mui/material";
import PropTypes from "prop-types";
import BaseOptionChart from "../../../../components/chart/BaseOptionChart";
import Iconify from "../../../../components/Iconify";

// 📌 Estilos del contenedor
const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: "none",
  padding: theme.spacing(3),
  color: theme.palette.primary.darker,
  //backgroundColor: theme.palette.primary.lighter,
}));

const PerformanceChart = ({ userScores, allScores, userScore }) => {
  // 📊 Ordenar y calcular percentil del usuario
  const sortedScores = [...allScores].sort((a, b) => a - b);
  const userPercentile = (sortedScores.indexOf(userScore) / sortedScores.length) * 100;

  // 📈 Datos para gráfico de línea (evolución del usuario)
  const scoreData = userScores.map((entry) => entry.score);
  const lineChartOptions = merge(BaseOptionChart(), {
    chart: { sparkline: { enabled: true } },
    stroke: { width: 3 },
    xaxis: { categories: userScores.map((entry) => entry.date) },
    yaxis: { reversed: true }, // Menor score es mejor
    tooltip: { y: { formatter: (val) => `${val} pts` } },
  });

  // 📊 Datos del histograma (distribución de puntajes)
  const minScore = Math.min(...sortedScores);
  const maxScore = Math.max(...sortedScores);
  const histogramData = Array.from({ length: 10 }, (_, i) => {
    const rangeMin = minScore + (i / 10) * (maxScore - minScore);
    const rangeMax = minScore + ((i + 1) / 10) * (maxScore - minScore);
    return {
      range: `${rangeMin.toFixed(1)} - ${rangeMax.toFixed(1)}`,
      count: sortedScores.filter((score) => score >= rangeMin && score < rangeMax).length,
      isUserRange: userScore >= rangeMin && userScore < rangeMax,
    };
  });

  const histogramOptions = merge(BaseOptionChart(), {
    chart: { type: "bar", sparkline: { enabled: true } },
    plotOptions: { bar: { columnWidth: "80%" } },
    xaxis: { categories: histogramData.map((d) => d.range) },
    tooltip: { y: { formatter: (val) => `${val} usuarios` } },
  });

  return (
    <RootStyle>
      {/* 📈 Evolución de puntuaciones */}
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
        <div>
          <Typography variant="subtitle2">Tu evolución</Typography>
          <Typography variant="h3">{userScore} pts</Typography>
        </div>
        <div>
          <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ mb: 0.6 }}>
            <Iconify width={20} height={20} icon="eva:trending-up-fill" />
            <Typography variant="subtitle2" component="span" sx={{ ml: 0.5 }}>
              {userPercentile.toFixed(1)}% mejor que otros
            </Typography>
          </Stack>
        </div>
      </Stack>

      <ReactApexChart type="line" series={[{ name: "Puntaje", data: scoreData }]} options={lineChartOptions} height={180} />
      </RootStyle>
  );
};

// 📌 PropTypes para validación de datos
PerformanceChart.propTypes = {
  userScores: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
    })
  ).isRequired,
  allScores: PropTypes.arrayOf(PropTypes.number).isRequired,
  userScore: PropTypes.number.isRequired,
};

export default PerformanceChart;
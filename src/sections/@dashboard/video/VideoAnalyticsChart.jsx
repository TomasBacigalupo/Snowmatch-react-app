import React, { useState } from "react";
import PropTypes from "prop-types";
import Chart from "react-apexcharts";
import { Box, Button, Typography, styled, Collapse } from "@mui/material";

const Container = styled(Box)(({ theme }) => ({
    background: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    margin: "auto",
}));

const Title = styled(Typography)(({ theme }) => ({
    fontSize: 20,
    fontWeight: 600,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(1),
}));

const SummaryBox = styled(Box)(({ theme }) => ({
    position: 'relative',
    cursor: 'pointer',
}));

const SummaryItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
}));

const MoreText = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    textDecoration: 'underline',
    cursor: 'pointer',
    marginLeft: theme.spacing(2),
    fontWeight: 'bold',
}));

const metrics = [
    { key: "maxEdgeAngle", label: "Canto" },
    { key: "hipAngleMax", label: "Cadera" },
    { key: "edgeAngleChange", label: "Manos" },
    { key: "hipAngleChange", label: "Hombros" },
];

const VideoAnalyticsChart = ({ turnData }) => {
    const [selectedMetric, setSelectedMetric] = useState("maxEdgeAngle");
    const [expanded, setExpanded] = useState(false);

    const metricLabels = {
        maxEdgeAngle: "Ángulo Máximo de Canto (°)",
        hipAngleMax: "Ángulo de Cadera al Máximo (°)",
        edgeAngleChange: "Ángulo de Canto al Cambiar (°)",
        hipAngleChange: "Ángulo de Cadera al Cambiar (°)",
    };

    const categories = turnData.map(turn => `Vuelta ${turn.turnNumber}`);
    
    const dataMap = {
        maxEdgeAngle: turnData.map(turn => Math.round(90 - turn.maxEdgeAnglePosition.edgeAngle)),
        hipAngleMax: turnData.map(turn => Math.round(turn.maxEdgeAnglePosition.edgeAngle)),
        paralelsHip: turnData.map(turn => Math.round(turn.maxEdgeAnglePosition)),
        paralelsHands: turnData.map(turn => Math.round(turn.maxEdgeAnglePosition.edgeAngle)),
        paralelsShoulders: turnData.map(turn => Math.round(turn.maxEdgeAnglePosition.edgeAngle)),
        edgeAngleChange: turnData.map(turn => Math.round(turn.changeTurnPosition.edgeAngle)),
        hipAngleChange: turnData.map(turn => Math.round(turn.changeTurnPosition.hipAngle)),
        handsAngleChange: turnData.map(turn => Math.round(turn.changeTurnPosition.hipAngle)),
    };

    // Calcular promedios para el resumen
    const averages = {
        maxEdgeAngle: Math.round(dataMap.maxEdgeAngle.reduce((a, b) => a + b, 0) / dataMap.maxEdgeAngle.length),
        hipAngleMax: Math.round(dataMap.hipAngleMax.reduce((a, b) => a + b, 0) / dataMap.hipAngleMax.length),
        edgeAngleChange: Math.round(dataMap.edgeAngleChange.reduce((a, b) => a + b, 0) / dataMap.edgeAngleChange.length),
        hipAngleChange: Math.round(dataMap.hipAngleChange.reduce((a, b) => a + b, 0) / dataMap.hipAngleChange.length),
    };

    const series = [{ name: metricLabels[selectedMetric], data: dataMap[selectedMetric] }];

    const options = {
        chart: { type: "line", toolbar: { show: false }, foreColor: "#333" },
        colors: ["primary"],
        stroke: { curve: "smooth", width: 3 },
        markers: { size: 5, hover: { size: 7 } },
        xaxis: { categories, labels: { show: false } },
        yaxis: { labels: { show: false } }, 
        grid: { borderColor: "#e0e0e0", strokeDashArray: 4 },
        legend: { show: false },
        tooltip: { theme: "dark" },
    };

    return (
        <Container>
            <SummaryBox onClick={() => setExpanded(!expanded)}>
                <Title>Estadísticas de la Bajada</Title>
                <Box sx={{ display: 'flex', gap: 4, pr: 4, alignItems: 'center' }}>
                    <SummaryItem>
                        <Typography variant="caption" color="text.secondary">Canteo</Typography>
                        <Typography variant="body2" fontWeight="bold">{averages.maxEdgeAngle}°</Typography>
                    </SummaryItem>
                    <SummaryItem>
                        <Typography variant="caption" color="text.secondary">Angulación</Typography>
                        <Typography variant="body2" fontWeight="bold">{averages.hipAngleMax}°</Typography>
                    </SummaryItem>
                    <MoreText variant="caption" onClick={(e) => {
                        e.stopPropagation();
                        setExpanded(!expanded);
                    }} sx={{ whiteSpace: 'nowrap' }}>
                        {expanded ? "Ver menos" : "Detalles..."}
                    </MoreText>
                </Box>
            </SummaryBox>

            <Collapse in={expanded}>
                <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: "flex", gap: 1, marginBottom: 1 }}>
                        {metrics.map(({ key, label }) => (
                            <Button
                                key={key}
                                variant="outlined"
                                onClick={() => setSelectedMetric(key)}
                                sx={{
                                    borderRadius: 8,
                                    borderColor: "grey.400",
                                    color: selectedMetric === key ? "white" : "text.primary",
                                    backgroundColor: selectedMetric === key ? "black" : "transparent",
                                    "&:hover": {
                                        backgroundColor: "white",
                                        borderColor: "black",
                                        color: "black"
                                    },
                                    paddingX: 2.5,
                                    paddingY: 1,
                                }}
                            >
                                {label}
                            </Button>
                        ))}
                    </Box>
                    <Chart options={options} series={series} type="line" height={300} />
                </Box>
            </Collapse>
        </Container>
    );
};

VideoAnalyticsChart.propTypes = {
    turnData: PropTypes.arrayOf(
        PropTypes.shape({
            turnNumber: PropTypes.number.isRequired,
            maxEdgeAnglePosition: PropTypes.shape({
                edgeAngle: PropTypes.number.isRequired,
                hipAngle: PropTypes.number.isRequired,
            }).isRequired,
            changeTurnPosition: PropTypes.shape({
                edgeAngle: PropTypes.number.isRequired,
                hipAngle: PropTypes.number.isRequired,
            }).isRequired,
        })
    ).isRequired,
};

export default VideoAnalyticsChart;
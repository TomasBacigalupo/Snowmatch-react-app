import React, { useState } from "react";
import PropTypes from "prop-types";
import Chart from "react-apexcharts";
import { Box, Button, ButtonGroup, Divider, Typography, styled } from "@mui/material";

const Container = styled(Box)(({ theme }) => ({
    background: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(3),
    boxShadow: theme.shadows[2],
    maxWidth: 700,
    margin: "auto",
    textAlign: "center",
}));

const Title = styled(Typography)(({ theme }) => ({
    fontSize: 20,
    fontWeight: 600,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(2),
}));

const metrics = [
    { key: "maxEdgeAngle", label: "Edge" },
    { key: "hipAngleMax", label: "Hip" },
    { key: "edgeAngleChange", label: "Hands" },
    { key: "hipAngleChange", label: "Shoulders" },
];

const VideoAnalyticsChart = ({ turnData }) => {
    const [selectedMetric, setSelectedMetric] = useState("maxEdgeAngle");

    const metricLabels = {
        maxEdgeAngle: "Max Edge Angle (°)",
        hipAngleMax: "Hip Angle at Max (°)",
        edgeAngleChange: "Edge Angle at Change (°)",
        hipAngleChange: "Hip Angle at Change (°)",
    };

    const categories = turnData.map(turn => `Turn ${turn.turnNumber}`);
    console.log(turnData)
    const dataMap = {
        maxEdgeAngle: turnData.map(turn => Math.round(90 - turn.maxEdgeAnglePosition.edgeAngle)),
        hipAngleMax: turnData.map(turn => Math.round(turn.maxEdgeAnglePosition.edgeAngle)),
        paralelsHip: turnData.map(turn => Math.round(turn.maxEdgeAnglePosition)),
        paralelsHands: turnData.map(turn => Math.round(turn.maxEdgeAnglePosition.edgeAngle)),
        paralelsShoulders: turnData.map(turn => Math.round(turn.maxEdgeAnglePosition.edgeAngle)),
        edgeAngleChange: turnData.map(turn => turn.changeTurnPosition.edgeAngle),
        hipAngleChange: turnData.map(turn => turn.changeTurnPosition.hipAngle),
        handsAngleChange: turnData.map(turn => turn.changeTurnPosition.hipAngle),
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
        <>
            <Box>
            <Title>Max Edge</Title>
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
            <Divider/>
            <Box>
                <Title>Turn Change</Title>
                <Box sx={{ display: "flex", gap: 1, marginBottom: 2 }}>
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
                <Title>{metricLabels[selectedMetric]}</Title>
                <Chart options={options} series={series} type="line" height={300} />
            </Box>
        </>

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
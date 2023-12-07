import React, {useEffect, useState} from "react";
import {Line} from "react-chartjs-2";
import {CategoryScale} from "chart.js";
import Chart from "chart.js/auto";
import Box from '@mui/material/Box'
import 'chartjs-adapter-date-fns';


Chart.register(CategoryScale);


const LineChart = (props: any) => {
    const {
        labels,
        data,
        label,
        xLabel,
        yLabel,
        hidden,
    } = props

    const AreaDataValue = {
        labels: labels,
        datasets: [
            {
                label: label ? label : null,
                data: data,
                borderColor: "rgb(14 73 129)",
                backgroundColor: "rgb(14 73 129)",
            }
        ]
    }

    const options = {
        tension: 0.5,
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            x: {
                grid: {
                    display: true,
                },
                title: {
                    display: true,
                    text: xLabel, // X-axis label
                    font: {
                        size: 14,
                    },
                },
                offset: true,
            },
            y: {
                grid: {
                    display: true,
                },
                title: {
                    display: true,
                    text: yLabel, // Y-axis label
                    font: {
                        size: 14,
                    },
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            }
        }
    };

    return (
      <Box hidden={hidden}>
        <Line
            data={AreaDataValue}
            options={options}
        />
      </Box>
    );
};

export default LineChart;

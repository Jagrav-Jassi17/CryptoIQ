import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title as ChartTitle,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Col, Row, Typography } from 'antd';

const { Title } = Typography;

ChartJS.register(LineElement, PointElement, LinearScale, ChartTitle, CategoryScale, Tooltip, Legend);

const LineChart = ({ coinHistory, currentPrice, coinName }) => {
  const history = coinHistory?.data?.history || [];

  console.log('LineChart history length:', history.length);
  if (history.length === 0) {
    return <div>No chart data available.</div>;
  }

  const chartData = useMemo(() => {
    const prices = history.map((h) => parseFloat(h.price));
    const times = history.map((h) =>
      new Date(h.timestamp * 1000).toLocaleString()
    );

    return {
      labels: [...times].reverse(),
      datasets: [
        {
          label: 'Price in USD',
          data: [...prices].reverse(),
          borderColor: '#0071bd',
          backgroundColor: '#0071bd',
          fill: false,
          tension: 0.25,
        },
      ],
    };
  }, [history]);

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => `$${value}`,
        },
      },
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
    },
  };

  return (
    <>
      <Row className="chart-header" style={{ marginBottom: 16 }}>
        <Title level={2} className="chart-title">{coinName} Price Chart</Title>
        <Col className="price-container">
          <Title level={5} className="price-change">
            Change: {coinHistory?.data?.change || 'N/A'}%
          </Title>
          <Title level={5} className="current-price">
            Current {coinName} Price: ${currentPrice}
          </Title>
        </Col>
      </Row>
      <Line data={chartData} options={options} />
    </>
  );
};

export default LineChart;

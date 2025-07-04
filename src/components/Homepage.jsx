import React from 'react';
import millify from 'millify';
import { Typography, Row, Col, Statistic, Divider } from 'antd';
import { Link } from 'react-router-dom';

import { useGetCryptosQuery } from '../services/cryptoApi';
import { useGetGlobalStatsQuery } from '../services/coingeckoApi';
import Cryptocurrencies from './Cryptocurrencies';
import News from './News';
import Loader from './Loader';

const { Title, Text } = Typography;

const Homepage = () => {
  const { data, isFetching } = useGetCryptosQuery(10);
  const { data: cgData, isFetching: isCgFetching } = useGetGlobalStatsQuery();

  const globalStats = data?.data?.stats;
  const totalMarketCap = cgData?.data?.total_market_cap?.usd;

  if (isFetching || !globalStats || isCgFetching || !totalMarketCap) return <Loader />;

  const formatBigNumber = (value, isCurrency = false) => {
    const num = Number(value);
    if (isNaN(num)) return 'N/A';

    if (num < 1000) return isCurrency ? `$${num}` : num;
    const formatted = millify(num, { precision: 2 });
    return isCurrency ? `$${formatted}` : formatted;
  };

  return (
    <>
      {/* Global Stats Section */}
      <div style={{ marginBottom: 40 }}>
        <Title level={2} style={{ borderBottom: '3px solid #1890ff', paddingBottom: 8, marginBottom: 8 }}>
          Global Crypto Statistics
        </Title>
        <Text type="secondary" style={{ marginBottom: 20, display: 'block', fontSize: 16 }}>
          Overview of key cryptocurrency market metrics worldwide
        </Text>

        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Statistic title="Total Cryptocurrencies" value={formatBigNumber(globalStats.total)} />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Statistic title="Total Exchanges" value={formatBigNumber(globalStats.totalExchanges)} />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Statistic title="Total Market Cap" value={formatBigNumber(totalMarketCap, true)} />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Statistic title="Total 24h Volume" value={formatBigNumber(globalStats.total24hVolume, true)} />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Statistic title="Total Markets" value={formatBigNumber(globalStats.totalMarkets)} />
          </Col>
        </Row>
      </div>

      <Divider />

      {/* Top Cryptos Section */}
      <div style={{ marginBottom: 40 }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Title level={3}>Top 10 Cryptocurrencies</Title>
          <Link to="/cryptocurrencies" style={{ fontSize: 16 }}>
            Show More
          </Link>
        </Row>

        <Cryptocurrencies simplified />
      </div>

      <Divider />

      {/* Latest News Section */}
      <div style={{ marginBottom: 40 }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Title level={3}>Latest Crypto News</Title>
          <Link to="/news" style={{ fontSize: 16 }}>
            Show More
          </Link>
        </Row>

        <News simplified />
      </div>
    </>
  );
};

export default Homepage;

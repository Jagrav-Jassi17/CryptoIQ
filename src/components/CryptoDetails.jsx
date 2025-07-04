import React, { useState } from 'react';
import HTMLReactParser from 'html-react-parser';
import { useParams } from 'react-router-dom';
import millify from 'millify';
import {
  Col,
  Row,
  Typography,
  Select,
} from 'antd';
import {
  MoneyCollectOutlined,
  DollarCircleOutlined,
  FundOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
  TrophyOutlined,
  CheckOutlined,
  NumberOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';

import {
  useGetCryptoDetailsQuery,
  useGetCryptoHistoryQuery,
} from '../services/cryptoApi';
import Loader from './Loader';
import LineChart from './LineChart';

const { Title, Text, Paragraph } = Typography;

const CryptoDetails = () => {
  const { coinId } = useParams();
  const [timeperiod, setTimeperiod] = useState('7d');

  const { data, isFetching } = useGetCryptoDetailsQuery(coinId);
  const { data: coinHistory, isFetching: isHistoryFetching } = useGetCryptoHistoryQuery(
    { coinId, timeperiod },
    { refetchOnMountOrArgChange: true }
  );

  // Improved safeMillify to handle string numbers as well
  const safeMillify = (val, defaultVal = 'N/A') => {
    if (val === undefined || val === null) return defaultVal;
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return typeof num === 'number' && !isNaN(num) ? millify(num) : defaultVal;
  };

  const cryptoDetails = data?.data?.coin;

  if (isFetching || isHistoryFetching) return <Loader />;
  if (!cryptoDetails) return <Text type="danger">Coin data not available.</Text>;

  const timeOptions = ['3h', '24h', '7d', '30d', '1y'];

  const stats = [
    { title: 'Price to USD', value: `$${safeMillify(cryptoDetails?.price)}`, icon: <DollarCircleOutlined /> },
    { title: 'Rank', value: cryptoDetails?.rank || 'N/A', icon: <NumberOutlined /> },
    { title: 'Market Cap', value: `$${safeMillify(cryptoDetails?.marketCap)}`, icon: <DollarCircleOutlined /> },
    { title: 'All-time High', value: `$${safeMillify(cryptoDetails?.allTimeHigh?.price)}`, icon: <TrophyOutlined /> },
  ];

  // Extract supplies for comparison
  const totalSupply = cryptoDetails?.supply?.total;
  const circulatingSupply = cryptoDetails?.supply?.circulating;

  const genericStats = [
    { title: 'Number Of Markets', value: safeMillify(cryptoDetails?.numberOfMarkets), icon: <FundOutlined /> },
    { title: 'Number Of Exchanges', value: safeMillify(cryptoDetails?.numberOfExchanges), icon: <MoneyCollectOutlined /> },
    {
      title: 'Approved Supply',
      value: cryptoDetails?.supply?.confirmed ? <CheckOutlined /> : <StopOutlined />,
      icon: <ExclamationCircleOutlined />,
    },
    // Conditionally show supply info
    ...(totalSupply && circulatingSupply && totalSupply !== circulatingSupply
      ? [
          {
            title: 'Total Supply',
            value: safeMillify(totalSupply),
            icon: <ExclamationCircleOutlined />,
          },
          {
            title: 'Circulating Supply',
            value: safeMillify(circulatingSupply),
            icon: <ExclamationCircleOutlined />,
          },
        ]
      : [
          {
            title: 'Supply',
            value: safeMillify(circulatingSupply || totalSupply) || 'N/A',
            icon: <ExclamationCircleOutlined />,
          },
        ]),
  ];

  return (
    <Col className="coin-detail-container">
      <Col className="coin-heading-container">
        <Title level={2} className="coin-name">
          {cryptoDetails?.name} ({cryptoDetails?.symbol}) Price
        </Title>
        <Paragraph>
          {cryptoDetails?.name} live price in USD. View value statistics, market cap, and supply details.
        </Paragraph>
      </Col>

      <Select
        value={timeperiod}
        onChange={(value) => setTimeperiod(value)}
        className="select-timeperiod"
        options={timeOptions.map((t) => ({ value: t, label: t }))}
        style={{ marginBottom: 24 }}
      />

      {coinHistory?.data?.history?.length > 0 ? (
        <LineChart
          coinHistory={coinHistory}
          currentPrice={millify(cryptoDetails?.price)}
          coinName={cryptoDetails?.name}
        />
      ) : (
        <Text type="secondary">No chart data available for this time period.</Text>
      )}

      <Col className="stats-container">
        <Col className="coin-value-statistics">
          <Title level={3} className="coin-details-heading">
            {cryptoDetails.name} Value Statistics
          </Title>
          <Paragraph>
            Stats of {cryptoDetails.name} including base currency, rank, volume, and more.
          </Paragraph>
          {stats.map(({ icon, title, value }) => (
            <Row className="coin-stats" key={title}>
              <Col span={12}><Text>{icon} {title}</Text></Col>
              <Col span={12}><Text className="stats">{value}</Text></Col>
            </Row>
          ))}
        </Col>

        <Col className="other-stats-info">
          <Title level={3} className="coin-details-heading">Other Stats Info</Title>
          <Paragraph>Additional info like supply approval, total supply, and markets.</Paragraph>
          {genericStats.map(({ icon, title, value }) => (
            <Row className="coin-stats" key={title}>
              <Col span={12}><Text>{icon} {title}</Text></Col>
              <Col span={12}><Text className="stats">{value}</Text></Col>
            </Row>
          ))}
        </Col>
      </Col>

      <Col className="coin-desc-link">
        <div className="coin-desc">
  <Title level={3}>What is {cryptoDetails.name}?</Title>
  {HTMLReactParser(cryptoDetails.description || '')}
</div>


        <Col className="coin-links">
          <Title level={3}>{cryptoDetails.name} Links</Title>
          {cryptoDetails.links?.map((link) => (
            <Row className="coin-link" key={link.name}>
              <Title level={5} className="link-name">{link.type}</Title>
              <a href={link.url} target="_blank" rel="noreferrer">{link.name}</a>
            </Row>
          ))}
        </Col>
      </Col>
    </Col>
  );
};

export default CryptoDetails;

import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Avatar, Collapse } from 'antd';
import millify from 'millify';
import { useGetExchangesQuery } from '../services/coingeckoApi';
import Loader from './Loader';

const { Text, Title, Paragraph } = Typography;
const { Panel } = Collapse;

const Exchanges = () => {
  const { data: exchanges, isFetching } = useGetExchangesQuery();
  const [btcPrice, setBtcPrice] = useState(30000); // fallback BTC price

  useEffect(() => {
    const fetchBTCPrice = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await res.json();
        setBtcPrice(data?.bitcoin?.usd || 30000);
      } catch {
        setBtcPrice(30000);
      }
    };
    fetchBTCPrice();
  }, []);

  if (isFetching) return <Loader />;
  if (!exchanges?.length) return <Text>No exchange data available.</Text>;

  const totalVolumeBTC = exchanges.reduce(
    (sum, ex) => sum + (ex.trade_volume_24h_btc || 0),
    0
  );

  return (
    <>
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Col span={6}><Text strong># Exchange</Text></Col>
        <Col span={6}><Text strong>24h Volume (USD)</Text></Col>
        <Col span={6}><Text strong>Trust Score</Text></Col>
        <Col span={6}><Text strong>Market Share(24 hrs)</Text></Col>
      </Row>

      {exchanges.slice(0, 10).map((exchange, index) => {
        const volumeBTC = exchange.trade_volume_24h_btc || 0;
        const volumeUSD = volumeBTC * btcPrice;
        const marketShare = totalVolumeBTC
          ? ((volumeBTC / totalVolumeBTC) * 100).toFixed(2)
          : '—';

        return (
          <Collapse key={exchange.id} style={{ marginBottom: 12 }}>
            <Panel
              key={exchange.id}
              header={
                <Row align="middle" style={{ width: '100%' }}>
                  <Col span={6}>
                    <Text strong>{index + 1}.</Text>
                    <Avatar src={exchange.image} style={{ margin: '0 10px' }} />
                    <Text strong>{exchange.name}</Text>
                  </Col>
                  <Col span={6}>
                    {volumeUSD ? `$${millify(volumeUSD)}` : '—'}
                  </Col>
                  <Col span={6}>
                    {exchange.trust_score ? `${exchange.trust_score}/10` : '—'}
                  </Col>
                  <Col span={6}>{marketShare}%</Col>
                </Row>
              }
            >
              <Paragraph>
                <Text strong>Country:</Text> {exchange.country || '—'}<br />
                <Text strong>Year:</Text> {exchange.year_established || '—'}<br />
                <Text strong>Trust Rank:</Text> #{exchange.trust_score_rank || '—'}<br />
                <Text strong>Website: </Text>
                <a href={exchange.url} target="_blank" rel="noreferrer">
                  {exchange.url}
                </a>
              </Paragraph>
            </Panel>
          </Collapse>
        );
      })}
    </>
  );
};

export default Exchanges;

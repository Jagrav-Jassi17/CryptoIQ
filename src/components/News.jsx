import React from 'react';
import { Row, Col, Typography, Avatar, Card } from 'antd';
import moment from 'moment';
import { useGetCryptoNewsQuery } from '../services/cryptoNewsApi';
import Loader from './Loader';

const { Title, Text } = Typography;

const demoImage = 'https://www.bing.com/th?id=OVFT.mpzuVZnv8dwIMRfQGPbOPC&pid=News';

const News = ({ simplified }) => {
  const { data: cryptoNews, isFetching, error } = useGetCryptoNewsQuery();

  if (isFetching) return <Loader />;
  if (error) return <div>Error fetching news. Please try again later.</div>;

  if (!Array.isArray(cryptoNews?.data)) return <div>No valid news data found.</div>;

  const newsList = simplified ? cryptoNews.data.slice(0, 6) : cryptoNews.data.slice(0, 12);

  return (
    <Row gutter={[24, 24]}>
      {newsList.map((news, i) => (
        <Col xs={24} sm={12} lg={8} key={i}>
          <Card hoverable className="news-card">
            <a href={news.url} target="_blank" rel="noreferrer">
              <div className="news-image-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Title level={4} className="news-title" style={{ width: '70%' }}>
                  {news.title}
                </Title>
                <img
                  style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover', marginLeft: 10 }}
                  src={news.thumbnail || demoImage}
                  alt="news thumbnail"
                />
              </div>
              <p>
                {news.description?.length > 100
                  ? `${news.description.substring(0, 100)}...`
                  : news.description}
              </p>
              <div className="provider-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Avatar src={news.source?.icon || demoImage} alt="provider" />
                  <Text className="provider-name">{news.source?.name || 'Crypto Source'}</Text>
                </div>
                <Text>{moment(news.date).startOf('ss').fromNow()}</Text>
              </div>
            </a>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default News;

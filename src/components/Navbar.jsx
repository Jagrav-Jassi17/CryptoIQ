import React, { useState, useEffect } from 'react';
import { Button, Menu, Typography, Avatar } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  MoneyCollectOutlined,
  BulbOutlined,
  FundOutlined,
  MenuOutlined,
} from '@ant-design/icons';

import icon from '../images/cryptocurrency.png';

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(true);
  const [screenSize, setScreenSize] = useState(undefined);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial value

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setActiveMenu(screenSize > 800);
  }, [screenSize]);

  return (
    <div className="nav-container">
      <div className="logo-container">
        <div className="logo-left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Avatar src={icon} size="large" />
          <Typography.Title level={2} className="logo">
            <Link to="/">CryptoIQ</Link>
          </Typography.Title>
        </div>
        <Button
          className="menu-control-container"
          onClick={() => setActiveMenu(!activeMenu)}
          aria-label="Toggle menu"
        >
          <MenuOutlined />
        </Button>
      </div>

      {activeMenu && (
        <Menu theme="dark" selectedKeys={[location.pathname]}>
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="/cryptocurrencies" icon={<FundOutlined />}>
            <Link to="/cryptocurrencies">Cryptocurrencies</Link>
          </Menu.Item>
          <Menu.Item key="/exchanges" icon={<MoneyCollectOutlined />}>
            <Link to="/exchanges">Exchanges</Link>
          </Menu.Item>
          <Menu.Item key="/news" icon={<BulbOutlined />}>
            <Link to="/news">News</Link>
          </Menu.Item>
        </Menu>
      )}
    </div>
  );
};

export default Navbar;

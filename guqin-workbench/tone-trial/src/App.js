import React from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import GuqinListPage from './pages/GuqinListPage';
import GuqinDetailPage from './pages/GuqinDetailPage';
import WoodBlankPage from './pages/WoodBlankPage';
import LacquerPage from './pages/LacquerPage';
import TrialPage from './pages/TrialPage';
import OrderPage from './pages/OrderPage';

const NAV_ITEMS = [
  { to: '/guqins', label: '琴胚总览' },
  { to: '/wood-blanks', label: '木坯管理' },
  { to: '/lacquer', label: '髹漆记录' },
  { to: '/trials', label: '试音评价' },
  { to: '/orders', label: '预定交付' },
];

export default function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Noto Serif SC', 'Songti SC', serif" }}>
      <nav style={{
        width: 200, background: '#2c2c2c', color: '#d4c5a0',
        padding: '20px 0', flexShrink: 0,
      }}>
        <h2 style={{
          textAlign: 'center', fontSize: 18, marginBottom: 30,
          color: '#c9a96e', letterSpacing: 4,
        }}>古琴工坊</h2>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'block', padding: '12px 24px', color: isActive ? '#f5e6c8' : '#a09070',
              textDecoration: 'none', background: isActive ? '#3d3d3d' : 'transparent',
              borderLeft: isActive ? '3px solid #c9a96e' : '3px solid transparent',
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <main style={{ flex: 1, background: '#faf8f0', padding: 24, overflowY: 'auto' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/guqins" replace />} />
          <Route path="/guqins" element={<GuqinListPage />} />
          <Route path="/guqins/:id" element={<GuqinDetailPage />} />
          <Route path="/wood-blanks" element={<WoodBlankPage />} />
          <Route path="/lacquer" element={<LacquerPage />} />
          <Route path="/trials" element={<TrialPage />} />
          <Route path="/orders" element={<OrderPage />} />
        </Routes>
      </main>
    </div>
  );
}

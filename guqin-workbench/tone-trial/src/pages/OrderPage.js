import React, { useState, useEffect } from 'react';
import { ordersApi, processesApi } from '../api';

const STATUS_LABELS = {
  reserved: '已预定', deposit_paid: '定金已付', in_production: '制作中',
  ready_for_delivery: '待交付', delivered: '已交付', settled: '已结算',
};

const STATUS_COLORS = {
  reserved: '#8b7355', deposit_paid: '#a0855c', in_production: '#c9a96e',
  ready_for_delivery: '#7b9e89', delivered: '#5a8a6e', settled: '#3d6b4f',
};

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [guqins, setGuqins] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [orderForm, setOrderForm] = useState({
    guqin: '', customer: '', status: 'reserved',
    reserved_at: '', deposit_amount: '', total_amount: '', notes: '',
  });
  const [customerForm, setCustomerForm] = useState({ name: '', phone: '', address: '', notes: '' });

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    const [o, g, c] = await Promise.all([
      ordersApi.listOrders(),
      processesApi.listGuqins(),
      ordersApi.listCustomers(),
    ]);
    setOrders(o.data);
    setGuqins(g.data);
    setCustomers(c.data);
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    await ordersApi.createOrder({
      ...orderForm,
      deposit_amount: orderForm.deposit_amount || '0',
      total_amount: orderForm.total_amount || '0',
    });
    setOrderForm({ guqin: '', customer: '', status: 'reserved', reserved_at: '', deposit_amount: '', total_amount: '', notes: '' });
    setShowOrderForm(false);
    loadAll();
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    await ordersApi.createCustomer(customerForm);
    setCustomerForm({ name: '', phone: '', address: '', notes: '' });
    setShowCustomerForm(false);
    loadAll();
  };

  const handleStatusChange = async (id, newStatus) => {
    const updateData = { status: newStatus };
    if (newStatus === 'delivered') updateData.delivered_at = new Date().toISOString().slice(0, 10);
    if (newStatus === 'settled') updateData.settled_at = new Date().toISOString().slice(0, 10);
    await ordersApi.updateOrder(id, updateData);
    loadAll();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ color: '#3d3d3d', margin: 0 }}>预定交付</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowCustomerForm(!showCustomerForm)} style={btnStyle}>
            {showCustomerForm ? '取消' : '+ 新客户'}
          </button>
          <button onClick={() => setShowOrderForm(!showOrderForm)} style={{ ...btnStyle, background: '#5a8a6e' }}>
            {showOrderForm ? '取消' : '+ 新预定'}
          </button>
        </div>
      </div>

      {showCustomerForm && (
        <form onSubmit={handleCreateCustomer} style={{
          background: '#fff', padding: 20, borderRadius: 8,
          marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>姓名</label>
              <input style={inputStyle} value={customerForm.name}
                onChange={e => setCustomerForm({ ...customerForm, name: e.target.value })} required />
            </div>
            <div>
              <label style={labelStyle}>电话</label>
              <input style={inputStyle} value={customerForm.phone}
                onChange={e => setCustomerForm({ ...customerForm, phone: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>地址</label>
              <input style={inputStyle} value={customerForm.address}
                onChange={e => setCustomerForm({ ...customerForm, address: e.target.value })} />
            </div>
          </div>
          <button type="submit" style={{ ...btnStyle, background: '#5a8a6e', marginTop: 12 }}>创建客户</button>
        </form>
      )}

      {showOrderForm && (
        <form onSubmit={handleCreateOrder} style={{
          background: '#fff', padding: 20, borderRadius: 8,
          marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>琴</label>
              <select style={inputStyle} value={orderForm.guqin}
                onChange={e => setOrderForm({ ...orderForm, guqin: e.target.value })} required>
                <option value="">-- 选择 --</option>
                {guqins.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>客户</label>
              <select style={inputStyle} value={orderForm.customer}
                onChange={e => setOrderForm({ ...orderForm, customer: e.target.value })} required>
                <option value="">-- 选择 --</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>预定日期</label>
              <input type="date" style={inputStyle} value={orderForm.reserved_at}
                onChange={e => setOrderForm({ ...orderForm, reserved_at: e.target.value })} required />
            </div>
            <div>
              <label style={labelStyle}>定金</label>
              <input type="number" step="0.01" style={inputStyle} value={orderForm.deposit_amount}
                onChange={e => setOrderForm({ ...orderForm, deposit_amount: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>总价</label>
              <input type="number" step="0.01" style={inputStyle} value={orderForm.total_amount}
                onChange={e => setOrderForm({ ...orderForm, total_amount: e.target.value })} />
            </div>
          </div>
          <button type="submit" style={{ ...btnStyle, background: '#5a8a6e', marginTop: 12 }}>创建预定</button>
        </form>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#f5f0e6' }}>
            <th style={thStyle}>琴</th><th style={thStyle}>客户</th>
            <th style={thStyle}>状态</th><th style={thStyle}>预定日期</th>
            <th style={thStyle}>定金</th><th style={thStyle}>总价</th>
            <th style={thStyle}>交付日期</th><th style={thStyle}>结算日期</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} style={{ borderBottom: '1px solid #ece7d8' }}>
              <td style={tdStyle}>{o.guqin_name}</td>
              <td style={tdStyle}>{o.customer_name}</td>
              <td style={tdStyle}>
                <select value={o.status}
                  onChange={e => handleStatusChange(o.id, e.target.value)}
                  style={{
                    padding: '2px 8px', border: '1px solid #d0c8b8', borderRadius: 4,
                    fontSize: 13, color: '#fff', background: STATUS_COLORS[o.status] || '#999',
                  }}>
                  {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </td>
              <td style={tdStyle}>{o.reserved_at}</td>
              <td style={tdStyle}>¥{Number(o.deposit_amount).toLocaleString()}</td>
              <td style={tdStyle}>¥{Number(o.total_amount).toLocaleString()}</td>
              <td style={tdStyle}>{o.delivered_at || '-'}</td>
              <td style={tdStyle}>{o.settled_at || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {orders.length === 0 && <p style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>暂无订单</p>}
    </div>
  );
}

const btnStyle = { padding: '8px 16px', border: 'none', borderRadius: 6, background: '#c9a96e', color: '#fff', cursor: 'pointer' };
const labelStyle = { display: 'block', marginBottom: 4, fontSize: 13, color: '#666' };
const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #d0c8b8', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' };
const thStyle = { padding: '10px 12px', textAlign: 'left', fontSize: 13, color: '#666', fontWeight: 600 };
const tdStyle = { padding: '10px 12px', fontSize: 14, color: '#3d3d3d' };

import React, { useState, useEffect } from 'react';
import { materialsApi, processesApi } from '../api';

const WOOD_LABELS = { paulownia: '桐木', fir: '杉木', other: '其他' };
const DRY_LABELS = { natural: '自然阴干', kiln: '烘房干燥', ready: '阴干完成' };

export default function WoodBlankPage() {
  const [blanks, setBlanks] = useState([]);
  const [guqins, setGuqins] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    batch_number: '', source: '', wood_type: 'paulownia',
    drying_status: 'natural', received_at: '', guqin: '', notes: '',
  });

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    const [b, g] = await Promise.all([
      materialsApi.listWoodBlanks(),
      processesApi.listGuqins(),
    ]);
    setBlanks(b.data);
    setGuqins(g.data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const data = { ...form };
    if (!data.guqin) delete data.guqin;
    await materialsApi.createWoodBlank(data);
    setForm({
      batch_number: '', source: '', wood_type: 'paulownia',
      drying_status: 'natural', received_at: '', guqin: '', notes: '',
    });
    setShowForm(false);
    loadAll();
  };

  const handleStatusChange = async (id, newStatus) => {
    await materialsApi.updateWoodBlank(id, { drying_status: newStatus });
    loadAll();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ color: '#3d3d3d', margin: 0 }}>木坯管理</h1>
        <button onClick={() => setShowForm(!showForm)} style={btnStyle}>
          {showForm ? '取消' : '+ 登记木坯'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{
          background: '#fff', padding: 20, borderRadius: 8,
          marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>批次号</label>
              <input style={inputStyle} value={form.batch_number}
                onChange={e => setForm({ ...form, batch_number: e.target.value })} required />
            </div>
            <div>
              <label style={labelStyle}>来源</label>
              <input style={inputStyle} value={form.source}
                onChange={e => setForm({ ...form, source: e.target.value })} required />
            </div>
            <div>
              <label style={labelStyle}>木材类型</label>
              <select style={inputStyle} value={form.wood_type}
                onChange={e => setForm({ ...form, wood_type: e.target.value })}>
                <option value="paulownia">桐木</option>
                <option value="fir">杉木</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>阴干状态</label>
              <select style={inputStyle} value={form.drying_status}
                onChange={e => setForm({ ...form, drying_status: e.target.value })}>
                <option value="natural">自然阴干</option>
                <option value="kiln">烘房干燥</option>
                <option value="ready">阴干完成</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>入库日期</label>
              <input type="date" style={inputStyle} value={form.received_at}
                onChange={e => setForm({ ...form, received_at: e.target.value })} required />
            </div>
            <div>
              <label style={labelStyle}>关联琴</label>
              <select style={inputStyle} value={form.guqin}
                onChange={e => setForm({ ...form, guqin: e.target.value })}>
                <option value="">-- 不关联 --</option>
                {guqins.map(g => <option key={g.id} value={g.id}>{g.name}（{g.serial_number}）</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={labelStyle}>备注</label>
            <textarea style={{ ...inputStyle, height: 60 }} value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>
          <button type="submit" style={{ ...btnStyle, background: '#5a8a6e', marginTop: 12 }}>登记</button>
        </form>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#f5f0e6' }}>
            <th style={thStyle}>批次号</th><th style={thStyle}>来源</th>
            <th style={thStyle}>木材</th><th style={thStyle}>阴干状态</th>
            <th style={thStyle}>入库日期</th><th style={thStyle}>关联琴</th>
          </tr>
        </thead>
        <tbody>
          {blanks.map(b => (
            <tr key={b.id} style={{ borderBottom: '1px solid #ece7d8' }}>
              <td style={tdStyle}>{b.batch_number}</td>
              <td style={tdStyle}>{b.source}</td>
              <td style={tdStyle}>{WOOD_LABELS[b.wood_type]}</td>
              <td style={tdStyle}>
                <select value={b.drying_status}
                  onChange={e => handleStatusChange(b.id, e.target.value)}
                  style={{ padding: '2px 8px', border: '1px solid #d0c8b8', borderRadius: 4, fontSize: 13 }}>
                  {Object.entries(DRY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </td>
              <td style={tdStyle}>{b.received_at}</td>
              <td style={tdStyle}>{b.guqin_name || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {blanks.length === 0 && <p style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>暂无木坯记录</p>}
    </div>
  );
}

const btnStyle = { padding: '8px 16px', border: 'none', borderRadius: 6, background: '#c9a96e', color: '#fff', cursor: 'pointer' };
const labelStyle = { display: 'block', marginBottom: 4, fontSize: 13, color: '#666' };
const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #d0c8b8', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' };
const thStyle = { padding: '10px 12px', textAlign: 'left', fontSize: 13, color: '#666', fontWeight: 600 };
const tdStyle = { padding: '10px 12px', fontSize: 14, color: '#3d3d3d' };

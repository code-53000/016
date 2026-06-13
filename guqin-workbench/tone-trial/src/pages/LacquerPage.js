import React, { useState, useEffect } from 'react';
import { materialsApi, processesApi } from '../api';

const LACQUER_LABELS = { raw: '生漆', refined: '熟漆', mix: '调配漆' };

export default function LacquerPage() {
  const [records, setRecords] = useState([]);
  const [guqins, setGuqins] = useState([]);
  const [filterGuqin, setFilterGuqin] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    guqin: '', coat_number: 1, lacquer_type: 'raw', applied_at: '', dried_at: '', notes: '',
  });

  useEffect(() => { loadGuqins(); }, []);

  const loadGuqins = async () => {
    const res = await processesApi.listGuqins();
    setGuqins(res.data);
  };

  useEffect(() => { loadRecords(); }, [filterGuqin]);

  const loadRecords = async () => {
    const res = await materialsApi.listLacquerRecords(filterGuqin || undefined);
    setRecords(res.data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const data = { ...form };
    if (!data.dried_at) delete data.dried_at;
    await materialsApi.createLacquerRecord(data);
    setForm({ guqin: '', coat_number: 1, lacquer_type: 'raw', applied_at: '', dried_at: '', notes: '' });
    setShowForm(false);
    loadRecords();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ color: '#3d3d3d', margin: 0 }}>髹漆记录</h1>
        <button onClick={() => setShowForm(!showForm)} style={btnStyle}>
          {showForm ? '取消' : '+ 登记髹漆'}
        </button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>按琴筛选</label>
        <select style={{ ...inputStyle, width: 250 }} value={filterGuqin}
          onChange={e => setFilterGuqin(e.target.value)}>
          <option value="">全部</option>
          {guqins.map(g => <option key={g.id} value={g.id}>{g.name}（{g.serial_number}）</option>)}
        </select>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{
          background: '#fff', padding: 20, borderRadius: 8,
          marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>琴</label>
              <select style={inputStyle} value={form.guqin}
                onChange={e => setForm({ ...form, guqin: e.target.value })} required>
                <option value="">-- 选择 --</option>
                {guqins.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>第几遍</label>
              <input type="number" min="1" style={inputStyle} value={form.coat_number}
                onChange={e => setForm({ ...form, coat_number: parseInt(e.target.value) })} required />
            </div>
            <div>
              <label style={labelStyle}>漆料类型</label>
              <select style={inputStyle} value={form.lacquer_type}
                onChange={e => setForm({ ...form, lacquer_type: e.target.value })}>
                <option value="raw">生漆</option>
                <option value="refined">熟漆</option>
                <option value="mix">调配漆</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>涂漆日期</label>
              <input type="date" style={inputStyle} value={form.applied_at}
                onChange={e => setForm({ ...form, applied_at: e.target.value })} required />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, marginTop: 12 }}>
            <div>
              <label style={labelStyle}>干透日期</label>
              <input type="date" style={inputStyle} value={form.dried_at}
                onChange={e => setForm({ ...form, dried_at: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>备注</label>
              <input style={inputStyle} value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
          <button type="submit" style={{ ...btnStyle, background: '#5a8a6e', marginTop: 12 }}>登记</button>
        </form>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#f5f0e6' }}>
            <th style={thStyle}>琴名</th><th style={thStyle}>遍次</th>
            <th style={thStyle}>漆料</th><th style={thStyle}>涂漆日期</th>
            <th style={thStyle}>干透日期</th><th style={thStyle}>备注</th>
          </tr>
        </thead>
        <tbody>
          {records.map(r => (
            <tr key={r.id} style={{ borderBottom: '1px solid #ece7d8' }}>
              <td style={tdStyle}>{r.guqin_name}</td>
              <td style={tdStyle}>第{r.coat_number}遍</td>
              <td style={tdStyle}>{LACQUER_LABELS[r.lacquer_type]}</td>
              <td style={tdStyle}>{r.applied_at}</td>
              <td style={tdStyle}>{r.dried_at || '未干透'}</td>
              <td style={tdStyle}>{r.notes || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {records.length === 0 && <p style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>暂无髹漆记录</p>}
    </div>
  );
}

const btnStyle = { padding: '8px 16px', border: 'none', borderRadius: 6, background: '#c9a96e', color: '#fff', cursor: 'pointer' };
const labelStyle = { display: 'block', marginBottom: 4, fontSize: 13, color: '#666' };
const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #d0c8b8', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' };
const thStyle = { padding: '10px 12px', textAlign: 'left', fontSize: 13, color: '#666', fontWeight: 600 };
const tdStyle = { padding: '10px 12px', fontSize: 14, color: '#3d3d3d' };

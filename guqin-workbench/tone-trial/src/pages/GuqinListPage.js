import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { processesApi } from '../api';

const STAGE_LABELS = {
  drying: '木坯阴干', grooving: '开槽', assembling: '合琴',
  lacquering: '髹漆', trial: '试音', finished: '完工',
};

const STAGE_COLORS = {
  drying: '#8b7355', grooving: '#a0855c', assembling: '#b89a6b',
  lacquering: '#c9a96e', trial: '#7b9e89', finished: '#5a8a6e',
};

export default function GuqinListPage() {
  const [guqins, setGuqins] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', serial_number: '' });
  const navigate = useNavigate();

  useEffect(() => { loadGuqins(); }, []);

  const loadGuqins = async () => {
    const res = await processesApi.listGuqins();
    setGuqins(res.data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await processesApi.createGuqin(form);
    setForm({ name: '', serial_number: '' });
    setShowForm(false);
    loadGuqins();
  };

  const handleAdvance = async (id) => {
    await processesApi.advanceStage(id);
    loadGuqins();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ color: '#3d3d3d', margin: 0 }}>琴胚总览</h1>
        <button onClick={() => setShowForm(!showForm)} style={btnStyle}>
          {showForm ? '取消' : '+ 新建琴胚'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{
          background: '#fff', padding: 20, borderRadius: 8,
          marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>琴名</label>
              <input style={inputStyle} value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>编号</label>
              <input style={inputStyle} value={form.serial_number}
                onChange={e => setForm({ ...form, serial_number: e.target.value })} required />
            </div>
            <button type="submit" style={{ ...btnStyle, background: '#5a8a6e' }}>创建</button>
          </div>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {guqins.map(g => (
          <div key={g.id} style={{
            background: '#fff', borderRadius: 8, padding: 20,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', cursor: 'pointer',
          }} onClick={() => navigate(`/guqins/${g.id}`)}>
            <h3 style={{ margin: '0 0 8px 0', color: '#3d3d3d' }}>{g.name}</h3>
            <p style={{ margin: '4px 0', color: '#888', fontSize: 13 }}>{g.serial_number}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
              <span style={{
                background: STAGE_COLORS[g.current_stage] || '#999',
                color: '#fff', padding: '4px 12px', borderRadius: 12, fontSize: 13,
              }}>
                {STAGE_LABELS[g.current_stage] || g.current_stage}
              </span>
              <button onClick={(e) => { e.stopPropagation(); handleAdvance(g.id); }}
                style={{ ...btnStyle, fontSize: 12, padding: '4px 10px' }}
                disabled={g.current_stage === 'finished'}>
                推进工序 →
              </button>
            </div>
          </div>
        ))}
      </div>

      {guqins.length === 0 && (
        <p style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>暂无琴胚，点击上方按钮新建</p>
      )}
    </div>
  );
}

const btnStyle = {
  padding: '8px 16px', border: 'none', borderRadius: 6,
  background: '#c9a96e', color: '#fff', cursor: 'pointer', fontSize: 14,
};

const labelStyle = { display: 'block', marginBottom: 4, fontSize: 13, color: '#666' };

const inputStyle = {
  width: '100%', padding: '8px 12px', border: '1px solid #d0c8b8',
  borderRadius: 6, fontSize: 14, boxSizing: 'border-box',
};

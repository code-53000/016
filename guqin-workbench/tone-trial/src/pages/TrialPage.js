import React, { useState, useEffect } from 'react';
import { trialsApi, processesApi } from '../api';

const RATING_OPTIONS = [
  { value: 1, label: '差' }, { value: 2, label: '一般' },
  { value: 3, label: '良好' }, { value: 4, label: '优秀' }, { value: 5, label: '绝佳' },
];

export default function TrialPage() {
  const [trials, setTrials] = useState([]);
  const [guqins, setGuqins] = useState([]);
  const [filterGuqin, setFilterGuqin] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    guqin: '', trial_date: '', san_rating: '', an_rating: '',
    fan_rating: '', noise_description: '', overall_rating: '', tester: '', notes: '',
  });

  useEffect(() => { loadGuqins(); }, []);

  const loadGuqins = async () => {
    const res = await processesApi.listGuqins();
    setGuqins(res.data);
  };

  useEffect(() => { loadTrials(); }, [filterGuqin]);

  const loadTrials = async () => {
    const res = await trialsApi.listTrials(filterGuqin || undefined);
    setTrials(res.data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      san_rating: form.san_rating ? parseInt(form.san_rating) : null,
      an_rating: form.an_rating ? parseInt(form.an_rating) : null,
      fan_rating: form.fan_rating ? parseInt(form.fan_rating) : null,
      overall_rating: form.overall_rating ? parseInt(form.overall_rating) : null,
    };
    await trialsApi.createTrial(data);
    setForm({
      guqin: '', trial_date: '', san_rating: '', an_rating: '',
      fan_rating: '', noise_description: '', overall_rating: '', tester: '', notes: '',
    });
    setShowForm(false);
    loadTrials();
  };

  const ratingLabel = (v) => {
    const opt = RATING_OPTIONS.find(o => o.value === v);
    return opt ? opt.label : '-';
  };

  const ratingColor = (v) => {
    if (v >= 4) return '#5a8a6e';
    if (v === 3) return '#c9a96e';
    return '#b85c38';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ color: '#3d3d3d', margin: 0 }}>试音评价</h1>
        <button onClick={() => setShowForm(!showForm)} style={btnStyle}>
          {showForm ? '取消' : '+ 新增试音'}
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>琴</label>
              <select style={inputStyle} value={form.guqin}
                onChange={e => setForm({ ...form, guqin: e.target.value })} required>
                <option value="">-- 选择 --</option>
                {guqins.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>试音日期</label>
              <input type="date" style={inputStyle} value={form.trial_date}
                onChange={e => setForm({ ...form, trial_date: e.target.value })} required />
            </div>
            <div>
              <label style={labelStyle}>试音人</label>
              <input style={inputStyle} value={form.tester}
                onChange={e => setForm({ ...form, tester: e.target.value })} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginTop: 12 }}>
            <div>
              <label style={labelStyle}>散音评分</label>
              <select style={inputStyle} value={form.san_rating}
                onChange={e => setForm({ ...form, san_rating: e.target.value })}>
                <option value="">--</option>
                {RATING_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>按音评分</label>
              <select style={inputStyle} value={form.an_rating}
                onChange={e => setForm({ ...form, an_rating: e.target.value })}>
                <option value="">--</option>
                {RATING_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>泛音评分</label>
              <select style={inputStyle} value={form.fan_rating}
                onChange={e => setForm({ ...form, fan_rating: e.target.value })}>
                <option value="">--</option>
                {RATING_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>整体评分</label>
              <select style={inputStyle} value={form.overall_rating}
                onChange={e => setForm({ ...form, overall_rating: e.target.value })}>
                <option value="">--</option>
                {RATING_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={labelStyle}>杂音描述</label>
            <textarea style={{ ...inputStyle, height: 60 }} value={form.noise_description}
              onChange={e => setForm({ ...form, noise_description: e.target.value })} />
          </div>
          <button type="submit" style={{ ...btnStyle, background: '#5a8a6e', marginTop: 12 }}>提交</button>
        </form>
      )}

      {trials.map(t => (
        <div key={t.id} style={{
          background: '#fff', borderRadius: 8, padding: 20, marginBottom: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h3 style={{ margin: 0, color: '#3d3d3d' }}>{t.guqin_name}</h3>
            <span style={{ fontSize: 13, color: '#888' }}>{t.trial_date}　试音人：{t.tester || '-'}</span>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {[
              { label: '散音', val: t.san_rating },
              { label: '按音', val: t.an_rating },
              { label: '泛音', val: t.fan_rating },
              { label: '综合', val: t.overall_rating },
            ].map(item => (
              <div key={item.label} style={{
                background: '#f9f7f0', padding: '8px 16px', borderRadius: 6, textAlign: 'center', minWidth: 80,
              }}>
                <div style={{ fontSize: 12, color: '#888' }}>{item.label}</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: ratingColor(item.val) }}>
                  {ratingLabel(item.val)}
                </div>
              </div>
            ))}
          </div>
          {t.noise_description && (
            <p style={{ margin: '8px 0 0', color: '#b85c38', fontSize: 14 }}>
              <strong>杂音：</strong>{t.noise_description}
            </p>
          )}
        </div>
      ))}

      {trials.length === 0 && <p style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>暂无试音记录</p>}
    </div>
  );
}

const btnStyle = { padding: '8px 16px', border: 'none', borderRadius: 6, background: '#c9a96e', color: '#fff', cursor: 'pointer' };
const labelStyle = { display: 'block', marginBottom: 4, fontSize: 13, color: '#666' };
const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #d0c8b8', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' };

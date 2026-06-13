import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { processesApi, materialsApi, trialsApi, ordersApi } from '../api';

const STAGE_LABELS = {
  drying: '木坯阴干', grooving: '开槽', assembling: '合琴',
  lacquering: '髹漆', trial: '试音', finished: '完工',
};

const RATING_LABELS = { 1: '差', 2: '一般', 3: '良好', 4: '优秀', 5: '绝佳' };

export default function GuqinDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guqin, setGuqin] = useState(null);
  const [lacquers, setLacquers] = useState([]);
  const [trials, setTrials] = useState([]);

  useEffect(() => { loadAll(); }, [id]);

  const loadAll = async () => {
    const [g, l, t] = await Promise.all([
      processesApi.getGuqin(id),
      materialsApi.listLacquerRecords(id),
      trialsApi.listTrials(id),
    ]);
    setGuqin(g.data);
    setLacquers(l.data);
    setTrials(t.data);
  };

  if (!guqin) return <p style={{ color: '#999' }}>加载中...</p>;

  return (
    <div>
      <button onClick={() => navigate('/guqins')} style={{ ...btnStyle, background: '#888', marginBottom: 16 }}>← 返回</button>

      <div style={{
        background: '#fff', borderRadius: 8, padding: 24, marginBottom: 20,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}>
        <h1 style={{ margin: '0 0 8px', color: '#3d3d3d' }}>{guqin.name}</h1>
        <p style={{ color: '#888', margin: '4px 0' }}>编号：{guqin.serial_number}</p>
        <p style={{ color: '#888', margin: '4px 0' }}>当前工序：{STAGE_LABELS[guqin.current_stage]}</p>
      </div>

      <Section title="工序流转">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f0e6' }}>
              <th style={thStyle}>工序</th><th style={thStyle}>开始时间</th>
              <th style={thStyle}>完成时间</th><th style={thStyle}>操作人</th>
            </tr>
          </thead>
          <tbody>
            {guqin.stages.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid #ece7d8' }}>
                <td style={tdStyle}>{STAGE_LABELS[s.stage]}</td>
                <td style={tdStyle}>{fmtDt(s.started_at)}</td>
                <td style={tdStyle}>{s.completed_at ? fmtDt(s.completed_at) : '进行中'}</td>
                <td style={tdStyle}>{s.operator || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="髹漆记录">
        {lacquers.length === 0 ? <p style={{ color: '#999' }}>暂无髹漆记录</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f0e6' }}>
                <th style={thStyle}>遍次</th><th style={thStyle}>漆料</th>
                <th style={thStyle}>涂漆日期</th><th style={thStyle}>干透日期</th>
              </tr>
            </thead>
            <tbody>
              {lacquers.map(l => (
                <tr key={l.id} style={{ borderBottom: '1px solid #ece7d8' }}>
                  <td style={tdStyle}>第{l.coat_number}遍</td>
                  <td style={tdStyle}>{l.lacquer_type_display}</td>
                  <td style={tdStyle}>{l.applied_at}</td>
                  <td style={tdStyle}>{l.dried_at || '未干透'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      <Section title="试音评价">
        {trials.length === 0 ? <p style={{ color: '#999' }}>暂无试音记录</p> : (
          trials.map(t => (
            <div key={t.id} style={{
              background: '#f9f7f0', padding: 16, borderRadius: 6, marginBottom: 8,
            }}>
              <p style={{ margin: '4px 0' }}><strong>日期：</strong>{t.trial_date}　<strong>试音人：</strong>{t.tester || '-'}</p>
              <p style={{ margin: '4px 0' }}>
                散音：{RATING_LABELS[t.san_rating] || '-'}　
                按音：{RATING_LABELS[t.an_rating] || '-'}　
                泛音：{RATING_LABELS[t.fan_rating] || '-'}　
                综合：{RATING_LABELS[t.overall_rating] || '-'}
              </p>
              {t.noise_description && (
                <p style={{ margin: '4px 0', color: '#b85c38' }}><strong>杂音描述：</strong>{t.noise_description}</p>
              )}
            </div>
          ))
        )}
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 8, padding: 20, marginBottom: 16,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}>
      <h2 style={{ margin: '0 0 12px', fontSize: 18, color: '#3d3d3d', borderBottom: '2px solid #c9a96e', paddingBottom: 8 }}>{title}</h2>
      {children}
    </div>
  );
}

const fmtDt = (s) => s ? s.slice(0, 16).replace('T', ' ') : '-';

const btnStyle = { padding: '8px 16px', border: 'none', borderRadius: 6, background: '#c9a96e', color: '#fff', cursor: 'pointer' };
const thStyle = { padding: '10px 12px', textAlign: 'left', fontSize: 13, color: '#666', fontWeight: 600 };
const tdStyle = { padding: '10px 12px', fontSize: 14, color: '#3d3d3d' };

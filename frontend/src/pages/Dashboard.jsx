import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/').then(res => setData(res.data))
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="grid grid-4">
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 120 }} />)}
        </div>
      </div>
    );
  }

  if (!data) return <div className="page-container"><p>Failed to load dashboard.</p></div>;

  const { stats, my_tasks, overdue_tasks, projects } = data;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of all your projects and tasks</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-4" style={{ marginBottom: 'var(--space-7)' }}>
        <div className="stat-card">
          <div className="stat-value">{stats.total_projects}</div>
          <div className="stat-label">Projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.total_tasks}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.done}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className={`stat-card ${stats.overdue > 0 ? 'section-inverted' : ''}`}>
          <div className="stat-value">{stats.overdue}</div>
          <div className="stat-label">Overdue</div>
        </div>
      </div>

      {/* My Tasks + Task Breakdown */}
      <div className="grid grid-2" style={{ marginBottom: 'var(--space-7)' }}>
        <div className="card">
          <div className="card-body">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-5)' }}>
              My Tasks
            </h3>
            <div className="grid grid-3">
              <div style={{ textAlign: 'center', padding: 'var(--space-4)', border: 'var(--border-thin)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 800 }}>{my_tasks.todo}</div>
                <div style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', color: 'var(--fg-muted)', marginTop: 'var(--space-1)' }}>To Do</div>
              </div>
              <div style={{ textAlign: 'center', padding: 'var(--space-4)', border: 'var(--border-thin)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 800 }}>{my_tasks.in_progress}</div>
                <div style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', color: 'var(--fg-muted)', marginTop: 'var(--space-1)' }}>Active</div>
              </div>
              <div style={{ textAlign: 'center', padding: 'var(--space-4)', background: 'var(--black)', color: 'var(--white)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 800 }}>{my_tasks.done}</div>
                <div style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', color: 'var(--gray-400)', marginTop: 'var(--space-1)' }}>Done</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-5)' }}>
              Task Breakdown
            </h3>
            {stats.total_tasks > 0 ? (
              <div>
                {[
                  { label: 'To Do', val: stats.todo },
                  { label: 'In Progress', val: stats.in_progress },
                  { label: 'Completed', val: stats.done },
                ].map(item => (
                  <div key={item.label} style={{ marginBottom: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
                      <span style={{ textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>{item.label}</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{item.val}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${(item.val / stats.total_tasks) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--fg-muted)', fontStyle: 'italic' }}>No tasks yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Overdue Tasks */}
      {overdue_tasks.length > 0 && (
        <div className="section-inverted" style={{ marginBottom: 'var(--space-7)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-5)' }}>
            Overdue Tasks
          </h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ color: 'var(--gray-400)', borderColor: 'var(--gray-700)' }}>Task</th>
                  <th style={{ color: 'var(--gray-400)', borderColor: 'var(--gray-700)' }}>Due Date</th>
                  <th style={{ color: 'var(--gray-400)', borderColor: 'var(--gray-700)' }}>Priority</th>
                </tr>
              </thead>
              <tbody>
                {overdue_tasks.map(t => (
                  <tr key={t.id}>
                    <td style={{ borderColor: 'var(--gray-800)', fontWeight: 500 }}>{t.title}</td>
                    <td style={{ borderColor: 'var(--gray-800)' }}>{t.due_date}</td>
                    <td style={{ borderColor: 'var(--gray-800)' }}><span className={`badge badge-${t.priority}`}>{t.priority}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Projects Overview */}
      {projects.length > 0 && (
        <div className="card">
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-5)', paddingBottom: 'var(--space-3)', borderBottom: 'var(--border-thick)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 700 }}>Projects</h3>
              <Link to="/projects" className="btn btn-secondary btn-sm">View All</Link>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Project</th><th>Role</th><th>Tasks</th><th>Done</th><th>Overdue</th><th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(p => (
                    <tr key={p.id}>
                      <td>
                        <Link to={`/projects/${p.id}`} className="auth-link" style={{ fontWeight: 600 }}>{p.name}</Link>
                      </td>
                      <td><span className={`badge badge-${p.my_role}`}>{p.my_role}</span></td>
                      <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{p.total_tasks}</td>
                      <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{p.done_tasks}</td>
                      <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{p.overdue_tasks}</td>
                      <td style={{ minWidth: 100 }}>
                        <div className="progress-bar">
                          <div className="progress-bar-fill" style={{ width: p.total_tasks > 0 ? `${(p.done_tasks / p.total_tasks) * 100}%` : '0%' }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

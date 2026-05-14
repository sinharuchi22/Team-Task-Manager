import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Modal from '../components/Modal';

const STATUS_COLS = [
  { key: 'todo', label: 'To Do' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
];

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', status: 'todo', priority: 'medium', due_date: '', assigned_to: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    api.get(`/projects/${id}`).then(res => setProject(res.data.project))
      .catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const isAdmin = project?.my_role === 'admin';

  const openCreate = () => {
    setEditingTask(null);
    setTaskForm({ title: '', description: '', status: 'todo', priority: 'medium', due_date: '', assigned_to: '' });
    setError('');
    setShowTaskModal(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      due_date: task.due_date || '',
      assigned_to: task.assigned_to || '',
    });
    setError('');
    setShowTaskModal(true);
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;
    setSaving(true);
    setError('');
    try {
      const payload = { ...taskForm };
      if (!payload.assigned_to) payload.assigned_to = null;
      if (!payload.due_date) payload.due_date = null;

      if (editingTask) {
        await api.put(`/projects/${id}/tasks/${editingTask.id}`, payload);
      } else {
        await api.post(`/projects/${id}/tasks`, payload);
      }
      setShowTaskModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await api.put(`/projects/${id}/tasks/${task.id}`, { status: newStatus });
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/projects/${id}/tasks/${taskId}`);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="kanban">
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 400 }} />)}
        </div>
      </div>
    );
  }

  if (!project) return <div className="page-container"><p>Project not found.</p></div>;

  const tasks = project.tasks || [];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">{project.name}</h1>
          <p className="page-subtitle">{project.description || 'No description'}</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Link to={`/projects/${id}/team`} className="btn btn-secondary">Team — {project.member_count}</Link>
          {isAdmin && <button id="create-task-btn" className="btn btn-primary" onClick={openCreate}>New Task</button>}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="kanban">
        {STATUS_COLS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.key);
          return (
            <div className="kanban-column" key={col.key}>
              <div className="kanban-header">
                <span className="kanban-title">{col.label}</span>
                <span className="kanban-count">{colTasks.length}</span>
              </div>
              <div className="kanban-cards">
                {colTasks.map(task => (
                  <div className="task-card" key={task.id} onClick={() => openEdit(task)} role="button" tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && openEdit(task)}>
                    <div className="task-card-title">{task.title}</div>
                    <div className="task-card-meta">
                      <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                      {task.due_date && (
                        <span style={task.is_overdue ? { fontWeight: 700, textDecoration: 'underline' } : {}}>
                          {task.due_date}
                        </span>
                      )}
                      {task.assignee && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                          <span className="avatar" style={{ width: 18, height: 18, fontSize: '0.55rem' }}>
                            {task.assignee.name.charAt(0)}
                          </span>
                          {task.assignee.name.split(' ')[0]}
                        </span>
                      )}
                    </div>
                    {/* Quick status buttons */}
                    <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }} onClick={e => e.stopPropagation()}>
                      {STATUS_COLS.filter(s => s.key !== task.status).map(s => (
                        <button key={s.key} className="btn btn-secondary btn-sm"
                          onClick={() => handleStatusChange(task, s.key)}>
                          {s.label}
                        </button>
                      ))}
                      {isAdmin && (
                        <button className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(task.id)} aria-label={`Delete ${task.title}`}>
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {colTasks.length === 0 && (
                  <div style={{ textAlign: 'center', padding: 'var(--space-7)', color: 'var(--fg-muted)', fontSize: 'var(--text-sm)', fontStyle: 'italic', borderTop: 'var(--border-thin)', borderStyle: 'dashed' }}>
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Modal */}
      <Modal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)}
        title={editingTask ? 'Edit Task' : 'New Task'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowTaskModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSaveTask} disabled={saving}>
              {saving ? 'Saving...' : (editingTask ? 'Update' : 'Create')}
            </button>
          </>
        }
      >
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSaveTask}>
          <div className="form-group">
            <label className="form-label" htmlFor="task-title">Title</label>
            <input id="task-title" className="form-input" placeholder="Task title" value={taskForm.title}
              onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} required disabled={!isAdmin && editingTask} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="task-desc">Description</label>
            <textarea id="task-desc" className="form-textarea" placeholder="Details about this task" value={taskForm.description}
              onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} disabled={!isAdmin && editingTask} />
          </div>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="task-status">Status</label>
              <select id="task-status" className="form-select" value={taskForm.status}
                onChange={e => setTaskForm({ ...taskForm, status: e.target.value })}>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="task-priority">Priority</label>
              <select id="task-priority" className="form-select" value={taskForm.priority}
                onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })} disabled={!isAdmin && editingTask}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="task-due">Due Date</label>
              <input id="task-due" type="date" className="form-input" value={taskForm.due_date}
                onChange={e => setTaskForm({ ...taskForm, due_date: e.target.value })} disabled={!isAdmin && editingTask} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="task-assign">Assign To</label>
              <select id="task-assign" className="form-select" value={taskForm.assigned_to}
                onChange={e => setTaskForm({ ...taskForm, assigned_to: e.target.value })} disabled={!isAdmin && editingTask}>
                <option value="">Unassigned</option>
                {(project.members || []).map(m => (
                  <option key={m.user_id} value={m.user_id}>{m.user?.name} ({m.role})</option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

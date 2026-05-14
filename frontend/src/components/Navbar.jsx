import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/projects') return 'Projects';
    if (path.startsWith('/projects/') && path.includes('/team')) return 'Team';
    if (path.startsWith('/projects/')) return 'Project';
    return '';
  };

  return (
    <nav className="navbar" role="banner">
      <span className="navbar-title">{getPageTitle()}</span>
      <div className="navbar-right">
        <div className="navbar-user">
          <div className="avatar avatar-sm">{user?.name?.charAt(0).toUpperCase()}</div>
          <span className="navbar-name">{user?.name}</span>
        </div>
        <button onClick={logout} className="btn btn-secondary btn-sm" aria-label="Sign out">
          Sign Out
        </button>
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          right: 0;
          left: var(--sidebar-width);
          height: var(--navbar-height);
          background: var(--white);
          border-bottom: var(--border-thick);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--space-7);
          z-index: 100;
        }

        .navbar-title {
          font-family: var(--font-body);
          font-size: var(--text-xs);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: var(--tracking-wide);
          color: var(--fg-muted);
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .navbar-user {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .navbar-name {
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--fg);
        }
      `}</style>
    </nav>
  );
}

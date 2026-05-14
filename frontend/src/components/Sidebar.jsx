import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/projects', label: 'Projects' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar" role="navigation" aria-label="Main navigation">
      <div className="sidebar-brand">
        <h1 className="sidebar-logo">Team<br/>Tasker</h1>
      </div>

      <nav className="sidebar-nav">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        Est. 2025
      </div>

      <style>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: var(--sidebar-width);
          background: var(--black);
          color: var(--white);
          display: flex;
          flex-direction: column;
          z-index: 200;
          border-right: var(--border-extra);
        }

        .sidebar-brand {
          padding: var(--space-6) var(--space-5);
          border-bottom: 1px solid var(--gray-800);
        }

        .sidebar-logo {
          font-family: var(--font-display);
          font-size: var(--text-2xl);
          font-weight: 900;
          line-height: var(--leading-tight);
          letter-spacing: var(--tracking-tight);
          text-transform: none;
        }

        .sidebar-nav {
          padding: var(--space-5) var(--space-4);
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .sidebar-link {
          display: block;
          padding: var(--space-3) var(--space-4);
          font-family: var(--font-body);
          font-size: var(--text-sm);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: var(--tracking-wide);
          color: var(--gray-400);
          text-decoration: none;
          border: 1px solid transparent;
          transition: color var(--duration-instant) var(--ease),
                      background var(--duration-instant) var(--ease);
        }

        .sidebar-link:hover {
          color: var(--white);
          background: var(--gray-900);
        }

        .sidebar-link--active {
          color: var(--white);
          background: var(--white);
          color: var(--black);
          font-weight: 700;
        }

        .sidebar-link:focus-visible {
          outline: 2px solid var(--white);
          outline-offset: 2px;
        }

        .sidebar-footer {
          padding: var(--space-4) var(--space-5);
          border-top: 1px solid var(--gray-800);
          font-size: var(--text-xs);
          color: var(--gray-600);
          letter-spacing: var(--tracking-wide);
          text-transform: uppercase;
        }
      `}</style>
    </aside>
  );
}

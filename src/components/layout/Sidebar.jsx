import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Dashboard, People, Assessment, Settings, ExpandMore, ErrorOutline, Search, Clear } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import './SidebarTheme.css';
import './Sidebar.css';
import './SidebarAnimations.css';

const Sidebar = ({ open, toggleSidebar }) => {
  const [reportsOpen, setReportsOpen] = useState(false);
  const [reportMenuItems, setReportMenuItems] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [reportError, setReportError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const location = useLocation();

  // Load report menu items from database
  useEffect(() => {
    const loadReportMenuItems = async () => {
      try {
        setLoadingReports(true);
        setReportError('');

        const response = await fetch('/api/reports/menu');
        if (!response.ok) {
          throw new Error(`Failed to load report menu: ${response.status}`);
        }

        const data = await response.json();
        setReportMenuItems(data.menuItems || []);
      } catch (error) {
        console.error('Error loading report menu items:', error);
        setReportError('Failed to load report menu');
        // Fallback to default menu items if API fails

      } finally {
        setLoadingReports(false);
      }
    };

    loadReportMenuItems();
  }, []);

  // Filter menu items based on search query
  const filteredMenuItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return reportMenuItems;
    }

    return reportMenuItems.filter(item =>
      item.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [reportMenuItems, searchQuery]);

  // Highlight search terms in text
  const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm.trim() || !text) return text;

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="sidebar-search-highlight">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
  };

  // Handle keyboard shortcuts
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Escape') {
      clearSearch();
    }
  };

  // Auto-expand reports when searching
  useEffect(() => {
    if (searchQuery.trim() && filteredMenuItems.length > 0) {
      setReportsOpen(true);
    }
  }, [searchQuery, filteredMenuItems]);

  // Global keyboard shortcut for search
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Focus search on "/" key (like GitHub, Discord, etc.)
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Only if no input is currently focused
        if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Helper function to convert menu item to route path
  const getRouteFromCaption = (menuItem) => {
    // Use the URL field from the database if available
    if (menuItem.url) {
      // Remove file extension for route path
      const componentName = menuItem.url.replace(/\.(jsx?|js?)$/, '');
      return `/reports/${componentName}`;
    }
    // Fallback: use caption-based routing
    const caption = menuItem.caption || menuItem;
    // Define specific route mappings for known reports
    const routeMapping = {
      'High-Value Transactions Report': '/reporthighvalue',
      'HighValue TransactionReport': '/reporthighvalue',
      'NEFT Transaction Report': '/reports/neft-transactions',
      'User Right Reports': '/reports/user-rights',
      'Change Password Log Report': '/reports/password-log',
      'EXCEPTION REPORTS': '/reports/exceptions',
      'Suspicious Cash Transactions Report': '/reports/ReportSuspiciousCashTrans'
    };
    // Check if we have a specific mapping
    if (routeMapping[caption]) {
      return routeMapping[caption];
    }
    // For other reports, create a standard route (no extension)
    return `/reports/${caption.replace(/\s+/g, '')}`;
  };

  // Helper function to truncate long menu names
  const truncateMenuName = (name, maxLength = 28) => {
    return name && name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
  };

  // Helper function to check if route is active
  const isActiveRoute = (routePath) => {
    return location.pathname === routePath;
  };

  return (
    <div className={`professional-sidebar ${open ? 'mobile-open' : ''}`} style={{ overflowY: 'auto', maxHeight: '100vh' }}>
      {/* Logo Section */}
      <div className="sidebar-logo-section">
        <img
          src="/vite.png"
          alt="Company Logo"
          className="sidebar-logo"
          onClick={toggleSidebar}
          style={{ cursor: 'pointer' }}
        />
      </div>

      {/* Search Section */}
      <div className="sidebar-search-section">
        <div className="sidebar-search-container">
          <input
            type="text"
            placeholder="Search reports... "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="sidebar-search-input"
            aria-label="Search reports"
            ref={searchInputRef}
          />
          <Search className="sidebar-search-icon" />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className={`sidebar-search-clear ${searchQuery ? 'visible' : ''}`}
              aria-label="Clear search"
              title="Clear search (ESC)"
            >
              <Clear style={{ fontSize: '1rem' }} />
            </button>
          )}
        </div>
        {searchQuery && (
          <div className="sidebar-search-results">
            {filteredMenuItems.length > 0 ? (
              `${filteredMenuItems.length} of ${reportMenuItems.length} reports found`
            ) : (
              'No reports found'
            )}
          </div>
        )}

      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav-list">
        {/* Admin Menu Item */}
        <Link
          to="/"
          className={`sidebar-menu-item ${isActiveRoute('/') ? 'active' : ''}`}
        >
          <Dashboard className="sidebar-menu-icon" />
          <span className="sidebar-menu-text">Admin</span>
          <div className="sidebar-tooltip">Dashboard Overview</div>
        </Link>

        {/* Users Menu Item */}
        <Link
          to="/users"
          className={`sidebar-menu-item ${isActiveRoute('/users') ? 'active' : ''}`}
        >
          <People className="sidebar-menu-icon" />
          <span className="sidebar-menu-text">Users</span>
          <div className="sidebar-tooltip">User Management</div>
        </Link>

        {/* Reports Menu Item */}
        <div
          className={`sidebar-menu-item ${reportsOpen ? 'active' : ''}`}
          onClick={() => setReportsOpen(!reportsOpen)}
        >
          <div className="sidebar-expandable-item">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Assessment className="sidebar-menu-icon" />
              <span className="sidebar-menu-text">Select </span>
            </div>
            <ExpandMore className={`sidebar-expand-icon ${reportsOpen ? 'expanded' : ''}`} />
          </div>
          <div className="sidebar-tooltip">Reports & Analytics</div>
        </div>

        {/* Reports Submenu */}
        {reportsOpen && (
          <div className="sidebar-submenu">
            {loadingReports ? (
              // Loading State
              Array.from({ length: 3 }).map((_, index) => (
                <div key={`loading-${index}`} className="sidebar-loading-item">
                  <Assessment className="sidebar-submenu-icon" />
                  <div
                    className="sidebar-skeleton"
                    style={{
                      width: `${Math.random() * 40 + 60}%`,
                      height: '16px'
                    }}
                  />
                </div>
              ))
            ) : reportError ? (
              // Error State
              <div className="sidebar-error-alert">
                <ErrorOutline style={{ fontSize: '1rem' }} />
                <span>{reportError}</span>
              </div>
            ) : searchQuery && filteredMenuItems.length === 0 ? (
              // No Results State
              <div className="sidebar-no-results">
                <Search style={{ fontSize: '1.5rem', opacity: 0.5 }} />
                <span>No reports match your search</span>
                <button
                  onClick={clearSearch}
                  className="sidebar-clear-search-btn"
                >
                  Clear search
                </button>
              </div>
            ) : (
              // Menu Items
              filteredMenuItems.map((menuItem, index) => (
                <Link
                  key={`report-${menuItem.id || index}`}
                  to={getRouteFromCaption(menuItem)}
                  className={`sidebar-submenu-item ${isActiveRoute(getRouteFromCaption(menuItem)) ? 'active' : ''
                    }`}
                  title={menuItem.caption || menuItem.caption}
                >
                  <Assessment className="sidebar-submenu-icon" />
                  <span>
                    {highlightSearchTerm(
                      truncateMenuName(menuItem.caption),
                      searchQuery
                    )}
                  </span>
                </Link>
              ))
            )}
          </div>
        )}

        {/* Settings Menu Item */}
        <Link
          to="/settings"
          className={`sidebar-menu-item ${isActiveRoute('/settings') ? 'active' : ''}`}
        >
          <Settings className="sidebar-menu-icon" />
          <span className="sidebar-menu-text">Settings</span>
          <div className="sidebar-tooltip">Application Settings</div>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;

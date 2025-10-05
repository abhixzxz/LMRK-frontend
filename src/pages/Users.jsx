import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/reports/ReportUserOperatorChang.css';
import '../components/reports/ReportUserRightButton.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function Users() {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    userName: '',
    userPassword: '',
    reEnterPassword: '',
    userType: '',
    userAvailabilityStatus: '',
    mobile: '',
    email: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(null); // null, true, false
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const newFormData = {
      ...formData,
      [name]: value
    };

    setFormData(newFormData);

    // Real-time password validation
    if (name === 'userPassword' || name === 'reEnterPassword') {
      const password = name === 'userPassword' ? value : newFormData.userPassword;
      const reEnterPassword = name === 'reEnterPassword' ? value : newFormData.reEnterPassword;

      // Show password strength for main password
      if (name === 'userPassword') {
        setShowPasswordStrength(value.length > 0);
      }

      // Check password match only if both fields have values
      if (password && reEnterPassword) {
        setPasswordMatch(password === reEnterPassword);
      } else {
        setPasswordMatch(null);
      }
    }

    // Clear error when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  // Validate form
  const validateForm = () => {
    if (!formData.userName.trim()) {
      setError('User Name is required');
      return false;
    }

    if (!formData.userPassword) {
      setError('Password is required');
      return false;
    }

    if (formData.userPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (!formData.reEnterPassword) {
      setError('Please confirm your password');
      return false;
    }

    if (formData.userPassword !== formData.reEnterPassword) {
      setError('Passwords do not match. Please check both password fields.');
      return false;
    }

    if (!formData.userType) {
      setError('User Type is required');
      return false;
    }

    if (!formData.userAvailabilityStatus) {
      setError('User Availability Status is required');
      return false;
    }

    if (!formData.mobile.trim()) {
      setError('Mobile number is required');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  // Password strength validation
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 'none', message: '', color: '#ccc' };

    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    Object.values(checks).forEach(check => check && score++);

    if (score === 0) return { strength: 'very-weak', message: 'Very Weak', color: '#f44336' };
    if (score <= 2) return { strength: 'weak', message: 'Weak', color: '#ff9800' };
    if (score <= 3) return { strength: 'medium', message: 'Medium', color: '#ff9800' };
    if (score <= 4) return { strength: 'strong', message: 'Strong', color: '#4caf50' };
    return { strength: 'very-strong', message: 'Very Strong', color: '#2e7d32' };
  };

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE}/api/usercreatapi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName: formData.userName.trim(),
          userPassword: formData.userPassword,
          userType: formData.userType,
          userAvailabilityStatus: formData.userAvailabilityStatus,
          mobile: formData.mobile.trim(),
          email: formData.email.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('User created successfully!');
        // Reset form
        setFormData({
          userName: '',
          userPassword: '',
          reEnterPassword: '',
          userType: '',
          userAvailabilityStatus: '',
          mobile: '',
          email: ''
        });
      } else {
        setError(data.message || 'Failed to create user');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle close
  const handleClose = () => {
    navigate('/dashboard');
  };

  return (
    <div className="report-user-operator-container">
      <div className="report-user-operator-form">
        <div style={{
          fontSize: '1.2rem',
          color: '#6d4c41',
          fontWeight: 'bold',
          padding: '1rem',
          background: '#efebe9',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          Create New User
        </div>

        {/* User Name */}
        <div
          className="report-user-operator-grid"
          style={{
            marginBottom: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.2rem',
            alignItems: 'start'
          }}
        >
          <div>
            <label className="report-user-operator-label">User Name</label>
            <input
              type="text"
              name="userName"
              className="report-user-operator-input"
              value={formData.userName}
              onChange={handleInputChange}
              placeholder="Enter user name..."
              maxLength={50}
            />
          </div>
          <div></div>
          <div></div>
          <div></div>
        </div>

        {/* Password Fields */}
        <div
          className="report-user-operator-grid"
          style={{
            marginBottom: '3rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.2rem',
            alignItems: 'start'
          }}
        >
          <div style={{ position: 'relative' }}>
            <label className="report-user-operator-label">User Password</label>
            <input
              type="password"
              name="userPassword"
              className="report-user-operator-input"
              value={formData.userPassword}
              onChange={handleInputChange}
              placeholder="Enter password (min 6 characters)..."
              maxLength={100}
              style={{
                borderColor: showPasswordStrength && formData.userPassword ?
                  getPasswordStrength(formData.userPassword).color : '#ddd'
              }}
            />
            {/* Password Strength Indicator */}
            {showPasswordStrength && formData.userPassword && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 10,
                backgroundColor: 'white',
                padding: '5px 8px',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                marginTop: '2px'
              }}>
                <div style={{
                  fontSize: '0.75rem',
                  color: getPasswordStrength(formData.userPassword).color,
                  fontWeight: 'bold',
                  marginBottom: '2px'
                }}>
              
                </div>
                <div style={{
                  fontSize: '0.65rem',
                  color: '#666',
                  lineHeight: '1.2'
                }}>
                 
                </div>
              </div>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <label className="report-user-operator-label">Re-enter Password</label>
            <input
              type="password"
              name="reEnterPassword"
              className="report-user-operator-input"
              value={formData.reEnterPassword}
              onChange={handleInputChange}
              placeholder="Re-enter password..."
              maxLength={100}
              style={{
                borderColor: passwordMatch === null ? '#ddd' :
                  passwordMatch ? '#4caf50' : '#f44336',
                borderWidth: passwordMatch !== null ? '2px' : '1px'
              }}
            />
            {/* Password Match Indicator */}
            {passwordMatch !== null && formData.reEnterPassword && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 10,
                backgroundColor: 'white',
                padding: '5px 8px',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                marginTop: '2px',
                fontSize: '0.75rem',
                color: passwordMatch ? '#4caf50' : '#f44336',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <span style={{ fontSize: '0.9rem' }}>{passwordMatch ? '✓' : '✗'}</span>
                {passwordMatch ? 'Passwords match' : 'Passwords do not match'}
              </div>
            )}
          </div>
          <div></div>
          <div></div>
        </div>

        {/* Dropdown Fields */}
        <div
          className="report-user-operator-grid"
          style={{
            marginBottom: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.2rem',
            alignItems: 'start'
          }}
        >
          <div>
            <label className="report-user-operator-label">User Type</label>
            <select
              name="userType"
              className="report-user-operator-select"
              value={formData.userType}
              onChange={handleInputChange}
            >
              <option value="">-- Select User Type --</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>

          <div>
            <label className="report-user-operator-label">User Availability Status</label>
            <select
              name="userAvailabilityStatus"
              className="report-user-operator-select"
              value={formData.userAvailabilityStatus}
              onChange={handleInputChange}
            >
              <option value="">-- Select Status --</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
          <div></div>
          <div></div>
        </div>

        {/* Contact Fields */}
        <div
          className="report-user-operator-grid"
          style={{
            marginBottom: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.2rem',
            alignItems: 'start'
          }}
        >
          <div>
            <label className="report-user-operator-label">Mobile</label>
            <input
              type="text"
              name="mobile"
              className="report-user-operator-input"
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="Enter mobile number..."
              maxLength={15}
            />
          </div>

          <div>
            <label className="report-user-operator-label">Email</label>
            <input
              type="email"
              name="email"
              className="report-user-operator-input"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address..."
              maxLength={100}
            />
          </div>
          <div></div>
          <div></div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-start', marginTop: '2rem' }}>
          <button
            className="green-btn wide-btn"
            onClick={handleSave}
            disabled={loading}
            style={{ opacity: loading ? 0.5 : 1 }}
          >
            {loading ? 'Saving...' : 'SAVE'}
          </button>
          <button
            className="red-blink-btn wide-btn"
            onClick={handleClose}
            disabled={loading}
          >
            Close
          </button>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div style={{
            color: '#d32f2f',
            backgroundColor: '#ffebee',
            padding: '12px',
            borderRadius: '4px',
            margin: '1rem 0',
            border: '1px solid #ffcdd2'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            color: '#2e7d32',
            backgroundColor: '#e8f5e8',
            padding: '12px',
            borderRadius: '4px',
            margin: '1rem 0',
            border: '1px solid #c8e6c9'
          }}>
            {success}
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;

import React from 'react';
import './ReportUserRight.css';

export default function UserDropdownModal({ users, selectedUser, setSelectedUser, onClose }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">Select User</h2>
                <select
                    className="user-dropdown"
                    value={selectedUser}
                    onChange={e => setSelectedUser(e.target.value)}
                >
                    <option value="">-- Select User --</option>
                    {users.map(u => (
                        <option key={u} value={u}>{u}</option>
                    ))}
                </select>
                <button className="modal-close-btn" onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

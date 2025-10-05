import React from 'react';
import { useAuth } from '../../hooks/useAuth';

// Higher-order component for protected routes
export const withAuth = (WrappedComponent) => {
    // Return the protected component
    const ProtectedComponent = (props) => {
        const { isAuthenticated, loading } = useAuth();

        if (loading) {
            return (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh'
                }}>
                    <div>Loading...</div>
                </div>
            );
        }

        if (!isAuthenticated) {
            // Redirect to login or show login form
            return <div>Please log in to access this page.</div>;
        }

        // Render the wrapped component with all props
        return <WrappedComponent {...props} />;
    };

    // Set display name for debugging
    ProtectedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return ProtectedComponent;
};
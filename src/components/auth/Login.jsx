import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
    InputAdornment,
    IconButton,
    Fade,
    CircularProgress
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Person,
    VpnKey,
    Login as LoginIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const { login, loading, error, isAuthenticated, clearError } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location.state?.from?.pathname]);

    // Clear errors when form changes
    useEffect(() => {
        if (error) {
            clearError();
        }
    }, [formData, clearError, error]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear field-specific errors
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const result = await login(formData.username.trim(), formData.password);

        if (result.success) {
            // Navigation will happen automatically via useEffect
        }
        // Error is handled by the auth context
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #FF6600 0%, #FF8533 35%, #004B87 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2
            }}
        >
            <Fade in={true} timeout={800}>
                <Paper
                    elevation={12}
                    sx={{
                        p: 6,
                        maxWidth: 400,
                        width: '100%',
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
                    }}
                >
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <img
                            src="/Logo.png"
                            alt="Logo"
                            style={{
                                width: '120px',
                                height: 'auto',
                                marginBottom: '16px'
                            }}
                        />
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                color: '#004B87',
                                mb: 1
                            }}
                        >
                            LION MAYURA ROYAL KINGDOM
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#666',
                                fontSize: '0.95rem'
                            }}
                        >
                            Sign in to members details
                        </Typography>
                    </Box>

                    {/* Error Alert */}
                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mb: 3, borderRadius: 2 }}
                            variant="filled"
                        >
                            {error}
                        </Alert>
                    )}

                    {/* Login Form */}
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            name="username"
                            label="Username"
                            value={formData.username}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            error={!!errors.username}
                            helperText={errors.username}
                            disabled={loading}
                            sx={{ mb: 3 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person sx={{ color: '#FF6600' }} />
                                    </InputAdornment>
                                ),
                                sx: {
                                    borderRadius: 2,
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#FF6600',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#FF6600',
                                    }
                                }
                            }}
                            InputLabelProps={{
                                sx: {
                                    '&.Mui-focused': {
                                        color: '#FF6600'
                                    }
                                }
                            }}
                        />

                        <TextField
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            error={!!errors.password}
                            helperText={errors.password}
                            disabled={loading}
                            sx={{ mb: 4 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <VpnKey sx={{ color: '#FF6600' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            disabled={loading}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                sx: {
                                    borderRadius: 2,
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#FF6600',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#FF6600',
                                    }
                                }
                            }}
                            InputLabelProps={{
                                sx: {
                                    '&.Mui-focused': {
                                        color: '#FF6600'
                                    }
                                }
                            }}
                        />

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
                            sx={{
                                py: 2,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                borderRadius: 2,
                                background: 'linear-gradient(45deg, #FF6600, #FF8533)',
                                boxShadow: '0 4px 15px rgba(255, 102, 0, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #E55A00, #FF6600)',
                                    boxShadow: '0 6px 20px rgba(255, 102, 0, 0.4)',
                                    transform: 'translateY(-2px)'
                                },
                                '&:active': {
                                    transform: 'translateY(0)'
                                },
                                '&:disabled': {
                                    background: '#ccc',
                                    boxShadow: 'none'
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </Box>

                    {/* Footer */}
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#888',
                                fontSize: '0.85rem'
                            }}
                        >
                            © 2025 Safe Software and Integrated Solutions
                        </Typography>
                    </Box>
                </Paper>
            </Fade>
        </Box>
    );
};

export default Login;
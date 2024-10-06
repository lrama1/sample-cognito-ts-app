import  { useEffect, useState } from 'react';
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { getConfig } from '../aws-config.ts';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';

//const userPool = new CognitoUserPool(poolData);

interface LoginProps {
    setToken: (token: string | null) => void;
}

function Login({ setToken }: LoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [cognitoUser, setCognitoUser] = useState<CognitoUser | null>(null);
    const [requiresNewPassword, setRequiresNewPassword] = useState(false);
    const [userPool, setUserPool] = useState<CognitoUserPool | null>(null);

    useEffect(() => {
        console.log('Initializing user pool');
        async function init() {
          const poolData = await getConfig();
          setUserPool(new CognitoUserPool(poolData));
          console.log('User pool initialized');
        }
        init();
        
    }, []);

    const handleLogin = () => {
        const authenticationDetails = new AuthenticationDetails({
            Username: username,
            Password: password,
        });

        if (!userPool) {
            setError('User pool is not initialized.');
            return;
        }

        const userData = {
            Username: username,
            Pool: userPool,
        };

        const cognitoUser = new CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (result) => {
                const idToken = result.getIdToken().getJwtToken();
                setToken(idToken);
                setIsAuthenticated(true);
                setCognitoUser(cognitoUser);
            },
            onFailure: (err) => {
                setError(err.message);
            },
            newPasswordRequired: () => {
                setRequiresNewPassword(true);
                setCognitoUser(cognitoUser);
            }
        });
    };

    const handleChangePassword = () => {
        if (cognitoUser) {
            cognitoUser.completeNewPasswordChallenge(newPassword, {}, {
                onSuccess: (result) => {
                    const idToken = result.getIdToken().getJwtToken();
                    setToken(idToken);
                    setIsAuthenticated(true);
                    setRequiresNewPassword(false);
                },
                onFailure: (err) => {
                    setError(err.message || JSON.stringify(err));
                }
            });
        }
    };

    const handleSignOut = () => {
        if (cognitoUser) {
            cognitoUser.signOut();
            setIsAuthenticated(false);
            setToken(null);
            setCognitoUser(null);
        } else {
            setError('No user is currently signed in.');
        }
    };

    return (
        <Container maxWidth="sm">
            {!isAuthenticated ? (
                requiresNewPassword ? (
                    <Box mt={4}>
                        <Typography variant="h4" gutterBottom>Change Password</Typography>
                        <TextField
                            type="password"
                            label="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <Button variant="contained" color="primary" onClick={handleChangePassword} fullWidth>
                            Change Password
                        </Button>
                        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    </Box>
                ) : (
                    <Box mt={4}>
                        <Typography variant="h4" gutterBottom>Login</Typography>
                        <TextField
                            type="text"
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            type="password"
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <Button variant="contained" color="primary" onClick={handleLogin} fullWidth>
                            Login
                        </Button>
                        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    </Box>
                )
            ) : (
                <Box mt={4}>
                    <Typography variant="h4" gutterBottom>Welcome, {username}!</Typography>
                    <Button variant="contained" color="secondary" onClick={handleSignOut} fullWidth>
                        Sign Out
                    </Button>
                </Box>
            )}
        </Container>
    );
}

export default Login;
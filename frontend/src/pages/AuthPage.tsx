import { useState, type FormEvent } from 'react';
import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/model/AuthContext';

type Mode = 'login' | 'register';

function AuthPage({ mode }: { mode: Mode }) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/projects';
  const isRegister = mode === 'register';

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (isRegister) {
        await register({ email: email.trim(), username: username.trim(), password });
      } else {
        await login(email.trim(), password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        {isRegister ? 'Регистрация' : 'Вход'}
      </Typography>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
          {isRegister && (
            <TextField
              label="Имя пользователя"
              helperText="3–14 символов: латиница, цифры, _"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
            />
          )}
          <TextField
            label="Пароль"
            type="password"
            helperText={isRegister ? 'Минимум 6 символов' : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? 'Отправка...' : isRegister ? 'Зарегистрироваться' : 'Войти'}
          </Button>
          <Typography variant="body2">
            {isRegister ? (
              <>Уже есть аккаунт? <RouterLink to="/login">Войти</RouterLink></>
            ) : (
              <>Нет аккаунта? <RouterLink to="/register">Зарегистрироваться</RouterLink></>
            )}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export function LoginPage() {
  return <AuthPage mode="login" />;
}

export function RegisterPage() {
  return <AuthPage mode="register" />;
}

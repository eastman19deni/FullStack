import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/model/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/projects');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ gap: 1 }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/projects"
            sx={{ flexGrow: 1, color: 'primary.main', textDecoration: 'none' }}
          >
            Доска проектов
          </Typography>

          {user ? (
            <>
              <Typography color="text.secondary" sx={{ mr: 1 }}>
                {user.username}
              </Typography>
              <Button component={RouterLink} to="/projects/new" variant="contained">
                Новый проект
              </Button>
              <Button onClick={handleLogout}>Выйти</Button>
            </>
          ) : (
            <>
              <Button component={RouterLink} to="/login">
                Войти
              </Button>
              <Button component={RouterLink} to="/register" variant="contained">
                Регистрация
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}

import { AppBar, Toolbar, Typography, Button, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function Header() {
  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/projects"
          sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 800 }}
        >
          DevBoard
        </Typography>

        <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
          <Button component={RouterLink} to="/projects">
            Проекты
          </Button>
        </Stack>

        <Button component={RouterLink} to="/projects/new" variant="contained">
          Новый проект
        </Button>
      </Toolbar>
    </AppBar>
  );
}
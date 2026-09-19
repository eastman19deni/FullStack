import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h2" sx={{ fontWeight: 800 }}>404</Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
        Страница не найдена
      </Typography>
      <Button component={RouterLink} to="/projects" variant="contained">
        На главную
      </Button>
    </Box>
  );
}
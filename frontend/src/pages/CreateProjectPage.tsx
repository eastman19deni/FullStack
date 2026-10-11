import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CreateProjectForm from '../features/project-create/ui/CreateProjectForm';

export default function CreateProjectPage() {
  return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      <Button component={RouterLink} to="/projects" sx={{ mb: 2 }}>
        ← Назад
      </Button>
      <Typography variant="h4" gutterBottom>Новый проект</Typography>
      <CreateProjectForm />
    </Box>
  );
}

import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';

export default function CreateProjectPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!title.trim()) e.title = 'Укажите название';
    if (description.trim().length < 20) e.description = 'Минимум 20 символов';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    alert('Проект создан (демо)');
  };

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      <Button component={RouterLink} to="/projects" sx={{ mb: 2 }}>
        ← Назад
      </Button>
      <Typography variant="h4" gutterBottom>Новый проект</Typography>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Название"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
          />
          <TextField
            label="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
            multiline
            minRows={4}
            fullWidth
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button component={RouterLink} to="/projects">Отмена</Button>
            <Button variant="contained" onClick={handleSubmit}>Создать</Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
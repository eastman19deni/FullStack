import { useState } from 'react';
import { Box, TextField, Button, Paper, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { projectApi } from '../../../entities/project/api';
import { allTags } from '../../../entities/project/model/mock';

export default function CreateProjectForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!title.trim()) e.title = 'Укажите название';
    if (description.trim().length < 20) e.description = 'Минимум 20 символов';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const created = await projectApi.create({
        title: title.trim(),
        description: description.trim(),
        tagIds,
        roleIds: [],
      });
      navigate(`/projects/${created.id}`);
    } catch {
      setErrors({ description: 'Не удалось создать проект' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
        <TextField
          select
          label="Теги"
          value={tagIds}
          onChange={(e) => {
            const v = e.target.value as unknown;
            setTagIds(typeof v === 'string' ? v.split(',').map(Number) : (v as number[]));
          }}
          slotProps={{
            select: {
              multiple: true,
              renderValue: (selected) =>
                allTags
                  .filter((t) => (selected as number[]).includes(t.id))
                  .map((t) => t.name)
                  .join(', '),
            },
          }}
          fullWidth
        >
          {allTags.map((t) => (
            <MenuItem key={t.id} value={t.id}>
              {t.name}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button onClick={() => navigate('/projects')}>Отмена</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Создание...' : 'Создать'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

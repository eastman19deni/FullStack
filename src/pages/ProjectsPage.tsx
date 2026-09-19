import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useMemo, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import { projects } from '../mocks/data';

export default function ProjectsPage() {
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const q = query.toLowerCase();
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4">Доска проектов</Typography>
          <Typography color="text.secondary">
            Находите идеи и присоединяйтесь к командам
          </Typography>
        </Box>

        <TextField
          size="small"
          placeholder="Поиск проектов"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {visible.length === 0 ? (
        <Typography color="text.secondary">Ничего не найдено</Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {visible.map((p) => <ProjectCard key={p.id} project={p} />)}
        </Box>
      )}
    </Box>
  );
}
import {
  Box,
  TextField,
  InputAdornment,
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'

export default function FamilyFilters({
  search,
  setSearch,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        mb: 2,
      }}
    >
      <TextField
        size="small"
        placeholder="Search family..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#666', fontSize: 18 }} />
            </InputAdornment>
          ),
        }}
        sx={{
          width: 320,

          '& .MuiOutlinedInput-root': {
            bgcolor: '#111111',

            '& fieldset': {
              borderColor: '#2A2A2A',
            },

            '&:hover fieldset': {
              borderColor: '#444',
            },

            '&.Mui-focused fieldset': {
              borderColor: '#E31E24',
            },
          },

          '& .MuiInputBase-input': {
            color: '#fff',
            fontSize: 13,
          },
        }}
      />
    </Box>
  )
}
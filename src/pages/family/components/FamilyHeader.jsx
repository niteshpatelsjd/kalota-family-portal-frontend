import {
  Box,
  Typography,
  Chip,
  Stack,
} from '@mui/material'

export default function FamilyHeader({ family }) {
  return (
    <Box
      sx={{
        mb: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Box>
        <Typography
          sx={{
            color: '#fff',
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          {family?.familyName || 'Family'}
        </Typography>

        <Typography
          sx={{
            color: '#666',
            fontSize: 13,
            mt: 0.5,
          }}
        >
          Family ID: {family?.familyUniqueId}
        </Typography>
      </Box>

      <Stack direction="row" spacing={1}>
        <Chip
          label={
            family?.status === 1
              ? 'Active'
              : 'Inactive'
          }
          sx={{
            bgcolor:
              family?.status === 1
                ? 'rgba(34,197,94,0.12)'
                : 'rgba(239,68,68,0.12)',

            color:
              family?.status === 1
                ? '#22c55e'
                : '#ef4444',
          }}
        />

        <Chip
          label={`${family?.members?.length || 0} Members`}
          sx={{
            bgcolor: 'rgba(227,30,36,0.12)',
            color: '#E31E24',
          }}
        />
      </Stack>
    </Box>
  )
}
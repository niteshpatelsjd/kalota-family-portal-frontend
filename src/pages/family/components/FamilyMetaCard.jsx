import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
} from '@mui/material'

export default function FamilyMetaCard({
  family,
}) {
  const items = [
    {
      label: 'District',
      value: family?.districtName,
    },
    {
      label: 'Tehsil',
      value: family?.tehsilName,
    },
    {
      label: 'Village',
      value: family?.villageName,
    },
    {
      label: 'Created At',
      value: family?.createdAt,
    },
  ]

  return (
    <Card
      sx={{
        bgcolor: '#111111',
        border: '1px solid #2A2A2A',
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Typography
          sx={{
            color: '#fff',
            fontSize: 16,
            fontWeight: 700,
            mb: 2,
          }}
        >
          Family Information
        </Typography>

        <Stack spacing={2}>
          {items.map((item) => (
            <Box key={item.label}>
              <Typography
                sx={{
                  color: '#666',
                  fontSize: 11,
                }}
              >
                {item.label}
              </Typography>

              <Typography
                sx={{
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {item.value || '-'}
              </Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}
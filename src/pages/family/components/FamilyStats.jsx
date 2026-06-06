import { Card, CardContent, Typography, Stack, Box } from '@mui/material'
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom'
import GroupsIcon from '@mui/icons-material/Groups'
import BlockIcon from '@mui/icons-material/Block'

const cardStyle = {
  flex: 1,
  bgcolor: '#111111',
  border: '1px solid #2A2A2A',
  borderRadius: 3,
}

export default function FamilyStats({ stats }) {
  const items = [
    {
      label: 'Total Families',
      value: stats?.total || 0,
      icon: <FamilyRestroomIcon sx={{ color: '#E31E24' }} />,
    },
    {
      label: 'Active Families',
      value: stats?.active || 0,
      icon: <GroupsIcon sx={{ color: '#22c55e' }} />,
    },
    {
      label: 'Inactive Families',
      value: stats?.inactive || 0,
      icon: <BlockIcon sx={{ color: '#ef4444' }} />,
    },
  ]

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
      {items.map((item) => (
        <Card key={item.label} sx={cardStyle}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: '#fff',
                    fontSize: 24,
                    fontWeight: 700,
                  }}
                >
                  {item.value}
                </Typography>

                <Typography
                  sx={{
                    color: '#666',
                    fontSize: 12,
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}
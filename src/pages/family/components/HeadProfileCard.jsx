import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material'

export default function HeadProfileCard({
  head,
}) {
  return (
    <Card
      sx={{
        bgcolor: '#111111',
        border: '1px solid #2A2A2A',
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Stack alignItems="center" spacing={2}>
          <Avatar
            src={head?.profileImage}
            sx={{
              width: 110,
              height: 110,
              fontSize: 36,
            }}
          >
            {head?.firstName?.[0]}
          </Avatar>

          <Box textAlign="center">
            <Typography
              sx={{
                color: '#fff',
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              {head?.fullName}
            </Typography>

            <Typography
              sx={{
                color: '#E31E24',
                fontSize: 13,
                mt: 0.5,
              }}
            >
              Head of Family
            </Typography>
          </Box>

          <Divider
            sx={{
              width: '100%',
              borderColor: '#2A2A2A',
            }}
          />

          <Stack spacing={1} width="100%">
            <Info
              label="Mobile"
              value={head?.mobileNumber}
            />

            <Info
              label="Education"
              value={head?.education}
            />

            <Info
              label="Occupation"
              value={head?.occupation}
            />

            <Info
              label="Gender"
              value={head?.gender}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

function Info({ label, value }) {
  return (
    <Box>
      <Typography
        sx={{
          color: '#666',
          fontSize: 11,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          color: '#fff',
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        {value || '-'}
      </Typography>
    </Box>
  )
}
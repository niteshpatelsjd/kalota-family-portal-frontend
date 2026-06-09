import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
} from '@mui/material'

import { useSelector } from 'react-redux'

import PeopleIcon from '@mui/icons-material/People'
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import NotificationsIcon from '@mui/icons-material/Notifications'

import MadhyaPradeshMap from './MadhyaPradeshMap'

/* ======================================================
   STAT CARD
====================================================== */

function StatCard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <Card
      sx={{
        background:
          'rgba(255,255,255,0.65)',

        backdropFilter:
          'blur(14px)',

        border:
          '1px solid rgba(122,30,30,0.12)',

        borderRadius: 3,

        boxShadow:
          '0 10px 30px rgba(122,30,30,0.08)',

        flex: 1,
      }}
    >
      <CardContent
        sx={{
          p: '14px !important',
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          {/* LEFT */}
          <Box>
            <Typography
              sx={{
                color: '#8A6D3B',
                fontSize: 14,
                mb: 0.5,
                fontWeight: 600,
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                color: '#7A1E1E',
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {value}
            </Typography>
          </Box>

          {/* ICON */}
          <Avatar
            sx={{
              ml: 'auto',
              bgcolor: `${color}20`,
              color,
              width: 52,
              height: 52,

              '& svg': {
                fontSize: 28,
              },
            }}
          >
            {icon}
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  )
}

/* ======================================================
   DASHBOARD PAGE
====================================================== */

export default function DashboardPage() {
  const { user } = useSelector(
    (s) => s.auth
  )

  const stats = {
    totalMembers: 1580,
    totalFamilies: 420,
    totalLocations: 72,
    activeUsers: 1288,
  }

  const activities = [
    'New member registered',
    'Location added',
    'Role updated',
    'Family profile approved',
    'User account activated',
  ]

  return (
    <Box>
      {/* ======================================================
          WELCOME BANNER
      ====================================================== */}

      <Box
        sx={{
          mb: 3,
          px: 1,
          py: 1,

          display: 'flex',

          justifyContent:
            'space-between',

          alignItems: 'center',

          flexWrap: 'wrap',

          borderBottom:
            '1px solid rgba(122,30,30,0.12)',
        }}
      >
        {/* LEFT */}
        <Box>
          <Typography
            sx={{
              color: '#7A1E1E',

              fontSize: {
                xs: 20,
                md: 24,
              },

              fontWeight: 700,
              lineHeight: 1.3,
            }}
          >
            पुनः आपका स्वागत है{' '}

            <Box
              component="span"
              sx={{
                color: '#E31E24',
              }}
            >
              {user?.name ||
                'Admin'}{' '}
              जी
            </Box>{' '}
            🙏
          </Typography>

          <Typography
            sx={{
              color: '#8A6D3B',
              fontSize: 12,
              mt: 0.7,
            }}
          >
            क्षत्रिय कलोता समाज
            परिवार पोर्टल
          </Typography>
        </Box>

        {/* DATE */}
        <Typography
          sx={{
            color: '#8A6D3B',
            fontSize: 12,

            mt: {
              xs: 1,
              md: 0,
            },
          }}
        >
          {new Date().toLocaleDateString(
            'hi-IN',
            {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }
          )}
        </Typography>
      </Box>

      {/* ======================================================
          STATS
      ====================================================== */}

      <Box
        sx={{
          display: 'grid',

          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2,1fr)',
            lg: 'repeat(4,1fr)',
          },

          gap: 2,
          mb: 3,
        }}
      >
        <StatCard
          title="कुल सदस्य"
          value={stats.totalMembers}
          color="#E31E24"
          icon={<PeopleIcon />}
        />

        <StatCard
          title="परिवार"
          value={stats.totalFamilies}
          color="#22C55E"
          icon={
            <FamilyRestroomIcon />
          }
        />

        <StatCard
          title="गांव"
          value={stats.totalLocations}
          color="#3B82F6"
          icon={<LocationOnIcon />}
        />

        <StatCard
          title="सक्रिय उपयोगकर्ता"
          value={stats.activeUsers}
          color="#F59E0B"
          icon={<CheckCircleIcon />}
        />
      </Box>

      {/* ======================================================
          MAP SECTION
      ====================================================== */}

      <Card
        sx={{
          background:
            'rgba(255,255,255,0.65)',

          backdropFilter:
            'blur(14px)',

          border:
            '1px solid rgba(122,30,30,0.12)',

          borderRadius: 4,

          overflow: 'hidden',

          mb: 3,

          boxShadow:
            '0 10px 30px rgba(122,30,30,0.08)',
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* HEADER */}

          <Box
            sx={{
              px: 3,
              py: 2,

              borderBottom:
                '1px solid rgba(122,30,30,0.12)',

              display: 'flex',

              justifyContent:
                'space-between',

              alignItems: 'center',

              flexWrap: 'wrap',
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: '#7A1E1E',
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                क्षत्रिय कलोता समाज
                का क्षेत्रीय भू-लॉग
              </Typography>

              <Typography
                sx={{
                  color: '#8A6D3B',
                  fontSize: 12,
                  mt: 0.5,
                }}
              >
                इंदौर • उज्जैन •
                देवास - जिला क्षेत्र
              </Typography>
            </Box>
          </Box>

          {/* MAP */}

          <MadhyaPradeshMap />
        </CardContent>
      </Card>

      {/* ======================================================
          BOTTOM SECTION
      ====================================================== */}

      <Box
        sx={{
          display: 'grid',

          gridTemplateColumns: {
            xs: '1fr',
            lg: '1fr 1fr',
          },

          gap: 3,
        }}
      >
        {/* QUICK SUMMARY */}

        <Card
          sx={{
            bgcolor:
              'rgba(255,255,255,0.65)',

            backdropFilter:
              'blur(14px)',

            border:
              '1px solid rgba(122,30,30,0.12)',

            borderRadius: 3,
          }}
        >
          <CardContent>
            <Typography
              sx={{
                color: '#7A1E1E',
                fontWeight: 700,
                mb: 3,
              }}
            >
              त्वरित सारांश
            </Typography>

            <Box
              sx={{
                display: 'grid',

                gridTemplateColumns:
                  'repeat(2, 1fr)',

                gap: 2,
              }}
            >
              {[
                {
                  label: 'जिला',
                  value: 12,
                  color: '#3B82F6',
                },

                {
                  label: 'तहसील',
                  value: 36,
                  color: '#8B5CF6',
                },

                {
                  label: 'गांव',
                  value: 72,
                  color: '#22C55E',
                },

                {
                  label: 'Pending',
                  value: 18,
                  color: '#F59E0B',
                },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    p: 2,

                    borderRadius: 3,

                    bgcolor:
                      'rgba(255,255,255,0.55)',

                    border:
                      '1px solid rgba(122,30,30,0.10)',
                  }}
                >
                  <Typography
                    sx={{
                      color: '#8A6D3B',
                      fontSize: 11,
                      mb: 1,
                    }}
                  >
                    {item.label}
                  </Typography>

                  <Typography
                    sx={{
                      color: item.color,
                      fontWeight: 700,
                      fontSize: 22,
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* ACTIVITIES */}

        <Card
          sx={{
            bgcolor:
              'rgba(255,255,255,0.65)',

            backdropFilter:
              'blur(14px)',

            border:
              '1px solid rgba(122,30,30,0.12)',

            borderRadius: 3,
          }}
        >
          <CardContent>
            <Typography
              sx={{
                color: '#7A1E1E',
                fontWeight: 700,
                mb: 3,
              }}
            >
              हाल की गतिविधियाँ
            </Typography>

            <Stack spacing={3}>
              {activities.map(
                (
                  activity,
                  index
                ) => (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <Avatar
                      sx={{
                        width: 35,
                        height: 35,

                        bgcolor:
                          'rgba(122,30,30,0.08)',
                      }}
                    >
                      {index % 2 ===
                      0 ? (
                        <PersonAddIcon
                          sx={{
                            color:
                              '#E31E24',

                            fontSize: 18,
                          }}
                        />
                      ) : (
                        <NotificationsIcon
                          sx={{
                            color:
                              '#E31E24',

                            fontSize: 18,
                          }}
                        />
                      )}
                    </Avatar>

                    <Box>
                      <Typography
                        sx={{
                          color:
                            '#7A1E1E',

                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        {activity}
                      </Typography>

                      <Typography
                        sx={{
                          color:
                            '#8A6D3B',

                          fontSize: 12,
                        }}
                      >
                        Just now
                      </Typography>
                    </Box>
                  </Stack>
                )
              )}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
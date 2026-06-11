import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import BlockIcon from '@mui/icons-material/Block'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AddIcon from '@mui/icons-material/Add'


import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'


import DataTable from '../../components/common/DataTable'

import {
  Box,
  Avatar,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Grid,
  IconButton,
  Button,
  Divider,
  CircularProgress,
} from '@mui/material'

import EditIcon from '@mui/icons-material/Edit'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import LanguageIcon from '@mui/icons-material/Language'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import GroupsIcon from '@mui/icons-material/Groups'
import HomeWorkIcon from '@mui/icons-material/HomeWork'

import api from '../../api/axiosInstance'

const getDharamshalaById = async (
  id
) => {
  const response = await api.get(
    `/admin/dharamshala/getDharamshalaById/${id}`
  )

  return response.data.responseBody
}

const getRoleColor = (role) => {
  switch (role) {
    case 'PRESIDENT':
      return '#D4AF37'

    case 'VICE_PRESIDENT':
      return '#2563EB'

    case 'SECRETARY':
      return '#7A1E1E'

    case 'TREASURER':
      return '#059669'

    default:
      return '#6B7280'
  }
}

function StatCard({
  label,
  value,
  icon,
  color,
}) {
  return (
    <Card
      sx={{
        bgcolor: '#FFFFFF',
        borderRadius: 3,
        border: '1px solid #E5E7EB',
        boxShadow:
          '0 4px 20px rgba(0,0,0,0.06)',
        height: 120,
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography
              sx={{
                color: '#6B7280',
                fontSize: 13,
              }}
            >
              {label}
            </Typography>

            <Typography
              sx={{
                color: '#7A1E1E',
                fontSize: 30,
                fontWeight: 700,
              }}
            >
              {value}
            </Typography>
          </Box>

          <Avatar
            sx={{
              bgcolor: `${color}15`,
              color,
            }}
          >
            {icon}
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default function DharamshalaDetailPage() {
  const { id } = useParams()
const navigate = useNavigate()
  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: [
      'dharamshala-detail',
      id,
    ],
    queryFn: () =>
      getDharamshalaById(id),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '70vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!data) return null

const committeeMembers =
  data.committeeMembers || []

const activeMembers =
  committeeMembers.filter(
    (m) => m.status === 1
  ).length

const inactiveMembers =
  committeeMembers.filter(
    (m) => m.status !== 1
  ).length

const committeeColumns = [
  {
    key: 'member',
    label: 'Member',
    render: (row) => (
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
      >
        <Avatar
src={
  row.userResponse
    ?.profileImage ||
  DEFAULT_PROFILE
}
          sx={{
            width: 38,
            height: 38,
          }}
        />

        <Box>
          <Typography
            fontSize={13}
            fontWeight={700}
            color="#7A1E1E"
          >
            {
              row.userResponse
                ?.name
            }
          </Typography>

          <Typography
            fontSize={11}
            color="#888"
          >
            {
              row.userResponse
                ?.mobile
            }
          </Typography>
        </Box>
      </Stack>
    ),
  },

{
  key: 'committeeRole',
  label: 'Role',
  render: (row) => (
    <Chip
      size="small"
      label={row.committeeRole}
      sx={{
        bgcolor: `${getRoleColor(
          row.committeeRole
        )}20`,
        color: getRoleColor(
          row.committeeRole
        ),
        fontWeight: 700,
      }}
    />
  ),
},

  {
    key: 'joiningDate',
    label: 'Joining Date',
    render: (row) =>
      new Date(
        row.joiningDate
      ).toLocaleDateString(),
  },

  {
    key: 'remarks',
    label: 'Remarks',
    render: (row) =>
      row.remarks || '-',
  },

  {
    key: 'status',
    label: 'Status',
    render: (row) => (
      <Chip
        size="small"
        label={
          row.status === 1
            ? 'Active'
            : 'Inactive'
        }
        color={
          row.status === 1
            ? 'success'
            : 'warning'
        }
      />
    ),
  },

{
  key: 'actions',
  label: 'Actions',
  render: (row) => (
    <Stack
      direction="row"
      spacing={1}
    >
      {/* EDIT */}
      <IconButton
        size="small"
        sx={{
          color: '#E31E24',
          bgcolor: 'rgba(227,30,36,0.08)',

          '&:hover': {
            bgcolor: 'rgba(227,30,36,0.18)',
          },
        }}
      >
        <EditIcon sx={{ fontSize: 18 }} />
      </IconButton>

      {/* ACTIVE / INACTIVE */}
      <IconButton
        size="small"
        sx={{
          color:
            row.status === 1
              ? '#f59e0b'
              : '#22c55e',

          bgcolor:
            row.status === 1
              ? 'rgba(245,158,11,0.08)'
              : 'rgba(34,197,94,0.08)',

          '&:hover': {
            bgcolor:
              row.status === 1
                ? 'rgba(245,158,11,0.18)'
                : 'rgba(34,197,94,0.18)',
          },
        }}
      >
        {row.status === 1 ? (
          <BlockIcon sx={{ fontSize: 18 }} />
        ) : (
          <CheckCircleIcon sx={{ fontSize: 18 }} />
        )}
      </IconButton>

      {/* DELETE */}
      <IconButton
        size="small"
        sx={{
          color: '#ef4444',
          bgcolor: 'rgba(239,68,68,0.08)',

          '&:hover': {
            bgcolor: 'rgba(239,68,68,0.18)',
          },
        }}
      >
        <DeleteIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Stack>
  ),
}
]

const DEFAULT_BANNER =
  'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1400&q=80'

const DEFAULT_PROFILE =
  'https://cdn-icons-png.flaticon.com/512/149/149071.png'


  const user = JSON.parse(
  localStorage.getItem('user')
)
console.log('User =>', user)
console.log('Role =>', user?.roleResponse.roleName)
const isSuperAdmin =
  user?.roleResponse.roleName === 'Super Admin'
 return (
  <Box
    sx={{
      bgcolor: '#F8F9FB',
      minHeight: '100vh',
      p: 2,
    }}
  >

    <Box
  sx={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 2,
  }}
>
{isSuperAdmin && (
  <Button
    startIcon={<ArrowBackIcon />}
    variant="outlined"
    onClick={() => navigate(-1)}
    sx={{
      borderColor: '#7A1E1E',
      color: '#7A1E1E',

      '&:hover': {
        bgcolor: '#7A1E1E10',
      },
    }}
  >
    Back
  </Button>
)}
</Box>
    {/* HERO */}

    <Card
      sx={{
        overflow: 'hidden',
        borderRadius: 4,
        mb: 4,
      }}
    >
      <Box
        sx={{
          height: 450,
          position: 'relative',
        }}
      >
        <Box
          component="img"
                    src={
            data.bannerImage ||
            data.profileImage ||
            DEFAULT_BANNER
            }
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
'linear-gradient(to top, rgba(0,0,0,.55), rgba(0,0,0,.10))'
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            bottom: 30,
            left: 30,
            display: 'flex',
            gap: 3,
            alignItems: 'center',
          }}
        >
          <Avatar
src={
  data.profileImage ||
  DEFAULT_PROFILE
}
            sx={{
              width: 120,
              height: 120,
              border:
                '4px solid white',
            }}
          />

          <Box>
            <Typography
              variant="h4"
              fontWeight={700}
              color="#fff"
            >
              {data.name}
            </Typography>

            <Typography
              color="#fff"
            >
              {
                data.villageName
              }
            </Typography>

            <Typography
              color="#fff"
            >
              {data.address}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>

    {/* STATS */}

    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2,1fr)',
          lg: 'repeat(4,1fr)',
        },
        gap: 2,
        mb: 4,
      }}
    >
      <StatCard
        label="Committee Members"
        value={
          committeeMembers.length
        }
        color="#7A1E1E"
        icon={<GroupsIcon />}
      />

      <StatCard
        label="Active"
        value={activeMembers}
        color="#22C55E"
        icon={
          <CheckCircleIcon />
        }
      />

      <StatCard
        label="Inactive"
        value={inactiveMembers}
        color="#F59E0B"
        icon={<BlockIcon />}
      />

      <StatCard
        label="Established"
        value={
          data.establishedYear
        }
        color="#2563EB"
        icon={
          <CalendarMonthIcon />
        }
      />
    </Box>

    {/* ABOUT */}

<Card
  sx={{
    mb: 4,
    borderRadius: 4,
    bgcolor: '#FFFFFF !important',
    color: '#111827 !important',
    border: '1px solid #E5E7EB',
  }}
>
      <CardContent
  sx={{
    bgcolor: '#FFFFFF !important',
    color: '#111827 !important',
  }}
>
        <Typography
          variant="h6"
          fontWeight={700}
          color="#7A1E1E"
          mb={2}
        >
          About Dharamshala
        </Typography>

<Typography
  sx={{
    color: '#111827 !important',
    fontSize: 14,
    fontWeight: 500,
  }}
>
  {data.description || 'No description available'}
</Typography>
      </CardContent>
    </Card>

    {/* COMMITTEE */}

    <Box
      sx={{
        display: 'flex',
        justifyContent:
          'space-between',
        alignItems: 'center',
        mb: 2,
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        color="#7A1E1E"
      >
        Committee Members
      </Typography>

      <Button
        startIcon={<AddIcon />}
        variant="contained"
        sx={{
          bgcolor: '#7C3AED',
        }}
      >
        Add Member
      </Button>
    </Box>

    <DataTable
      columns={
        committeeColumns
      }
      rows={
        committeeMembers
      }
      total={
        committeeMembers.length
      }
      page={0}
      pageSize={10}
      loading={false}
      onPageChange={() => {}}
      onPageSizeChange={() => {}}
    />
  </Box>
)
}
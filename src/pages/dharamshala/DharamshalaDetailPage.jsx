import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import BlockIcon from '@mui/icons-material/Block'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'


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

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'

const searchUsers = async (
  searchText = ''
) => {
  const response =
    await api.get(
      `/admin/user/getAllUser?pageIndex=0&pageSize=50&searchText=${searchText}`
    )

  return (
    response.data.responseBody
      ?.content || []
  )
}
const saveCommittee = async (payload) => {
  const response = await api.post(
    '/admin/dharamshala/addCommittee',
    payload
  )

  return response.data
}

const blockUnblockCommittee =
  async (payload) => {
    const response =
      await api.post(
        '/admin/dharamshala/blockUnblockCommittee',
        payload
      )

    return response.data
  }
const getDharamshalaById = async (
  id
) => {
  const response = await api.get(
    `/admin/dharamshala/getDharamshalaById/${id}`
  )

  return response.data.responseBody
}

const updateDharamshala =
  async (form) => {
    const formData =
      new FormData()

    Object.entries(form).forEach(
      ([key, value]) => {
        if (
          value !== null &&
          value !== undefined
        ) {
          formData.append(
            key,
            value
          )
        }
      }
    )

    const response =
      await api.post(
        '/admin/dharamshala/addDharamshala',
        formData,
        {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },
        }
      )

    return response.data
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

const fieldStyle = {
  '& .MuiOutlinedInput-root': {
    bgcolor: '#fff',

    '& fieldset': {
      borderColor: '#E7D4C7',
    },

    '&:hover fieldset': {
      borderColor: '#9C7A3B',
    },

    '&.Mui-focused fieldset': {
      borderColor: '#7A1E1E',
    },
  },

  '& .MuiInputLabel-root': {
    color: '#9C7A3B',
    backgroundColor: '#fff',
    px: 0.5,
  },

  '& .MuiInputLabel-root.Mui-focused': {
    color: '#7A1E1E',
  },

  '& .MuiInputBase-input': {
    color: '#1E1E1E',
    WebkitTextFillColor: '#1E1E1E',
  },

  '& textarea': {
    color: '#1E1E1E',
    WebkitTextFillColor: '#1E1E1E',
  },

  '& .MuiInputBase-root': {
    color: '#1E1E1E !important',
  },

  '& .MuiSelect-select': {
    color: '#1E1E1E !important',
    WebkitTextFillColor:
      '#1E1E1E !important',
  },


}
  const queryClient = useQueryClient()

  const committeeMutation = useMutation({
  mutationFn: saveCommittee,

  onSuccess: () => {
    setOpenCommitteeDialog(false)

    queryClient.invalidateQueries({
      queryKey: [
        'dharamshala-detail',
        id,
      ],
    })
  },
})

const statusMutation =
  useMutation({
    mutationFn:
      blockUnblockCommittee,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'dharamshala-detail',
          id,
        ],
      })
    },
  })

  const updateMutation =
  useMutation({
    mutationFn:
      updateDharamshala,

    onSuccess: () => {
      setOpenEditDialog(false)

      queryClient.invalidateQueries({
        queryKey: [
          'dharamshala-detail',
          id,
        ],
      })
    },
  })
const [userSearch, setUserSearch] =
  useState('')

const { data: users = [] } =
  useQuery({
    queryKey: [
      'committee-users',
      userSearch,
    ],

    queryFn: () =>
      searchUsers(userSearch),

    staleTime: 60000,

    keepPreviousData: true,
  })
const [openCommitteeDialog, setOpenCommitteeDialog] =
  useState(false)

const [committeeForm, setCommitteeForm] =
  useState({
    id: '',
    userId: '',
    committeeRole: '',
    joiningDate: '',
    endDate: '',
    remarks: '',
    status: 1,
  })

const [openEditDialog, setOpenEditDialog] =
  useState(false)

const [dharamshalaForm, setDharamshalaForm] =
  useState({
    id: '',
    name: '',
    villageId: '',
    mobileNumber: '',
    alternateMobileNumber: '',
    email: '',
    website: '',
    address: '',
    establishedYear: '',
    description: '',
    profileImageFile: null,
    bannerImageFile: null,
  })
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
  onClick={() => {
    setCommitteeForm({
      id: row.id,
      userId:
        row.userResponse?.id || '',

      committeeRole:
        row.committeeRole || '',

      joiningDate:
        row.joiningDate
          ?.split('T')[0],

      endDate:
        row.endDate
          ?.split('T')[0] || '',

      remarks:
        row.remarks || '',

      status:
        row.status || 1,
    })

    setOpenCommitteeDialog(true)
  }}
>
  <EditIcon />
</IconButton>
{/* ACTIVE / INACTIVE */}

<IconButton
  size="small"

  onClick={() =>
    statusMutation.mutate({
      id: row.id,

      status:
        row.status === 1
          ? 2
          : 1,
    })
  }

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
  {statusMutation.isPending ? (
    <CircularProgress
      size={18}
    />
  ) : row.status === 1 ? (
    <BlockIcon
      sx={{
        fontSize: 18,
      }}
    />
  ) : (
    <CheckCircleIcon
      sx={{
        fontSize: 18,
      }}
    />
  )}
</IconButton>

    {/* DELETE */}
{/* DELETE */}
<IconButton
  size="small"
  disabled={statusMutation.isPending}
  onClick={() =>
    statusMutation.mutate({
      id: row.id,
      status: 0,
    })
  }
  sx={{
    color: '#ef4444',
    bgcolor: 'rgba(239,68,68,0.08)',

    '&:hover': {
      bgcolor: 'rgba(239,68,68,0.18)',
    },
  }}
>
  {statusMutation.isPending ? (
    <CircularProgress size={18} />
  ) : (
    <DeleteIcon sx={{ fontSize: 18 }} />
  )}
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
    {/* EDIT BUTTON */}
    <IconButton
      onClick={() => {
        setDharamshalaForm({
          id: data.id,
          name: data.name || '',
          villageId: data.villageId || '',
          mobileNumber:
            data.mobileNumber || '',

          alternateMobileNumber:
            data.alternateMobileNumber ||
            '',

          email: data.email || '',

          website:
            data.website || '',

          address:
            data.address || '',

          establishedYear:
            data.establishedYear ||
            '',

          description:
            data.description || '',

          profileImageFile:
            null,

          bannerImageFile:
            null,
        })

        setOpenEditDialog(true)
      }}
      sx={{
        position: 'absolute',
        top: 20,
        right: 20,

        zIndex: 10,

        width: 52,
        height: 52,

        bgcolor:
          'rgba(255,255,255,.92)',

        backdropFilter:
          'blur(10px)',

        boxShadow:
          '0 8px 20px rgba(0,0,0,.18)',

        '&:hover': {
          bgcolor: '#fff',
          transform:
            'scale(1.05)',
        },
      }}
    >
      <EditIcon
        sx={{
          color: '#7A1E1E',
          fontSize: 24,
        }}
      />
    </IconButton>

    {/* BANNER */}
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

    {/* OVERLAY */}
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(to top, rgba(0,0,0,.55), rgba(0,0,0,.10))',
      }}
    />

    {/* PROFILE */}
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

        <Typography color="#fff">
          {data.villageName}
        </Typography>

        <Typography color="#fff">
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


<Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    gap: 1.2,
  }}
>
  <LanguageIcon
    sx={{
      color: '#7A1E1E',
      fontSize: 20,
    }}
  />

  {data.website ? (
    <Typography
      component="a"
      href={
        data.website.startsWith(
          'http'
        )
          ? data.website
          : `https://${data.website}`
      }
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        color: '#2563EB',
        fontSize: 14,
        fontWeight: 600,

        textDecoration:
          'none',

        '&:hover': {
          textDecoration:
            'underline',
        },
      }}
    >
      {data.website}
    </Typography>
  ) : (
    <Typography
      sx={{
        color: '#9CA3AF',
        fontSize: 14,
        fontStyle: 'italic',
      }}
    >
      Website not available
    </Typography>
  )}
</Box>
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
  sx={{
    color: '#7A1E1E !important',
    fontWeight: 700,
  }}
>
  Committee Members
</Typography>

<Button
  startIcon={<AddIcon />}
  variant="contained"
  sx={{
    bgcolor: '#7C3AED',
  }}
  onClick={() => {
    setCommitteeForm({
      id: '',
      userId: '',
      committeeRole: '',
      joiningDate: '',
      endDate: '',
      remarks: '',
      status: 1,
    })

    setOpenCommitteeDialog(true)
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

<Dialog
  open={openCommitteeDialog}
  onClose={() =>
    setOpenCommitteeDialog(false)
  }
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      bgcolor: '#FFFDF8',
      borderRadius: 4,
      border:
        '1px solid rgba(122,30,30,0.12)',
      overflow: 'hidden',
    },
  }}
>
  {/* HEADER */}

  <DialogTitle
    sx={{
      bgcolor: '#FFF7F0',
      color: '#7A1E1E',
      fontWeight: 700,
      borderBottom:
        '1px solid rgba(122,30,30,0.10)',

      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    {committeeForm.id
      ? 'Edit Committee'
      : 'Add Committee'}

    <IconButton
      onClick={() =>
        setOpenCommitteeDialog(false)
      }
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>

<Divider
  sx={{
    borderColor:
      'rgba(122,30,30,0.12)',
  }}
/>
  {/* CONTENT */}

  <DialogContent
    sx={{
      bgcolor: '#FFFFFF',
      pt: 3,
    }}
  >
    <Stack spacing={2} mt={1}>

<Autocomplete
  options={users}

  value={
    users.find(
      (u) =>
        String(u.id) ===
        String(
          committeeForm.userId
        )
    ) || null
  }

  getOptionLabel={(option) =>
    option?.name || ''
  }

  isOptionEqualToValue={(
    option,
    value
  ) =>
    String(option.id) ===
    String(value?.id)
  }

  onInputChange={(
    _,
    value
  ) => {
    setUserSearch(value)
  }}

  onChange={(
    _,
    value
  ) => {
    setCommitteeForm(
      (prev) => ({
        ...prev,
        userId:
          value?.id || '',
      })
    )
  }}

  slotProps={{
    paper: {
      sx: {
        bgcolor:
          '#FFFFFF !important',

        color:
          '#111827 !important',

        border:
          '1px solid #E7D4C7',

        borderRadius: 3,

        '& .MuiAutocomplete-option':
          {
            bgcolor:
              '#FFFFFF !important',

            color:
              '#111827 !important',
          },

        '& .MuiAutocomplete-option:hover':
          {
            bgcolor:
              '#FFF7F0 !important',
          },

        '& .MuiAutocomplete-option.Mui-focused':
          {
            bgcolor:
              '#FFF3E0 !important',
          },
      },
    },
  }}

  renderOption={(
    props,
    option
  ) => (
    <Box
      component="li"
      {...props}
      key={option.id}
      sx={{
        display:
          'flex',
        alignItems:
          'center',
        gap: 1.5,
        py: 1,
        bgcolor:
          '#fff !important',
      }}
    >
      <Avatar
        src={
          option.profileImage ||
          DEFAULT_PROFILE
        }
        sx={{
          width: 42,
          height: 42,
        }}
      />

      <Box>
        <Typography
          sx={{
            color:
              '#111827',
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {option.name}
        </Typography>

        <Typography
          sx={{
            color:
              '#6B7280',
            fontSize: 12,
          }}
        >
          {option.mobileNumber}
        </Typography>
      </Box>
    </Box>
  )}

  renderInput={(params) => (
    <TextField
      {...params}
      label="Select User"
      placeholder="Search by name / mobile"

      sx={{
        ...fieldStyle,

        '& .MuiOutlinedInput-root':
          {
            bgcolor:
              '#FFFFFF',
          },

        '& input': {
          color:
            '#111827 !important',
        },
      }}
    />
  )}
/>

      <TextField
        select
        label="Role"
        value={
          committeeForm.committeeRole
        }
        onChange={(e) =>
          setCommitteeForm({
            ...committeeForm,
            committeeRole:
              e.target.value,
          })
        }
        sx={fieldStyle}
      >
        <MenuItem value="PRESIDENT">
          President
        </MenuItem>

        <MenuItem value="VICE_PRESIDENT">
          Vice President
        </MenuItem>

        <MenuItem value="SECRETARY">
          Secretary
        </MenuItem>

        <MenuItem value="TREASURER">
          Treasurer
        </MenuItem>
      </TextField>

      <TextField
        type="date"
        label="Joining Date"
        InputLabelProps={{
          shrink: true,
        }}
        value={
          committeeForm.joiningDate
        }
        onChange={(e) =>
          setCommitteeForm({
            ...committeeForm,
            joiningDate:
              e.target.value,
          })
        }
        sx={fieldStyle}
      />

      <TextField
        type="date"
        label="End Date"
        InputLabelProps={{
          shrink: true,
        }}
        value={
          committeeForm.endDate
        }
        onChange={(e) =>
          setCommitteeForm({
            ...committeeForm,
            endDate:
              e.target.value,
          })
        }
        sx={fieldStyle}
      />

      <TextField
        label="Remarks"
        multiline
        rows={3}
        value={
          committeeForm.remarks
        }
        onChange={(e) =>
          setCommitteeForm({
            ...committeeForm,
            remarks:
              e.target.value,
          })
        }
        sx={fieldStyle}
      />
    </Stack>
  </DialogContent>

  {/* FOOTER */}

  <DialogActions
    sx={{
      bgcolor: '#FFF7F0',
      borderTop:
        '1px solid rgba(122,30,30,0.10)',
      px: 3,
      py: 2,
    }}
  >
    <Button
      onClick={() =>
        setOpenCommitteeDialog(false)
      }
      sx={{
        color: '#8A6D3B',
      }}
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={() =>
        committeeMutation.mutate({
          id: committeeForm.id,
          dharamshalaId: id,
          userId:
            committeeForm.userId,
          committeeRole:
            committeeForm.committeeRole,
          joiningDate:
            committeeForm.joiningDate,
          endDate:
            committeeForm.endDate,
          remarks:
            committeeForm.remarks,
          status:
            committeeForm.status,
        })
      }
      sx={{
        bgcolor: '#7A1E1E',

        '&:hover': {
          bgcolor: '#651818',
        },
      }}
    >
      {committeeForm.id
        ? 'Update'
        : 'Save'}
    </Button>
  </DialogActions>
</Dialog>
  
{/* EDIT DHARAMSHALA DIALOG */}

<Dialog
  open={openEditDialog}
  onClose={() =>
    setOpenEditDialog(false)
  }
  maxWidth="md"
  fullWidth
  scroll="paper"
  PaperProps={{
    sx: {
      borderRadius: 4,
      bgcolor: '#FFFDF8',
      overflow: 'hidden',
    },
  }}
>
  {/* HEADER */}

  <DialogTitle
    sx={{
      bgcolor: '#FFF7F0',
      color: '#7A1E1E',
      fontWeight: 700,
      fontSize: 32,

      display: 'flex',
      justifyContent:
        'space-between',
      alignItems: 'center',
    }}
  >
    Edit Dharamshala

    <IconButton
      onClick={() =>
        setOpenEditDialog(false)
      }
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>

  <Divider />

  {/* CONTENT */}

  <DialogContent
    sx={{
      bgcolor: '#FFFFFF',
      p: 4,
    }}
  >
    <Stack spacing={3}>

      <TextField
        label="Name"
        fullWidth
        value={dharamshalaForm.name}
        onChange={(e) =>
          setDharamshalaForm({
            ...dharamshalaForm,
            name:
              e.target.value,
          })
        }
        sx={fieldStyle}
      />

      <TextField
        label="Mobile Number"
        fullWidth
        value={
          dharamshalaForm.mobileNumber
        }
        onChange={(e) =>
          setDharamshalaForm({
            ...dharamshalaForm,
            mobileNumber:
              e.target.value,
          })
        }
        sx={fieldStyle}
      />

      <TextField
        label="Alternate Mobile"
        fullWidth
        value={
          dharamshalaForm.alternateMobileNumber
        }
        onChange={(e) =>
          setDharamshalaForm({
            ...dharamshalaForm,
            alternateMobileNumber:
              e.target.value,
          })
        }
        sx={fieldStyle}
      />

      <TextField
        label="Email"
        fullWidth
        value={
          dharamshalaForm.email
        }
        onChange={(e) =>
          setDharamshalaForm({
            ...dharamshalaForm,
            email:
              e.target.value,
          })
        }
        sx={fieldStyle}
      />

      <TextField
        label="Website"
        fullWidth
        value={
          dharamshalaForm.website
        }
        onChange={(e) =>
          setDharamshalaForm({
            ...dharamshalaForm,
            website:
              e.target.value,
          })
        }
        sx={fieldStyle}
      />

      <TextField
        label="Address"
        fullWidth
        multiline
        rows={2}
        value={
          dharamshalaForm.address
        }
        onChange={(e) =>
          setDharamshalaForm({
            ...dharamshalaForm,
            address:
              e.target.value,
          })
        }
        sx={fieldStyle}
      />

      <TextField
        label="Established Year"
        fullWidth
        value={
          dharamshalaForm.establishedYear
        }
        onChange={(e) =>
          setDharamshalaForm({
            ...dharamshalaForm,
            establishedYear:
              e.target.value,
          })
        }
        sx={fieldStyle}
      />

      <TextField
        label="Description"
        multiline
        rows={5}
        fullWidth
        value={
          dharamshalaForm.description
        }
        onChange={(e) =>
          setDharamshalaForm({
            ...dharamshalaForm,
            description:
              e.target.value,
          })
        }
        sx={fieldStyle}
      />

      {/* IMAGE UPLOADS */}

      <Stack
        direction={{
          xs: 'column',
          md: 'row',
        }}
        spacing={2}
      >
        <Button
          component="label"
          variant="outlined"
          startIcon={
            <PhotoCameraIcon />
          }
          sx={{
            flex: 1,
            py: 1.5,
            color: '#7A1E1E',
            borderColor:
              '#7A1E1E',
          }}
        >
          Upload Profile

          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(e) =>
              setDharamshalaForm({
                ...dharamshalaForm,
                profileImageFile:
                  e.target
                    .files?.[0],
              })
            }
          />
        </Button>

        <Button
          component="label"
          variant="outlined"
          startIcon={
            <PhotoCameraIcon />
          }
          sx={{
            flex: 1,
            py: 1.5,
            color: '#7A1E1E',
            borderColor:
              '#7A1E1E',
          }}
        >
          Upload Banner

          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(e) =>
              setDharamshalaForm({
                ...dharamshalaForm,
                bannerImageFile:
                  e.target
                    .files?.[0],
              })
            }
          />
        </Button>
      </Stack>

    </Stack>
  </DialogContent>

  {/* FOOTER */}

  <DialogActions
    sx={{
      bgcolor: '#FFF7F0',
      p: 3,
    }}
  >
    <Button
      onClick={() =>
        setOpenEditDialog(false)
      }
      sx={{
        color: '#7A1E1E',
      }}
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      disabled={
        updateMutation.isPending
      }
      onClick={() =>
        updateMutation.mutate(
          dharamshalaForm
        )
      }
      sx={{
        bgcolor: '#E31E24',

        '&:hover': {
          bgcolor: '#C81A20',
        },
      }}
    >
      {updateMutation.isPending
        ? 'Updating...'
        : 'Update'}
    </Button>
  </DialogActions>
</Dialog>
  </Box>
)
}
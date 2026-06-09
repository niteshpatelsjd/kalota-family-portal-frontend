import { useState, useEffect } from 'react'

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Stack,
  Card,
  CardContent,
  InputAdornment,
  Avatar,
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import BlockIcon from '@mui/icons-material/Block'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SearchIcon from '@mui/icons-material/Search'
import LocationOnIcon from '@mui/icons-material/LocationOn'

import { useForm } from 'react-hook-form'

import toast from 'react-hot-toast'

import api from '../../api/axiosInstance'

import DataTable from '../../components/common/DataTable'

/* ───────────────── API ───────────────── */

const getDistricts = (params) =>
  api
    .get('/admin/district/getAllDistrict', {
      params,
    })
    .then((r) => r.data.responseBody)

const getDistrictById = (id) =>
  api
    .get(`/admin/district/getById/${id}`)
    .then((r) => r.data.responseBody)

/* ───────────────── STAT CARD ───────────────── */

function StatCard({
  label,
  value,
  icon,
  color,
}) {
  return (
    <Card
      sx={{
        background:
          'rgba(255,255,255,0.65)',

        backdropFilter: 'blur(14px)',

        border:
          '1px solid rgba(122,30,30,0.12)',

        borderRadius: 3,

        boxShadow:
          '0 10px 30px rgba(122,30,30,0.08)',

        height: '100%',
      }}
    >
      <CardContent
        sx={{
          p: '20px !important',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'space-between',

            width: '100%',
          }}
        >
          {/* LEFT CONTENT */}
          <Box>
            <Typography
              sx={{
                color: '#8A6D3B',
                fontSize: 14,
                fontWeight: 600,
                mb: 1,
              }}
            >
              {label}
            </Typography>

            <Typography
              sx={{
                color: '#7A1E1E',
                fontSize: 34,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {value || 0}
            </Typography>
          </Box>

          {/* RIGHT ICON */}
          <Avatar
            sx={{
              bgcolor: `${color}18`,
              color,
              width: 64,
              height: 64,
              borderRadius: 4,
              flexShrink: 0,

              '& svg': {
                fontSize: 34,
              },
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  )
}


const fieldStyle = {
  '& .MuiOutlinedInput-root': {
    bgcolor: '#fff',

    color: '#1E1E1E',

    '& input': {
      color: '#1E1E1E',
    },

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
    fontSize: 13,
    backgroundColor: '#fff',
    px: 0.5,
  },

  '& .MuiInputLabel-root.Mui-focused': {
    color: '#7A1E1E',
  },

  '& .MuiInputBase-input': {
    color: '#1E1E1E',
  },
}
/* ───────────────── FORM DIALOG ───────────────── */

function DistrictFormDialog({
  open,
  onClose,
  editing,
  onSaved,
}) {
  const {
    register,
    handleSubmit,
    reset,

    formState: {
      isSubmitting,
    },
  } = useForm({
    defaultValues: {
      name: '',
      latitude: '',
      longitude: '',
    },
  })

  useEffect(() => {
    reset({
      name:
        editing?.name || '',

      latitude:
        editing?.latitude || '',

      longitude:
        editing?.longitude || '',
    })
  }, [editing, reset])

const onSubmit = async (values) => {
  try {
    const payload = {
      id: editing?._id || '',
      name: values.name,
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
    }

    const res = await api.post(
      '/admin/district/addDistrict',
      payload
    )

    const data = res.data

    // HANDLE CUSTOM RESPONSE CODE
    if (data.responseCode !== 200) {
      toast.error(
        data.message ||
          'Failed to save district'
      )

      return
    }

    toast.success(
      editing
        ? 'District updated'
        : 'District added'
    )

    onSaved()
  } catch (err) {
    console.log(err)

    toast.error(
      err.response?.data?.message ||
        err.message ||
        'Something went wrong'
    )
  }
}

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#FFFDF8',

          border:
            '1px solid rgba(122,30,30,0.12)',

          borderRadius: 4,

          overflow: 'hidden',

          boxShadow:
            '0 12px 40px rgba(122,30,30,0.12)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent:
            'space-between',

          px: 3,
          pt: 2,
          pb: 2,

          bgcolor: '#FFF7F0',

          borderBottom:
            '1px solid rgba(122,30,30,0.10)',

          color: '#7A1E1E',

          fontWeight: 700,
        }}
      >
        {editing
          ? 'Edit District'
          : 'Add District'}
      </DialogTitle>

      <Box
        sx={{
          height: 10,
          bgcolor: '#FFFFFF',
        }}
      />

      <DialogContent
        sx={{
          px: 3,
          pt: 3,
          pb: 3,
          bgcolor: '#FFFFFF',
        }}
      >
        <Box
          component="form"
          id="district-form"
          onSubmit={handleSubmit(
            onSubmit
          )}
        >
          <Stack spacing={2}>

            {/* DISTRICT NAME */}

            <TextField
              fullWidth
              label="District Name"
              {...register('name')}
              size="small"
              required
              sx={fieldStyle}
            />

            {/* LATITUDE */}
<TextField
  fullWidth
  label="Latitude"
  inputMode="decimal"
  {...register('latitude')}
  size="small"
  sx={fieldStyle}
/>

<TextField
  fullWidth
  label="Longitude"
  inputMode="decimal"
  {...register('longitude')}
  size="small"
  sx={fieldStyle}
/>

          </Stack>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          bgcolor: '#FFF7F0',

          borderTop:
            '1px solid rgba(122,30,30,0.10)',
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: '#8A6D3B',
          }}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          form="district-form"
          variant="contained"
          disabled={isSubmitting}
          sx={{
            bgcolor: '#7A1E1E',

            '&:hover': {
              bgcolor: '#651818',
            },
          }}
        >
          {isSubmitting
            ? 'Saving...'
            : editing
            ? 'Update District'
            : 'Add District'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

/* ───────────────── MAIN PAGE ───────────────── */

export default function DistrictPage() {
  const qc = useQueryClient()

  const [page, setPage] =
    useState(0)

  const [pageSize, setPageSize] =
    useState(10)

  const [search, setSearch] =
    useState('')

  const [formOpen, setFormOpen] =
    useState(false)

  const [editing, setEditing] =
    useState(null)

  const {
    data,
    isFetching,
  } = useQuery({
    queryKey: [
      'districts',
      page,
      pageSize,
      search,
    ],

    queryFn: () =>
      getDistricts({
        pageIndex: page,
        pageSize,
        searchText:
          search || undefined,
      }),
  })

  const districts =
    data?.content ?? []

  const total =
    data?.total || 0

  const totalDistrict =
    data?.totalDistrict || 0

  const activeCount =
    data?.totalActive || 0

  const inactiveCount =
    data?.totalInactive || 0

  const blockMutation =
    useMutation({
      mutationFn: ({
        id,
        status,
      }) =>
        api.post(
          '/admin/district/blockUnblock',
          {
            id,
            status,
          }
        ),

      onSuccess: (_, vars) => {
        qc.invalidateQueries({
          queryKey: ['districts'],
        })

        toast.success(
          vars.status === 1
            ? 'District activated'
            : 'District blocked'
        )
      },

      onError: (e) =>
        toast.error(
          e.response?.data
            ?.message ||
            'Failed to update status'
        ),
    })

const columns = [
  {
    key: 'name',

    label: 'District',

    render: (r) => (
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
      >
        <Avatar
          sx={{
            width: 30,
            height: 30,

            bgcolor:
              'rgba(122,30,30,0.10)',
          }}
        >
          <LocationOnIcon
            sx={{
              fontSize: 16,
              color: '#7A1E1E',
            }}
          />
        </Avatar>

        <Typography
          fontSize={12}
          fontWeight={600}
          color="#1E1E1E"
        >
          {r.name}
        </Typography>
      </Stack>
    ),
  },

  // LATITUDE
  {
    key: 'latitude',

    label: 'Latitude',

    render: (r) => (
      <Typography
        fontSize={12}
        fontWeight={500}
        color="#444"
      >
        {r.latitude || '-'}
      </Typography>
    ),
  },

  // LONGITUDE
  {
    key: 'longitude',

    label: 'Longitude',

    render: (r) => (
      <Typography
        fontSize={12}
        fontWeight={500}
        color="#444"
      >
        {r.longitude || '-'}
      </Typography>
    ),
  },

  {
    key: 'status',

    label: 'Status',

    render: (r) => (
      <Chip
        size="small"
        label={
          r.status === 1
            ? 'Active'
            : 'Inactive'
        }
        sx={{
          height: 22,
          fontSize: 11,
          fontWeight: 600,

          bgcolor:
            r.status === 1
              ? 'rgba(34,197,94,0.1)'
              : 'rgba(239,68,68,0.1)',

          color:
            r.status === 1
              ? '#22c55e'
              : '#ef4444',

          border: `1px solid ${
            r.status === 1
              ? 'rgba(34,197,94,0.2)'
              : 'rgba(239,68,68,0.2)'
          }`,
        }}
      />
    ),
  },

  {
    key: 'actions',

    label: 'Actions',

    render: (r) => (
      <Stack
        direction="row"
        spacing={1}
      >
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={() => {
              setEditing(r)
              setFormOpen(true)
            }}
            sx={{
              color: '#A1887F',

              '&:hover': {
                color: '#E31E24',

                bgcolor:
                  'rgba(227,30,36,0.08)',
              },
            }}
          >
            <EditIcon
              sx={{
                fontSize: 16,
              }}
            />
          </IconButton>
        </Tooltip>

        <Tooltip
          title={
            r.status === 1
              ? 'Inactive'
              : 'Activate'
          }
        >
          <IconButton
            size="small"
            onClick={() =>
              blockMutation.mutate({
                id: r._id,
                status:
                  r.status === 1
                    ? 2
                    : 1,
              })
            }
            sx={{
              color: '#A1887F',

              '&:hover': {
                color:
                  r.status === 1
                    ? '#ef4444'
                    : '#22c55e',

                bgcolor:
                  r.status === 1
                    ? 'rgba(239,68,68,0.08)'
                    : 'rgba(34,197,94,0.08)',
              },
            }}
          >
            {r.status === 1 ? (
              <BlockIcon
                sx={{
                  fontSize: 16,
                }}
              />
            ) : (
              <CheckCircleIcon
                sx={{
                  fontSize: 16,
                }}
              />
            )}
          </IconButton>
        </Tooltip>
      </Stack>
    ),
  },
]

  return (
    <Box>
      {/* HEADER */}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent:
            'space-between',

          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 700,
            color: '#7A1E1E',
          }}
        >
          District Management
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
          sx={{
            bgcolor: '#E31E24',

            '&:hover': {
              bgcolor: '#c41920',
            },
          }}
        >
          Add District
        </Button>
      </Box>

      {/* STATS */}

      <Box
        sx={{
          display: 'grid',

          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2,1fr)',
            lg: 'repeat(3,1fr)',
          },

          gap: 2,
          mb: 3,
        }}
      >
        <StatCard
          label="Total Districts"
          value={totalDistrict}
          color="#E31E24"
          icon={<LocationOnIcon />}
        />

        <StatCard
          label="Active"
          value={activeCount}
          color="#22C55E"
          icon={<CheckCircleIcon />}
        />

        <StatCard
          label="Inactive"
          value={inactiveCount}
          color="#F59E0B"
          icon={<BlockIcon />}
        />
      </Box>

      {/* SEARCH */}

      <Box
        sx={{
          display: 'flex',
          justifyContent:
            'space-between',

          mb: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: 12,
            color: '#A1887F',
          }}
        >
          {total > 0
            ? `Showing ${districts.length} of ${total} districts`
            : ''}
        </Typography>

        <TextField
          size="small"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(
              e.target.value
            )

            setPage(0)
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{
                    fontSize: 16,
                    color: '#A1887F',
                  }}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            width: 220,

            '& .MuiOutlinedInput-root':
              {
                bgcolor: '#FFF7F0',
                height: 34,

                '& fieldset': {
                  borderColor:
                    '#E7D4C7',
                },

                '&:hover fieldset':
                  {
                    borderColor:
                      '#444',
                  },

                '&.Mui-focused fieldset':
                  {
                    borderColor:
                      '#E31E24',
                  },
              },

            '& .MuiInputBase-input': {
              color: '#1E1E1E',
              fontSize: 12,
              py: 0,
            },
          }}
        />
      </Box>

      {/* TABLE */}

      <DataTable
        columns={columns}
        rows={districts}
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(s) => {
          setPageSize(s)
          setPage(0)
        }}
        loading={isFetching}
      />

      {/* FORM */}

      {formOpen && (
        <DistrictFormDialog
          open={formOpen}
          editing={editing}
          onClose={() => {
            setFormOpen(false)
            setEditing(null)
          }}
          onSaved={() => {
            setFormOpen(false)

            setEditing(null)

            qc.invalidateQueries({
              queryKey: ['districts'],
            })
          }}
        />
      )}
    </Box>
  )
}
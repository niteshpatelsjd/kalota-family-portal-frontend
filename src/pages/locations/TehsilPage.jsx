
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
  MenuItem,
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

const getTehsils = (params) =>
  api
    .get('/admin/tehsil/getAllTehsil', {
      params,
    })
    .then((r) => r.data.responseBody)

const getDistricts = () =>
  api
    .get('/admin/district/getAllDistrict', {
      params: {
        pageIndex: 0,
        pageSize: 100,
        status: 1,
      },
    })
    .then((r) => r.data.responseBody)

/* ───────────────── FIELD STYLE ───────────────── */

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
          }}
        >
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
              }}
            >
              {value || 0}
            </Typography>
          </Box>

          <Avatar
            sx={{
              bgcolor: `${color}18`,
              color,
              width: 64,
              height: 64,
              borderRadius: 4,

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

/* ───────────────── FORM DIALOG ───────────────── */

function TehsilFormDialog({
  open,
  onClose,
  editing,
  onSaved,
  districts,
}) {
const {
  register,
  handleSubmit,
  reset,
  watch,
  setValue,

    formState: {
      isSubmitting,
    },
  } = useForm({
    defaultValues: {
      districtId: '',
      name: '',
      latitude: '',
      longitude: '',
    },
  })

  useEffect(() => {
    reset({
      districtId:
        editing?.districtId?._id || '',

      name: editing?.name || '',

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
      districtId: values.districtId,
      name: values.name.trim(),

      latitude:
        values.latitude === ''
          ? 0
          : parseFloat(values.latitude),

      longitude:
        values.longitude === ''
          ? 0
          : parseFloat(values.longitude),
    }

    const res = await api.post(
      '/admin/tehsil/addTehsil',
      payload
    )

    // HANDLE CUSTOM API RESPONSE
    if (res.data.responseCode !== 200) {
      toast.error(
        res.data.message ||
          'Failed to save tehsil'
      )
      return
    }

    toast.success(
      editing
        ? 'Tehsil updated'
        : 'Tehsil added'
    )

    onSaved()
  } catch (err) {
    toast.error(
      err.response?.data?.message ||
        'Failed to save tehsil'
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
          ? 'Edit Tehsil'
          : 'Add Tehsil'}
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
          id="tehsil-form"
          onSubmit={handleSubmit(
            onSubmit
          )}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >


<TextField
  select
  fullWidth
  label="District"
  size="small"
  sx={fieldStyle}
  {...register('districtId', {
    required: true,
  })}
>
  {districts.map((d) => (
    <MenuItem
      key={d._id}
      value={d._id}
    >
      {d.name}
    </MenuItem>
  ))}
</TextField>

<TextField
  fullWidth
  label="Tehsil Name"
  size="small"
  {...register('name')}
  sx={fieldStyle}
/>

<TextField
  fullWidth
  label="Latitude"
  size="small"
  inputMode="decimal"
  inputProps={{
    step: 'any',
  }}
  {...register('latitude')}
  sx={fieldStyle}
/>

<TextField
  fullWidth
  label="Longitude"
  size="small"
  inputMode="decimal"
  inputProps={{
    step: 'any',
  }}
  {...register('longitude')}
  sx={fieldStyle}
/>

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
          form="tehsil-form"
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
            ? 'Update Tehsil'
            : 'Add Tehsil'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

/* ───────────────── MAIN PAGE ───────────────── */

export default function TehsilPage() {
  const qc = useQueryClient()

  const [page, setPage] =
    useState(0)

  const [pageSize, setPageSize] =
    useState(10)

  const [search, setSearch] =
    useState('')

    const [selectedDistrict, setSelectedDistrict] =
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
        'tehsils',
        page,
        pageSize,
        search,
        selectedDistrict,
        ],



queryFn: () =>
  getTehsils({
    pageIndex: page,
    pageSize,
    districtId:
      selectedDistrict || undefined,
    searchText:
      search || undefined,
  }),
  })

  const {
    data: districtData,
  } = useQuery({
    queryKey: ['districts'],
    queryFn: getDistricts,
  })

  const districts =
    districtData?.content ?? []

  const tehsils =
    data?.content ?? []

  const total =
    data?.total || 0

  const totalTehsils =
    data?.totalTehsils || 0

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
          '/admin/tehsil/blockUnblock',
          {
            id,
            status,
          }
        ),

      onSuccess: () => {
        qc.invalidateQueries({
          queryKey: ['tehsils'],
        })

        toast.success(
          'Status updated'
        )
      },
    })

  const columns = [
    {
      key: 'district',

      label: 'District',

      render: (r) => (
        <Typography
          fontSize={13}
          fontWeight={600}
          color="#1E1E1E"
        >
          {r.districtId?.name}
        </Typography>
      ),
    },

    {
      key: 'name',

      label: 'Tehsil',

      render: (r) => (
        <Typography
          fontSize={13}
          fontWeight={600}
          color="#1E1E1E"
        >
          {r.name}
        </Typography>
      ),
    },

    {
      key: 'latitude',
      label: 'Latitude',
    },

    {
      key: 'longitude',
      label: 'Longitude',
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
          Tehsil Management
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
          Add Tehsil
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
          label="Total Tehsils"
          value={totalTehsils}
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

{/* SEARCH */}


      {/* District By*/}

{/* District Filter + Search */}

<Box
  sx={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 2,
    mb: 2,
    flexWrap: 'wrap',
  }}
>
  {/* LEFT SIDE TEXT */}
  <Typography
    sx={{
      fontSize: 12,
      color: '#A1887F',
    }}
  >
    {total > 0
      ? `Showing ${tehsils.length} of ${total} tehsils`
      : ''}
  </Typography>

  {/* RIGHT SIDE FILTERS */}
  <Box
    sx={{
      display: 'flex',
      gap: 2,
      alignItems: 'center',
      flexWrap: 'wrap',
    }}
  >
    {/* DISTRICT DROPDOWN */}

    <TextField
      select
      label="District"
      size="small"
      value={selectedDistrict}
      onChange={(e) => {
        setSelectedDistrict(
          e.target.value
        )

        setPage(0)
      }}
      sx={{
        minWidth: 190,

        '& .MuiOutlinedInput-root':
          {
            bgcolor: '#FFF7F0',

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

        '& .MuiInputLabel-root': {
          color: '#9C7A3B',
          fontSize: 13,
        },

        '& .MuiInputBase-input': {
          color: '#1E1E1E',
          fontSize: 13,
        },
      }}
      SelectProps={{
        MenuProps: {
          PaperProps: {
            sx: {
              '& .MuiMenuItem-root': {
                color: '#1E1E1E',
                fontSize: 13,
              },
            },
          },
        },
      }}
    >
      <MenuItem value="">
        All Districts
      </MenuItem>

      {districts.map((d) => (
        <MenuItem
          key={d._id}
          value={d._id}
        >
          {d.name}
        </MenuItem>
      ))}
    </TextField>

    {/* SEARCH */}

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
          fontSize: 13,
        },
      }}
    />
  </Box>
</Box>

      {/* TABLE */}

      <DataTable
        columns={columns}
        rows={tehsils}
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
        <TehsilFormDialog
          open={formOpen}
          editing={editing}
          districts={districts}
          onClose={() => {
            setFormOpen(false)
            setEditing(null)
          }}
          onSaved={() => {
            setFormOpen(false)

            setEditing(null)

            qc.invalidateQueries({
              queryKey: ['tehsils'],
            })
          }}
        />
      )}
    </Box>
  )
}

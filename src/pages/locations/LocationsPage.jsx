
import { useState } from 'react'
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
  Divider,
  Stack,
  Card,
  CardContent,
  InputAdornment,
  MenuItem,
  Avatar,
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import BlockIcon from '@mui/icons-material/Block'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PersonOffIcon from '@mui/icons-material/PersonOff'
import MapIcon from '@mui/icons-material/Map'

import {
  useForm,
  Controller,
  useWatch,
} from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import toast from 'react-hot-toast'

import api from '../../api/axiosInstance'
import DataTable from '../../components/common/DataTable'

/* ───────────────── API ───────────────── */

const getLocations = (params) =>
  api
    .get('/admin/location/getAllLocations', {
      params,
    })
    .then((r) => r.data.responseBody)

const getLocationById = (id) =>
  api
    .get(`/admin/location/getById/${id}`)
    .then((r) => r.data.responseBody)

const getDistricts = () =>
  api
    .get('/admin/location/getDistricts')
    .then((r) => r.data.responseBody ?? [])

const getTehsils = (district) =>
  api
    .get('/admin/location/getTehsils', {
      params: { district },
    })
    .then((r) => r.data.responseBody ?? [])

const getVillages = (
  district,
  tehsil
) =>
  api
    .get('/admin/location/getVillages', {
      params: { district, tehsil },
    })
    .then((r) => r.data.responseBody ?? [])

/* ───────────────── SCHEMA ───────────────── */

const schema = yup.object({
  district: yup
    .string()
    .required('District is required'),

  tehsil: yup
    .string()
    .required('Tehsil is required'),

  village: yup
    .string()
    .required('Village is required'),

  latitude: yup
    .number()
    .nullable()
    .transform((v) =>
      isNaN(v) ? null : v
    ),

  longitude: yup
    .number()
    .nullable()
    .transform((v) =>
      isNaN(v) ? null : v
    ),
})

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

        transition: 'all 0.25s ease',

        '&:hover': {
          transform: 'translateY(-2px)',

          boxShadow:
            '0 14px 34px rgba(122,30,30,0.12)',
        },
      }}
    >
      <CardContent
        sx={{ p: '16px !important' }}
      >
        <Stack
          direction="row"
          alignItems="flex-start"
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                color: '#8A6D3B',
                fontSize: 13,
                fontWeight: 600,
                mb: 1,
              }}
            >
              {label}
            </Typography>

            <Typography
              sx={{
                color: '#7A1E1E',
                fontSize: 28,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {value ?? '—'}
            </Typography>
          </Box>

          <Avatar
            sx={{
              bgcolor: `${color}18`,
              color,
              width: 52,
              height: 52,
              borderRadius: 3,

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

/* ───────────────── INFO FIELD ───────────────── */

function InfoField({
  label,
  value,
}) {
  return (
    <TextField
      fullWidth
      size="small"
      label={label}
      value={value || '—'}
      InputProps={{
        readOnly: true,
      }}
      sx={{
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

        '& .MuiInputLabel-root.Mui-focused':
          {
            color: '#7A1E1E',
          },

        '& .MuiInputBase-input': {
          color: '#1E1E1E',
          fontSize: 14,
          WebkitTextFillColor:
            '#1E1E1E',
          cursor: 'default',
        },
      }}
    />
  )
}

/* ───────────────── VIEW DIALOG ───────────────── */

function ViewDialog({
  locId,
  onClose,
}) {
  const { data, isLoading } =
    useQuery({
      queryKey: [
        'location-detail',
        locId,
      ],

      queryFn: () =>
        getLocationById(locId),

      enabled: !!locId,
    })

  return (
    <Dialog
      open={!!locId}
      onClose={onClose}
      maxWidth="md"
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
        }}
      >
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 700,
            color: '#7A1E1E',
          }}
        >
          Location Details
        </Typography>

        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: '#8A6D3B',

            '&:hover': {
              bgcolor:
                'rgba(122,30,30,0.06)',

              color: '#7A1E1E',
            },
          }}
        >
          <CloseIcon
            sx={{ fontSize: 20 }}
          />
        </IconButton>
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
        {isLoading ? (
          <Box
            sx={{
              py: 5,
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{ color: '#8A6D3B' }}
            >
              Loading...
            </Typography>
          </Box>
        ) : data ? (
          <Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection:
                  'column',
                gap: 2.2,
              }}
            >
              <InfoField
                label="District"
                value={data.district}
              />

              <InfoField
                label="Tehsil"
                value={data.tehsil}
              />

              <InfoField
                label="Village"
                value={data.village}
              />

              <InfoField
                label="Latitude"
                value={data.latitude}
              />

              <InfoField
                label="Longitude"
                value={data.longitude}
              />

              <InfoField
                label="Created At"
                value={data.createdAt}
              />

              <InfoField
                label="Updated At"
                value={data.updatedAt}
              />
            </Box>
          </Box>
        ) : null}
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
          variant="contained"
          sx={{
            bgcolor: '#7A1E1E',

            '&:hover': {
              bgcolor: '#651818',
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

/* ───────────────── FORM DIALOG ───────────────── */

function LocationFormDialog({
  open,
  onClose,
  editing,
  onSaved,
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,

    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: yupResolver(schema),

    defaultValues: {
      district: '',
      tehsil: '',
      village: '',
      latitude: '',
      longitude: '',
    },
  })

  useState(() => {
    reset({
      district:
        editing?.district || '',

      tehsil:
        editing?.tehsil || '',

      village:
        editing?.village || '',

      latitude:
        editing?.latitude || '',

      longitude:
        editing?.longitude || '',
    })
  }, [editing, open, reset])

  const selectedDistrict =
    useWatch({
      control,
      name: 'district',
    })

  const selectedTehsil =
    useWatch({
      control,
      name: 'tehsil',
    })

  const { data: districts = [] } =
    useQuery({
      queryKey: ['districts'],
      queryFn: getDistricts,
    })

  const { data: tehsils = [] } =
    useQuery({
      queryKey: [
        'tehsils',
        selectedDistrict,
      ],

      queryFn: () =>
        getTehsils(
          selectedDistrict
        ),

      enabled: !!selectedDistrict,
    })

  const { data: villages = [] } =
    useQuery({
      queryKey: [
        'villages',
        selectedDistrict,
        selectedTehsil,
      ],

      queryFn: () =>
        getVillages(
          selectedDistrict,
          selectedTehsil
        ),

      enabled:
        !!selectedDistrict &&
        !!selectedTehsil,
    })

  const field = (props) => ({
    size: 'small',
    fullWidth: true,

    sx: {
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

      '& .MuiInputLabel-root.Mui-focused':
        {
          color: '#7A1E1E',
        },

      '& .MuiInputBase-input': {
        color: '#1E1E1E',
        fontSize: 14,
      },
    },

    ...props,
  })

  const onSubmit = async (
    values
  ) => {
    try {
      const body = {
        ...values,
      }

      if (editing) {
        body.id = editing.id
      } else {
        body.id = ''
      }

      await api.post(
        '/admin/location/addLocation',
        body
      )

      toast.success(
        editing
          ? 'Location updated'
          : 'Location added'
      )

      onSaved()
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Failed to save location'
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
          pb: 3,

          bgcolor: '#FFF7F0',

          borderBottom:
            '1px solid rgba(122,30,30,0.10)',
        }}
      >
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 700,
            color: '#7A1E1E',
          }}
        >
          {editing
            ? 'Edit Location'
            : 'Add New Location'}
        </Typography>

        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: '#1E1E1E',

            '&:hover': {
              bgcolor:
                'rgba(122,30,30,0.08)',

              color: '#7A1E1E',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
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
          pt: 2.5,
          pb: 3,
          bgcolor: '#FFFFFF',
        }}
      >
        <Box
          component="form"
          id="location-form"
          onSubmit={handleSubmit(
            onSubmit
          )}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2.2,
          }}
        >
          <Controller
            name="district"
            control={control}
            render={({ field: f }) => (
              <TextField
                select
                label="District"
                {...field({
                  ...f,
                  error:
                    !!errors.district,

                  helperText:
                    errors.district
                      ?.message,
                })}
              >
                {districts.map((d) => (
                  <MenuItem
                    key={d}
                    value={d}
                  >
                    {d}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

   
<Controller
  name="tehsil"
  control={control}
  render={({ field: f }) => (
    <TextField
      select
      label="Tehsil"
      value={f.value || ''}
      onChange={f.onChange}
      onBlur={f.onBlur}
      inputRef={f.ref}
      disabled={!selectedDistrict}
      error={!!errors.tehsil}
      helperText={errors.tehsil?.message}
      size="small"
      fullWidth
      sx={{
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
          fontSize: 14,
        },

        '& .MuiSelect-select': {
          color: '#1E1E1E',
          fontSize: 14,
        },
      }}
    >
      {tehsils.map((t) => (
        <MenuItem key={t} value={t}>
          {t}
        </MenuItem>
      ))}
    </TextField>
  )}
/>


          <TextField
            label="Village"
            {...field({
              ...register('village'),

              error:
                !!errors.village,

              helperText:
                errors.village
                  ?.message,
            })}
          />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns:
                '1fr 1fr',
              gap: 2,
            }}
          >
            <TextField
              type="number"
              label="Latitude"
              {...field({
                ...register(
                  'latitude'
                ),
              })}
            />

            <TextField
              type="number"
              label="Longitude"
              {...field({
                ...register(
                  'longitude'
                ),
              })}
            />
          </Box>
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
          form="location-form"
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
            ? 'Update Location'
            : 'Add Location'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

/* ───────────────── MAIN PAGE ───────────────── */

export default function LocationsPage() {
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

  const [viewId, setViewId] =
    useState(null)

  const [confirmLoc, setConfirmLoc] =
    useState(null)

  const {
    data,
    isFetching,
  } = useQuery({
    queryKey: [
      'locations',
      page,
      pageSize,
      search,
    ],

    queryFn: () =>
      getLocations({
        pageIndex: page,
        pageSize,
        searchText:
          search || undefined,
      }),
  })

  const locations =
    data?.content ?? []

  const total =
    data?.totalRecords ?? 0

  const totalActive =
    locations.filter(
      (l) => l.status === 1
    ).length

  const totalInactive =
    locations.filter(
      (l) => l.status !== 1
    ).length

  const districtCount = [
    ...new Set(
      locations.map(
        (l) => l.district
      )
    ),
  ].length

  const blockMutation =
    useMutation({
      mutationFn: ({
        id,
        status,
      }) =>
        api.post(
          '/admin/location/blockUnblock',
          {
            id,
            status,
          }
        ),

      onSuccess: (_, vars) => {
        qc.invalidateQueries({
          queryKey: ['locations'],
        })

        toast.success(
          vars.status === 1
            ? 'Location activated'
            : 'Location blocked'
        )

        setConfirmLoc(null)
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
      key: 'district',

      label: 'District',

      render: (r) => (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.2}
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
            fontSize={11}
            fontWeight={600}
            color="#1E1E1E"
          >
            {r.district}
          </Typography>
        </Stack>
      ),
    },

    {
      key: 'tehsil',
      label: 'Tehsil',

      render: (r) => (
        <Typography
          fontSize={11}
          color="#888"
        >
          {r.tehsil}
        </Typography>
      ),
    },

    {
      key: 'village',
      label: 'Village',

      render: (r) => (
        <Typography
          fontSize={11}
          color="#888"
        >
          {r.village}
        </Typography>
      ),
    },

    {
      key: 'coords',
      label: 'Coordinates',

      render: (r) => (
        <Typography
          fontSize={11}
          color="#555"
        >
          {r.latitude},{' '}
          {r.longitude}
        </Typography>
      ),
    },

    {
      key: 'status',
      label: 'Status',

      render: (r) => (
        <Chip
          label={
            r.status === 1
              ? 'Active'
              : 'Inactive'
          }
          size="small"
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
  key: 'createdAt',
  label: 'Created',

  render: (r) => (
    <Typography
      fontSize={11}
      color="#666"
      sx={{
        whiteSpace: 'nowrap',
      }}
    >
      {r.createdAt}
    </Typography>
  ),
},

{
  key: 'updatedAt',
  label: 'Updated',

  render: (r) => (
    <Typography
      fontSize={11}
      color="#666"
      sx={{
        whiteSpace: 'nowrap',
      }}
    >
      {r.updatedAt}
    </Typography>
  ),
},
    {
      key: 'actions',
      label: '',

      render: (r) => (
        <Stack
          direction="row"
          gap={0.5}
        >
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() =>
                setViewId(r.id)
              }
              sx={{
                color: '#A1887F',

                '&:hover': {
                  color: '#7A1E1E',

                  bgcolor:
                    'rgba(122,30,30,0.08)',
                },
              }}
            >
              <VisibilityIcon
                sx={{
                  fontSize: 16,
                }}
              />
            </IconButton>
          </Tooltip>

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
                ? 'Block'
                : 'Activate'
            }
          >
            <IconButton
              size="small"
              onClick={() =>
                setConfirmLoc(r)
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
          Location Management
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
          Add Location
        </Button>
      </Box>

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
          mb: 3,
        }}
      >
        <StatCard
          label="Total Locations"
          value={total}
          color="#E31E24"
          icon={<LocationOnIcon />}
        />

        <StatCard
          label="Active"
          value={totalActive}
          color="#22C55E"
          icon={<CheckCircleIcon />}
        />

        <StatCard
          label="Inactive"
          value={totalInactive}
          color="#F59E0B"
          icon={<PersonOffIcon />}
        />

        <StatCard
          label="Districts"
          value={districtCount}
          color="#6366F1"
          icon={<MapIcon />}
        />
      </Box>

      {/* TOOLBAR */}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
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
            ? `Showing ${locations.length} of ${total} locations`
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
        rows={locations}
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

      {/* DIALOGS */}

      {formOpen && (
        <LocationFormDialog
          open={formOpen}
          onClose={() => {
            setFormOpen(false)
            setEditing(null)
          }}
          editing={editing}
          onSaved={() => {
            setFormOpen(false)

            setEditing(null)

            qc.invalidateQueries({
              queryKey: ['locations'],
            })
          }}
        />
      )}

      <ViewDialog
        locId={viewId}
        onClose={() =>
          setViewId(null)
        }
      />
    </Box>
  )
}

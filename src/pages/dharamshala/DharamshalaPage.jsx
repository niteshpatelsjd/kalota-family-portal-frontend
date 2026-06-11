import { useState } from 'react'
import { useQuery,useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import CloseIcon from '@mui/icons-material/Close'

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Avatar,
  Chip,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import HomeWorkIcon from '@mui/icons-material/HomeWork'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import BlockIcon from '@mui/icons-material/Block'
import LanguageIcon from '@mui/icons-material/Language'
import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import PhoneIcon from '@mui/icons-material/Phone'
import DeleteIcon from '@mui/icons-material/Delete'

import api from '../../api/axiosInstance'

import DataTable from '../../components/common/DataTable'

/* ───────────────── API ───────────────── */

const getDharamshala = (params) =>
  api
    .get(
      '/admin/dharamshala/getAllDharamshala',
      {
        params,
      }
    )
    .then(
      (r) => r.data.responseBody
    )

const getVillages = () =>
  api
    .get(
      '/admin/village/getAllVillage',
      {
        params: {
          pageIndex: 0,
          pageSize: 100,
          status: 1,
        },
      }
    )
    .then(
      (r) => r.data.responseBody
    )

/* ───────────────── FILTER STYLE ───────────────── */

const filterStyle = {
  minWidth: 190,

  '& .MuiOutlinedInput-root': {
    bgcolor: '#FFF',

    '& fieldset': {
      borderColor: '#E7D4C7',
    },

    '&:hover fieldset': {
      borderColor: '#444',
    },

    '&.Mui-focused fieldset': {
      borderColor: '#E31E24',
    },

    // FIX SELECT TEXT COLOR
    '& .MuiSelect-select': {
      color: '#1E1E1E !important',
    },

    '& input': {
      color: '#1E1E1E !important',
    },
  },

  '& .MuiInputLabel-root': {
    color: '#9C7A3B',
    fontSize: 13,
  },

  '& .MuiInputBase-input': {
    color: '#1E1E1E !important',
    fontSize: 13,
  },
}

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

        backdropFilter:
          'blur(14px)',

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

/* ───────────────── PAGE ───────────────── */
const blockUnblockDharamshala = async (
  id,
  status
) => {
  return api.post(
    '/admin/dharamshala/blockUnblock',
    {
      id,
      status,
    }
  )
}


const dharamshalaSchema =
  yup.object({
    name: yup
      .string()
      .required('Name is required'),

    villageId: yup
      .string()
      .required('Village is required'),

    mobileNumber: yup
      .string()
      .required(
        'Mobile Number is required'
      ),

    email: yup
      .string()
      .email('Invalid email'),

    establishedYear:
      yup.number().nullable(),
  })

  function DharamshalaFormDialog({
  open,
  onClose,
  editing,
  villages,
  onSaved,
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(
      dharamshalaSchema
    ),

    defaultValues: editing
      ? {
          ...editing,
        }
      : {
          villageId: '',
        },
  })
const onSubmit = async (values) => {
  try {
    console.log('Form Values:', values)

    const fd = new FormData()

    // Append id only once
    if (editing?.id) {
      fd.append('id', editing.id)
    }

    Object.entries(values).forEach(([key, value]) => {
      // Skip fields that should not be sent
      if (
        key === 'id' ||
        key === 'createdAt' ||
        key === 'updatedAt' ||
        key === 'villageName' ||
        key === 'status'
      ) {
        return
      }

      if (
        value !== undefined &&
        value !== null &&
        value !== ''
      ) {
        fd.append(key, value)
      }
    })

    console.log('----- FormData -----')

    for (const pair of fd.entries()) {
      console.log(pair[0], pair[1])
    }

    const response = await api.post(
      '/admin/dharamshala/addDharamshala',
      fd
    )

    console.log(response.data)

    toast.success(
      editing
        ? 'Dharamshala Updated'
        : 'Dharamshala Created'
    )

    onSaved()
  } catch (error) {
    console.error(error)

    toast.error(
      error.response?.data?.message ||
      'Failed to save'
    )
  }

}




  return (
<Dialog
  open={open}
  onClose={onClose}
  maxWidth="md"
  fullWidth
  PaperProps={{
    sx: {
      bgcolor: '#FFFDF8',
      borderRadius: 4,
      border: '1px solid rgba(122,30,30,0.12)',
    },
  }}
>
<DialogTitle
  sx={{
    bgcolor: '#FFF7F0',
    color: '#7A1E1E',
    fontWeight: 700,
    borderBottom:
      '1px solid rgba(122,30,30,0.10)',
  }}
>
        {editing
          ? 'Edit Dharamshala'
          : 'Add Dharamshala'}

        <IconButton
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

<DialogContent
  sx={{
    bgcolor: '#FFFFFF',
    pt: 3,
  }}
>
        <Box
          component="form"
          id="dharamshala-form"
          onSubmit={handleSubmit(
            onSubmit
          )}
          sx={{
            display: 'flex',
            flexDirection:
              'column',
            gap: 2,
            mt: 1,
          }}
        >
          <TextField
            label="Name"
            sx={fieldStyle}
            {...register('name')}
            error={
              !!errors.name
            }
            helperText={
              errors.name
                ?.message
            }
          />


<Controller
  name="villageId"
  control={control}
  defaultValue=""
  render={({ field }) => {
    console.log('Village Value:', field.value)

    return (
      <TextField
        select
        fullWidth
        label="Village"
        value={field.value ?? ''}
        onChange={(e) => {
          console.log(
            'Selected Village:',
            e.target.value
          )

          field.onChange(e.target.value)
        }}
        error={!!errors.villageId}
        helperText={errors.villageId?.message}
        sx={fieldStyle}
      >
{villages.map((v) => {
  console.log('Village Item:', v)

  return (
    <MenuItem
      key={v.id}
      value={v.id}
    >
      {v.name}
    </MenuItem>
  )
})}
      </TextField>
    )
  }}
/>

          <TextField
            label="Mobile Number"
            sx={fieldStyle}
            {...register(
              'mobileNumber'
            )}
            error={
              !!errors.mobileNumber
            }
            helperText={
              errors
                .mobileNumber
                ?.message
            }
          />

          <TextField
            label="Email"
            sx={fieldStyle}
            {...register(
              'email'
            )}
            error={
              !!errors.email
            }
            helperText={
              errors.email
                ?.message
            }
          />

          <TextField
            label="Website"
            sx={fieldStyle}
            {...register(
              'website'
            )}
          />

          <TextField
            label="Address"
            sx={fieldStyle}
            {...register(
              'address'
            )}
          />

          <TextField
            label="Description"
            sx={fieldStyle}
            multiline
            rows={4}
            {...register(
              'description'
            )}
          />

          <TextField
            label="Established Year"
            sx={fieldStyle}
            {...register(
              'establishedYear'
            )}
          />

          
        </Box>
      </DialogContent>

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
    onClick={onClose}
    sx={{
      color: '#8A6D3B',
    }}
  >
    Cancel
  </Button>

  <Button
    type="submit"
    form="dharamshala-form"
    variant="contained"
    sx={{
      bgcolor: '#7A1E1E',

      '&:hover': {
        bgcolor: '#651818',
      },
    }}
  >
    {editing ? 'Update' : 'Create'}
  </Button>
</DialogActions>
    </Dialog>
  )
}
export default function DharamshalaPage() {


const navigate = useNavigate()
const qc = useQueryClient()

const statusMutation = useMutation({
  mutationFn: ({
    id,
    status,
  }) =>
    blockUnblockDharamshala(
      id,
      status
    ),

  onSuccess: (_, variables) => {
    toast.success(
      variables.status === 0
        ? 'Dharamshala Deleted'
        : variables.status === 1
        ? 'Dharamshala Activated'
        : 'Dharamshala Inactivated'
    )

    qc.invalidateQueries({
      queryKey: ['dharamshala'],
    })
  },

  onError: (error) => {
    toast.error(
      error.response?.data
        ?.message ||
        'Operation failed'
    )
  },
})
const [deleteDialog, setDeleteDialog] =
  useState({
    open: false,
    row: null,
  })
const [formOpen, setFormOpen] = useState(false)
const [editing, setEditing] = useState(null)
const [viewId, setViewId] = useState(null)
  const [page, setPage] =
    useState(0)

  const [
    pageSize,
    setPageSize,
  ] = useState(10)

  const [search, setSearch] =
    useState('')

  const [
    selectedVillage,
    setSelectedVillage,
  ] = useState('')

  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState('')

  /* ───────────────── DHARAMSHALA DATA ───────────────── */

  const {
    data,
    isFetching,
  } = useQuery({
    queryKey: [
      'dharamshala',
      page,
      pageSize,
      search,
      selectedVillage,
      selectedStatus,
    ],

    queryFn: () =>
      getDharamshala({
        pageIndex: page,

        pageSize,

        searchText:
          search || undefined,

        villageId:
          selectedVillage ||
          undefined,

        status:
          selectedStatus || undefined,
      }),
  })

  const {
    data: villageData,
  } = useQuery({
    queryKey: ['villages'],
    queryFn: getVillages,
  })

  const villages =
    villageData?.content ?? []
console.log('Villages Data:', villages)
  const dharamshala =
    data?.content ?? []

  const total =
    data?.totalRecords || 0

  const totalDharamshala =
    data?.totalRecords || 0

  const activeCount =
    data?.totalActive || 0

  const inactiveCount =
    data?.totalInactive || 0

  /* ───────────────── TABLE COLUMNS ───────────────── */

  const schema = yup.object({
  name: yup
    .string()
    .required('Name is required'),

  villageId: yup
    .string()
    .required('Village is required'),

  mobileNumber: yup
    .string()
    .required('Mobile number is required'),

  email: yup
    .string()
    .email('Invalid email'),

  establishedYear: yup
    .number()
    .typeError('Enter valid year'),
})
  const columns = [
    {
      key: 'name',

      label: 'Dharamshala',

      render: (r) => (
        <Typography
          fontSize={13}
          fontWeight={700}
          color="#7A1E1E"
        >
          {r.name}
        </Typography>
      ),
    },

    {
      key: 'description',

      label: 'Description',

      render: (r) => (
        <Typography
          fontSize={12}
          sx={{
            maxWidth: 220,
          }}
        >
          {r.description ||
            '-'}
        </Typography>
      ),
    },

    {
      key: 'village',

      label: 'Village',

      render: (r) => (
        <Chip
          label={
            r.villageName
          }
          size="small"
          sx={{
            bgcolor:
              'rgba(227,30,36,0.10)',

            color: '#E31E24',

            fontWeight: 600,

            fontSize: 11,
          }}
        />
      ),
    },

    {
      key: 'address',

      label: 'Address',

      render: (r) => (
        <Typography
          fontSize={12}
        >
          {r.address || '-'}
        </Typography>
      ),
    },

    {
      key: 'mobileNumber',

      label: 'Contact',

      render: (r) => (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
        >
          <PhoneIcon
            sx={{
              fontSize: 16,
              color: '#7A1E1E',
            }}
          />

          <Typography
            fontSize={12}
          >
            {r.mobileNumber}
          </Typography>
        </Stack>
      ),
    },

    {
      key: 'website',

      label: 'Website',

      render: (r) =>
        r.website ? (
          <Button
            size="small"
            startIcon={
              <LanguageIcon />
            }
            href={r.website}
            target="_blank"
            sx={{
              textTransform:
                'none',

              fontSize: 11,

              color: '#1976d2',
            }}
          >
            Visit
          </Button>
        ) : (
          '-'
        ),
    },

    {
      key: 'year',

      label: 'Established',

      render: (r) => (
        <Typography
          fontSize={12}
        >
          {r.establishedYear}
        </Typography>
      ),
    },

    {
  key: 'createdAt',

  label: 'Created',

  render: (r) => (
    <Typography
      fontSize={12}
      color="#6B7280"
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
      fontSize={12}
      color="#7A1E1E"
    >
      {r.updatedAt}
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
<Tooltip title="View">
  <IconButton
    size="small"
    color="primary"
    onClick={() =>
      navigate(
        `/dharamshala/details/${r.id}`
      )
    }
  >
    <VisibilityIcon />
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
                color: '#E31E24',
                bgcolor:
                'rgba(227,30,36,0.08)',

                '&:hover': {
                bgcolor:
                    'rgba(227,30,36,0.18)',
                },
            }}
            >
            <EditIcon
                sx={{ fontSize: 18 }}
            />
            </IconButton>
          </Tooltip>

<Tooltip
  title={
    r.status === 1
      ? 'Deactivate'
      : 'Activate'
  }
>
  <IconButton
    size="small"
    onClick={() =>
      statusMutation.mutate({
        id: r.id,
        status:
          r.status === 1
            ? 2
            : 1,
      })
    }
    sx={{
      color:
        r.status === 1
          ? '#f59e0b'
          : '#22c55e',

      bgcolor:
        r.status === 1
          ? 'rgba(245,158,11,0.08)'
          : 'rgba(34,197,94,0.08)',

      '&:hover': {
        bgcolor:
          r.status === 1
            ? 'rgba(245,158,11,0.18)'
            : 'rgba(34,197,94,0.18)',
      },
    }}
  >
    {r.status === 1 ? (
      <BlockIcon
        sx={{ fontSize: 18 }}
      />
    ) : (
      <CheckCircleIcon
        sx={{ fontSize: 18 }}
      />
    )}
  </IconButton>
</Tooltip>

<Tooltip title="Delete">
  <IconButton
    size="small"
    onClick={() =>
      setDeleteDialog({
        open: true,
        row: r,
      })
    }
    sx={{
      color: '#ef4444',
      bgcolor:
        'rgba(239,68,68,0.08)',

      '&:hover': {
        bgcolor:
          'rgba(239,68,68,0.18)',
      },
    }}
  >
    <DeleteIcon sx={{ fontSize: 18 }} />
  </IconButton>
</Tooltip>
        </Stack>
      ),
    },
  ]


  /* ───────────────── MAIN PAGE ───────────────── */

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
          Dharamshala Management
        </Typography>
<Button
  variant="contained"
  startIcon={<AddIcon />}
  onClick={() => {
    setEditing(null)
    setFormOpen(true)
  }}
  sx={{
    bgcolor: '#7C3AED',
    borderRadius: 3,
    textTransform: 'none',
    px: 3,
    boxShadow:
      '0 8px 20px rgba(124,58,237,0.25)',

    '&:hover': {
      bgcolor: '#6D28D9',
    },
  }}
>
  Add Dharamshala
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
          label="Total Dharamshala"
          value={
            totalDharamshala
          }
          color="#E31E24"
          icon={<HomeWorkIcon />}
        />

        <StatCard
          label="Active"
          value={activeCount}
          color="#22C55E"
          icon={
            <CheckCircleIcon />
          }
        />

        <StatCard
          label="Inactive"
          value={inactiveCount}
          color="#F59E0B"
          icon={<BlockIcon />}
        />
      </Box>

      {/* FILTERS */}

      <Box
        sx={{
          display: 'flex',
          justifyContent:
            'space-between',
          alignItems: 'center',
          gap: 2,
          mb: 2,
          flexWrap: 'wrap',
        }}
      >
        <Typography
          sx={{
            fontSize: 12,
            color: '#A1887F',
          }}
        >
          {total > 0
            ? `Showing ${dharamshala.length} of ${total} dharamshala`
            : ''}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <TextField
  select
  label="Village"
  size="small"
  value={selectedVillage}
  onChange={(e) => {
    setSelectedVillage(e.target.value)
    setPage(0)
  }}
  sx={filterStyle}
  SelectProps={{
    sx: {
      color: '#1E1E1E !important',
      bgcolor: '#FFF',
    },
  }}
>
  <MenuItem value="">
    All Villages
  </MenuItem>

{villages.map((v) => {
  console.log('Village Item:', v)

  return (
    <MenuItem
      key={v.id}
      value={v.id}
    >
      {v.name}
    </MenuItem>
  )
})}
</TextField>
                

          <TextField
            select
            label="Status"
            sx={fieldStyle}
            size="small"
            value={
              selectedStatus
            }
            onChange={(e) => {
              setSelectedStatus(
                e.target.value
              )

              setPage(0)
            }}
            sx={filterStyle}
          >
            <MenuItem value="">
              All Status
            </MenuItem>

            <MenuItem value={1}>
              Active
            </MenuItem>

            <MenuItem value={0}>
              Inactive
            </MenuItem>
          </TextField>

          <TextField
            size="small"
            sx={fieldStyle}
            placeholder="Search dharamshala..."
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
                      color:
                        '#A1887F',
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              ...filterStyle,
              width: 220,
            }}
          />
        </Box>
      </Box>

      {/* TABLE */}

      <DataTable
        columns={columns}
        rows={dharamshala}
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(
          s
        ) => {
          setPageSize(s)
          setPage(0)
        }}
        loading={isFetching}
      />

      {formOpen && (
  <DharamshalaFormDialog
    open={formOpen}
    editing={editing}
    villages={villages}
    onClose={() => {
      setFormOpen(false)
      setEditing(null)
    }}
    onSaved={() => {
      setFormOpen(false)
      setEditing(null)

      qc.invalidateQueries({
        queryKey: ['dharamshala'],
      })
    }}
  />
)}

<Dialog
  open={deleteDialog.open}
  onClose={() =>
    setDeleteDialog({
      open: false,
      row: null,
    })
  }
  maxWidth="xs"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 4,
      bgcolor: '#FFFDF8',
      border:
        '1px solid rgba(122,30,30,0.12)',
      overflow: 'hidden',
    },
  }}
>
  {/* Header */}

  <Box
    sx={{
      bgcolor: '#FFF7F0',
      px: 3,
      py: 2,
      borderBottom:
        '1px solid rgba(122,30,30,0.08)',
      display: 'flex',
      alignItems: 'center',
      gap: 2,
    }}
  >



  </Box>

  {/* Content */}

  <DialogContent
    sx={{
      py: 3,
      px: 3,
      bgcolor: '#FFFDF8',
    }}
  >
    <Typography
      sx={{
        color: '#4B5563',
        lineHeight: 1.7,
        fontSize: 14,
      }}
    >
      Are you sure you want to permanently
      delete
      <Typography
        component="span"
        sx={{
          fontWeight: 700,
          color: '#7A1E1E',
          mx: 0.5,
        }}
      >
        {deleteDialog.row?.name}
      </Typography>
      ?
    </Typography>

    <Box
      sx={{
        mt: 2,
        p: 2,
        borderRadius: 2,
        bgcolor:
          'rgba(227,30,36,0.05)',
        border:
          '1px solid rgba(227,30,36,0.10)',
      }}
    >
      <Typography
        sx={{
          color: '#E31E24',
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        Once deleted, this Dharamshala
        will no longer appear in the
        system.
      </Typography>
    </Box>
  </DialogContent>

  {/* Actions */}

  <DialogActions
    sx={{
      px: 3,
      py: 2,
      bgcolor: '#FFF7F0',
      borderTop:
        '1px solid rgba(122,30,30,0.08)',
    }}
  >
    <Button
      onClick={() =>
        setDeleteDialog({
          open: false,
          row: null,
        })
      }
      sx={{
        color: '#8A6D3B',
        fontWeight: 600,
      }}
    >
      Cancel
    </Button>

      <Button
        variant="contained"
        onClick={() => {
            statusMutation.mutate({
            id: deleteDialog.row.id,
            status: 0,
            })

            setDeleteDialog({
            open: false,
            row: null,
            })
        }}
        sx={{
            bgcolor: '#E31E24',

            '&:hover': {
            bgcolor: '#C71C22',
            },
        }}
        >
        Delete
        </Button>
  </DialogActions>
</Dialog>
    </Box>

    
  )

  
}
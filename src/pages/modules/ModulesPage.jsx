import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Box, Button, Typography,TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Tooltip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import api from '../../api/axiosInstance'
import DataTable from '../../components/common/DataTable'

const fetchModules = ({ pageIndex, pageSize, searchText }) =>
  api.get('/admin/module/getAllModule', { params: { pageIndex, pageSize, searchText } }).then((r) => r.data)

export default function ModulesPage() {
  const qc = useQueryClient()
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)

const { data, isFetching } =
  useQuery({
    queryKey: [
      'modules',
      page,
      pageSize,
      search,
    ],
    queryFn: () =>
      fetchModules({
        pageIndex: page,
        pageSize,
        searchText: search,
      }),
  })

const modules =
  data?.responseBody?.content ??
  []

const total =
  data?.responseBody
    ?.totalElements ?? 0


  const { register, handleSubmit, reset } = useForm()

  const saveMutation = useMutation({
    mutationFn: (body) => api.post('/admin/module/addModule', body),
onSuccess: () => {
  qc.invalidateQueries({
    queryKey: ['modules'],
  })

  qc.invalidateQueries({
    queryKey: ['modules-all'],
  })

  setOpen(false)

  toast.success('Module saved')
},
    onError: (e) => toast.error(e.response?.data?.message || 'Error saving module'),
  })

  const openAdd = () => { setEditing(null); reset({ moduleName: '', moduleCode: '', parentModuleName: '' }); setOpen(true) }
  const openEdit = (mod) => { setEditing(mod); reset({ moduleName: mod.moduleName, moduleCode: mod.moduleCode, parentModuleName: mod.parentModuleName }); setOpen(true) }

  const onSubmit = (values) => {
    const body = { ...values }
    if (editing) body.id = editing.id
    saveMutation.mutate(body)
  }

  const columns = [
    { key: 'moduleName', label: 'Module Name' },
    { key: 'moduleCode', label: 'Module Code' },
    { key: 'parentModuleName', label: 'Parent Module' },
    {
  key: 'actions',
  label: 'Actions',
  render: (r) => (
    <Tooltip title="Edit">
      <IconButton
        size="small"
        onClick={() => openEdit(r)}
        sx={{
          color: '#1976d2',
        }}
      >
        <EditIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  ),
},
  ]

  return (
    <Box>
<Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    Module Management
  </Typography>

  <Button
    variant="contained"
    startIcon={<AddIcon />}
    onClick={openAdd}
    sx={{
      bgcolor: '#7C3AED',
      borderRadius: 3,
      textTransform: 'none',
      px: 3,
      height: 42,

      boxShadow:
        '0 8px 20px rgba(124,58,237,0.25)',

      '&:hover': {
        bgcolor: '#6D28D9',
      },
    }}
  >
    Add Module
  </Button>
</Box>
      <DataTable columns={columns} rows={modules} total={total} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(0) }} loading={isFetching} />

<Dialog
  open={open}
  onClose={() => setOpen(false)}
  maxWidth="sm"
  fullWidth
  sx={{
    '& .MuiPaper-root': {
      background: '#FFF !important',
      color: '#1E1E1E !important',
      borderRadius: '16px',
    },

    '& .MuiDialogTitle-root': {
      color: '#1E1E1E !important',
      fontWeight: 700,
    },

    '& .MuiDialogContent-root': {
      background: '#FFF !important',
    },

    '& .MuiDialogActions-root': {
      background: '#FFF !important',
    },

    '& .MuiInputBase-root': {
      background: '#FFF !important',
      color: '#1E1E1E !important',
    },

    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#D9D9D9 !important',
    },

    '& .MuiInputLabel-root': {
      color: '#666 !important',
    },

    '& .MuiInputLabel-root.Mui-focused': {
      color: '#C62828 !important',
    },
  }}
>
  <DialogTitle>
    {editing
      ? 'Edit Module'
      : 'Add Module'}
  </DialogTitle>
<DialogContent sx={{ pt: 2 }}>
  <Box
    component="form"
    id="module-form"
    onSubmit={handleSubmit(onSubmit)}
    sx={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 2.5,
      mt: 1,
    }}
  >
    <TextField
      label="Module Name"
      {...register('moduleName')}
      fullWidth
      size="medium"
      sx={{
        '& .MuiOutlinedInput-root': {
          height: 56,
          borderRadius: 2,
        },
      }}
    />

    <TextField
      label="Module Code"
      {...register('moduleCode')}
      fullWidth
      size="medium"
      sx={{
        '& .MuiOutlinedInput-root': {
          height: 56,
          borderRadius: 2,
        },
      }}
    />

    <TextField
      label="Parent Module Name"
      {...register('parentModuleName')}
      fullWidth
      size="medium"
      sx={{
        '& .MuiOutlinedInput-root': {
          height: 56,
          borderRadius: 2,
        },
      }}
    />
  </Box>
</DialogContent>

  <DialogActions sx={{ p: 3 }}>
    <Button
      onClick={() => setOpen(false)}
      sx={{
        color: '#666',
      }}
    >
      Cancel
    </Button>

    <Button
      type="submit"
      form="module-form"
      variant="contained"
    >
      Save
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  )
}

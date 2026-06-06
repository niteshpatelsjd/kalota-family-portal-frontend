import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Tooltip } from '@mui/material'
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

  const { data, isFetching } = useQuery({
    queryKey: ['modules', page, pageSize, search],
    queryFn: () => fetchModules({ pageIndex: page, pageSize, searchText: search }),
  })

  const modules = data?.data?.list ?? data?.data ?? []
  const total = data?.data?.totalCount ?? 0

  const { register, handleSubmit, reset } = useForm()

  const saveMutation = useMutation({
    mutationFn: (body) => api.post('/admin/module/addModule', body),
    onSuccess: () => { qc.invalidateQueries(['modules']); qc.invalidateQueries(['modules-all']); setOpen(false); toast.success('Module saved') },
    onError: (e) => toast.error(e.response?.data?.message || 'Error saving module'),
  })

  const openAdd = () => { setEditing(null); reset({ moduleName: '', moduleCode: '', parentModuleName: '' }); setOpen(true) }
  const openEdit = (mod) => { setEditing(mod); reset({ moduleName: mod.moduleName, moduleCode: mod.moduleCode, parentModuleName: mod.parentModuleName }); setOpen(true) }

  const onSubmit = (values) => {
    const body = { ...values }
    if (editing) body.id = editing._id
    saveMutation.mutate(body)
  }

  const columns = [
    { key: 'moduleName', label: 'Module Name' },
    { key: 'moduleCode', label: 'Module Code' },
    { key: 'parentModuleName', label: 'Parent Module' },
    {
      key: 'actions', label: 'Actions', render: (r) => (
        <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(r)}><EditIcon fontSize="small" /></IconButton></Tooltip>
      ),
    },
  ]

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField size="small" placeholder="Search modules..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0) }} sx={{ width: 280 }} />
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>Add Module</Button>
      </Box>

      <DataTable columns={columns} rows={modules} total={total} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(0) }} loading={isFetching} />

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editing ? 'Edit Module' : 'Add Module'}</DialogTitle>
        <DialogContent>
          <Box component="form" id="module-form" onSubmit={handleSubmit(onSubmit)} display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField label="Module Name" {...register('moduleName')} fullWidth required />
            <TextField label="Module Code" {...register('moduleCode')} fullWidth required />
            <TextField label="Parent Module Name" {...register('parentModuleName')} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" form="module-form" variant="contained" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

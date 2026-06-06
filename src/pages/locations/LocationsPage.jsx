import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Chip, IconButton, Tooltip, Typography, Divider, Stack, Card, CardContent,
  InputAdornment, MenuItem,
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
import { useForm, Controller, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import api from '../../api/axiosInstance'
import DataTable from '../../components/common/DataTable'

// ─── API helpers ─────────────────────────────────────────────────────────────
const getLocations = (params) =>
  api.get('/admin/location/getAllLocations', { params }).then((r) => r.data.responseBody)

const getLocationById = (id) =>
  api.get(`/admin/location/getById/${id}`).then((r) => r.data.responseBody)

const getDistricts = () =>
  api.get('/admin/location/getDistricts').then((r) => r.data.responseBody ?? [])

const getTehsils = (district) =>
  api.get('/admin/location/getTehsils', { params: { district } }).then((r) => r.data.responseBody ?? [])

const getVillages = (district, tehsil) =>
  api.get('/admin/location/getVillages', { params: { district, tehsil } }).then((r) => r.data.responseBody ?? [])

// ─── Schema ───────────────────────────────────────────────────────────────────
const schema = yup.object({
  district: yup.string().required('District is required'),
  tehsil: yup.string().required('Tehsil is required'),
  village: yup.string().required('Village is required'),
  latitude: yup.number().nullable().transform((v) => (isNaN(v) ? null : v)),
  longitude: yup.number().nullable().transform((v) => (isNaN(v) ? null : v)),
})

const inputSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: '#0D0D0D',
    '& fieldset': { borderColor: '#2A2A2A' },
    '&:hover fieldset': { borderColor: '#444' },
    '&.Mui-focused fieldset': { borderColor: '#E31E24' },
  },
  '& .MuiInputLabel-root': { color: '#666', fontSize: 13 },
  '& .MuiInputLabel-root.Mui-focused': { color: '#E31E24' },
  '& .MuiInputBase-input': { color: '#fff', fontSize: 13, padding: '10px 14px' },
  '& .MuiFormHelperText-root': { fontSize: 11 },
  '& .MuiSelect-select': { padding: '10px 14px', fontSize: 13, color: '#fff' },
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }) {
  return (
    <Card sx={{ flex: 1, bgcolor: '#111111', border: '1px solid #2A2A2A' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '16px !important' }}>
        <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </Box>
        <Box>
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{value ?? '—'}</Typography>
          <Typography sx={{ fontSize: 12, color: '#888', mt: 0.3 }}>{label}</Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

// ─── View Dialog ──────────────────────────────────────────────────────────────
function ViewDialog({ locId, onClose }) {
  const { data, isLoading } = useQuery({
    queryKey: ['location-detail', locId],
    queryFn: () => getLocationById(locId),
    enabled: !!locId,
  })

  const InfoRow = ({ label, value }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.2, borderBottom: '1px solid #1A1A1A', '&:last-child': { borderBottom: 0 } }}>
      <Typography sx={{ fontSize: 12, color: '#555' }}>{label}</Typography>
      <Typography sx={{ fontSize: 12, color: '#ddd', fontWeight: 500 }}>{value || '—'}</Typography>
    </Box>
  )

  return (
    <Dialog open={!!locId} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { bgcolor: '#111111', border: '1px solid #2A2A2A', overflow: 'hidden' } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2, borderBottom: '1px solid #2A2A2A' }}>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Location Details</Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: '#666', '&:hover': { color: '#fff' } }}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <Typography fontSize={13} color="#555">Loading...</Typography>
          </Box>
        ) : data && (
          <Box>
            {/* Banner */}
            <Box sx={{ bgcolor: '#1A1A1A', px: 3, py: 3, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid #2A2A2A' }}>
              <Box sx={{ width: 52, height: 52, borderRadius: 2, bgcolor: 'rgba(227,30,36,0.15)', border: '2px solid rgba(227,30,36,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <LocationOnIcon sx={{ fontSize: 24, color: '#E31E24' }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{data.village}</Typography>
                <Typography sx={{ fontSize: 12, color: '#888', mt: 0.3 }}>{data.tehsil}, {data.district}</Typography>
                <Chip label={data.status === 1 ? 'Active' : 'Inactive'} size="small"
                  sx={{ mt: 0.8, height: 20, fontSize: 11, fontWeight: 600, bgcolor: data.status === 1 ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: data.status === 1 ? '#22c55e' : '#ef4444', border: 'none' }} />
              </Box>
            </Box>

            <Box sx={{ px: 3, pt: 2.5, pb: 3 }}>
              <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#E31E24', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1 }}>Location Info</Typography>
              <Box sx={{ bgcolor: '#0D0D0D', border: '1px solid #1E1E1E', borderRadius: 1.5, px: 2, mb: 2.5 }}>
                <InfoRow label="District" value={data.district} />
                <InfoRow label="Tehsil" value={data.tehsil} />
                <InfoRow label="Village" value={data.village} />
              </Box>

              <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#E31E24', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1 }}>Coordinates</Typography>
              <Box sx={{ bgcolor: '#0D0D0D', border: '1px solid #1E1E1E', borderRadius: 1.5, px: 2, mb: 2.5 }}>
                <InfoRow label="Latitude" value={data.latitude} />
                <InfoRow label="Longitude" value={data.longitude} />
              </Box>

              <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#E31E24', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1 }}>Activity</Typography>
              <Box sx={{ bgcolor: '#0D0D0D', border: '1px solid #1E1E1E', borderRadius: 1.5, px: 2 }}>
                <InfoRow label="Created At" value={data.createdAt} />
                <InfoRow label="Updated At" value={data.updatedAt} />
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ─── Add/Edit Dialog ──────────────────────────────────────────────────────────
function LocationFormDialog({ open, onClose, editing, onSaved }) {
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: editing
      ? { district: editing.district, tehsil: editing.tehsil, village: editing.village, latitude: editing.latitude, longitude: editing.longitude }
      : {},
  })

  const selectedDistrict = useWatch({ control, name: 'district' })
  const selectedTehsil = useWatch({ control, name: 'tehsil' })

  const { data: districts = [] } = useQuery({ queryKey: ['districts'], queryFn: getDistricts })
  const { data: tehsils = [] } = useQuery({ queryKey: ['tehsils', selectedDistrict], queryFn: () => getTehsils(selectedDistrict), enabled: !!selectedDistrict })
  const { data: villages = [] } = useQuery({ queryKey: ['villages', selectedDistrict, selectedTehsil], queryFn: () => getVillages(selectedDistrict, selectedTehsil), enabled: !!selectedDistrict && !!selectedTehsil })

  const onSubmit = async (values) => {
    try {
      const body = { ...values }
      if (editing) body.id = editing.id
      else body.id = ''
      await api.post('/admin/location/addLocation', body)
      toast.success(editing ? 'Location updated' : 'Location added')
      onSaved()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save location')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { bgcolor: '#111111', border: '1px solid #2A2A2A' } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5, px: 3 }}>
        <Typography fontWeight={700} fontSize={15} color="#fff">{editing ? 'Edit Location' : 'Add New Location'}</Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: '#666' }}><CloseIcon sx={{ fontSize: 18 }} /></IconButton>
      </DialogTitle>
      <Divider sx={{ borderColor: '#2A2A2A' }} />

      <DialogContent sx={{ px: 3, py: 2.5 }}>
        <Box component="form" id="loc-form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

          {/* District */}
          <Controller name="district" control={control} render={({ field }) => (
            <TextField select label="District" {...field} value={field.value ?? ''} size="small" fullWidth
              error={!!errors.district} helperText={errors.district?.message} sx={inputSx}>
              {districts.map((d) => <MenuItem key={d} value={d} sx={{ fontSize: 13 }}>{d}</MenuItem>)}
            </TextField>
          )} />

          {/* Tehsil */}
          <Controller name="tehsil" control={control} render={({ field }) => (
            <TextField select label="Tehsil" {...field} value={field.value ?? ''} size="small" fullWidth
              error={!!errors.tehsil} helperText={errors.tehsil?.message} disabled={!selectedDistrict} sx={inputSx}>
              {tehsils.map((t) => <MenuItem key={t} value={t} sx={{ fontSize: 13 }}>{t}</MenuItem>)}
            </TextField>
          )} />

          {/* Village — free text input (API returns existing villages but we allow custom entry) */}
          <TextField label="Village" {...register('village')} size="small" fullWidth
            error={!!errors.village} helperText={errors.village?.message} sx={inputSx} />

          {/* Coordinates */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField label="Latitude" type="number" {...register('latitude')} size="small" fullWidth sx={inputSx} />
            <TextField label="Longitude" type="number" {...register('longitude')} size="small" fullWidth sx={inputSx} />
          </Box>

        </Box>
      </DialogContent>

      <Divider sx={{ borderColor: '#2A2A2A' }} />
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={onClose} sx={{ color: '#666', fontSize: 13 }}>Cancel</Button>
        <Button type="submit" form="loc-form" variant="contained" disabled={isSubmitting}
          sx={{ bgcolor: '#E31E24', '&:hover': { bgcolor: '#c41920' }, fontSize: 13, fontWeight: 600, px: 3 }}>
          {isSubmitting ? 'Saving...' : editing ? 'Update' : 'Add Location'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({ open, location, onClose, onConfirm, loading }) {
  if (!location) return null
  const isActive = location.status === 1
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { bgcolor: '#111111', border: '1px solid #2A2A2A' } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography fontWeight={700} fontSize={16}>{isActive ? 'Block Location' : 'Activate Location'}</Typography>
      </DialogTitle>
      <Divider sx={{ borderColor: '#2A2A2A' }} />
      <DialogContent sx={{ pt: 2 }}>
        <Typography fontSize={13} color="#ccc">
          Are you sure you want to <strong style={{ color: isActive ? '#ef4444' : '#22c55e' }}>{isActive ? 'block' : 'activate'}</strong> <strong style={{ color: '#fff' }}>{location.village}</strong>?
        </Typography>
      </DialogContent>
      <Divider sx={{ borderColor: '#2A2A2A' }} />
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} sx={{ color: '#888', fontSize: 13 }}>Cancel</Button>
        <Button variant="contained" disabled={loading} onClick={onConfirm}
          sx={{ bgcolor: isActive ? '#ef4444' : '#22c55e', '&:hover': { bgcolor: isActive ? '#dc2626' : '#16a34a' }, fontSize: 13, fontWeight: 600, px: 3 }}>
          {loading ? 'Please wait...' : isActive ? 'Block' : 'Activate'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LocationsPage() {
  const [districtFilter, setDistrictFilter] = useState('')
  const [tehsilFilter, setTehsilFilter] = useState('')
  const [villageFilter, setVillageFilter] = useState('')
  const { data: districtOptions = [] } = useQuery({
  queryKey: ['districts-filter'],
  queryFn: getDistricts,
})

const { data: tehsilOptions = [] } = useQuery({
  queryKey: ['tehsils-filter', districtFilter],
  queryFn: () => getTehsils(districtFilter),
  enabled: !!districtFilter,
})

const { data: villageOptions = [] } = useQuery({
  queryKey: ['villages-filter', districtFilter, tehsilFilter],
  queryFn: () => getVillages(districtFilter, tehsilFilter),
  enabled: !!districtFilter && !!tehsilFilter,
})
  const qc = useQueryClient()
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewId, setViewId] = useState(null)
  const [confirmLoc, setConfirmLoc] = useState(null)

  const { data, isFetching } = useQuery({
    queryKey: ['locations', page, pageSize, search],
    queryFn: () => getLocations({ pageIndex: page, pageSize, searchText: search || undefined }),
  })

  const locations = data?.content ?? []
  const total = data?.totalRecords ?? 0
  const filteredLocations = locations.filter((row) => {
  const districtMatch =
    !districtFilter || row.district === districtFilter

  const tehsilMatch =
    !tehsilFilter || row.tehsil === tehsilFilter

  const villageMatch =
    !villageFilter || row.village === villageFilter

  return districtMatch && tehsilMatch && villageMatch
})
  const totalActive = locations.filter((l) => l.status === 1).length
  const totalInactive = locations.filter((l) => l.status !== 1).length

  const blockMutation = useMutation({
    mutationFn: ({ id, status }) => api.post('/admin/location/blockUnblock', { id, status }),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['locations'] })
      toast.success(vars.status === 1 ? 'Location activated' : 'Location blocked')
      setConfirmLoc(null)
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to update status'),
  })

  const columns = [
    {
      key: 'district', label: 'District',
      render: (r) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: 'rgba(227,30,36,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <LocationOnIcon sx={{ fontSize: 14, color: '#E31E24' }} />
          </Box>
          <Typography fontSize={11} fontWeight={600} color="#fff">{r.district}</Typography>
        </Box>
      ),
    },
    { key: 'tehsil', label: 'Tehsil', render: (r) => <Typography fontSize={11} color="#ccc">{r.tehsil}</Typography> },
    { key: 'village', label: 'Village', render: (r) => <Typography fontSize={11} color="#ccc">{r.village}</Typography> },
    {
      key: 'coords', label: 'Coordinates',
      render: (r) => <Typography fontSize={11} color="#555">{r.latitude}, {r.longitude}</Typography>,
    },
    {
      key: 'status', label: 'Status',
      render: (r) => (
        <Chip label={r.status === 1 ? 'Active' : 'Inactive'} size="small"
          sx={{ height: 20, fontSize: 11, fontWeight: 600, bgcolor: r.status === 1 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: r.status === 1 ? '#22c55e' : '#ef4444', border: `1px solid ${r.status === 1 ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}` }} />
      ),
    },
    {
      key: 'actions', label: '',
      render: (r) => (
        <Stack direction="row" gap={0.5}>
          <Tooltip title="View Details">
            <IconButton size="small" onClick={() => setViewId(r.id)}
              sx={{ color: '#555', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.06)' } }}>
              <VisibilityIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => { setEditing(r); setFormOpen(true) }}
              sx={{ color: '#555', '&:hover': { color: '#E31E24', bgcolor: 'rgba(227,30,36,0.08)' } }}>
              <EditIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title={r.status === 1 ? 'Block' : 'Activate'}>
            <IconButton size="small" onClick={() => setConfirmLoc(r)}
              sx={{ color: '#555', '&:hover': { color: r.status === 1 ? '#ef4444' : '#22c55e', bgcolor: r.status === 1 ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)' } }}>
              {r.status === 1 ? <BlockIcon sx={{ fontSize: 16 }} /> : <CheckCircleIcon sx={{ fontSize: 16 }} />}
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ]

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>Location Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setFormOpen(true) }}
          sx={{ bgcolor: '#E31E24', '&:hover': { bgcolor: '#c41920' }, fontSize: 13, fontWeight: 600 }}>
          Add Location
        </Button>
      </Box>

      {/* Stats */}
      <Stack direction="row" gap={2} mb={3}>
        <StatCard label="Total Locations" value={total} icon={<LocationOnIcon sx={{ fontSize: 20, color: '#E31E24' }} />} color="#E31E24" />
        <StatCard label="Active" value={totalActive} icon={<CheckCircleIcon sx={{ fontSize: 20, color: '#22c55e' }} />} color="#22c55e" />
        <StatCard label="Inactive" value={totalInactive} icon={<PersonOffIcon sx={{ fontSize: 20, color: '#f59e0b' }} />} color="#f59e0b" />
        <StatCard label="Districts" value={[...new Set(locations.map((l) => l.district))].length} icon={<MapIcon sx={{ fontSize: 20, color: '#6366f1' }} />} color="#6366f1" />
      </Stack>

      {/* Toolbar */}
  {/* Filters */}
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
  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>

    <TextField
      select
      size="small"
      label="District"
      value={districtFilter}
      onChange={(e) => {
        setDistrictFilter(e.target.value)
        setTehsilFilter('')
        setVillageFilter('')
      }}
      sx={{ minWidth: 180 }}
    >
      <MenuItem value="">All Districts</MenuItem>
      {districtOptions.map((d) => (
        <MenuItem key={d} value={d}>
          {d}
        </MenuItem>
      ))}
    </TextField>

    <TextField
      select
      size="small"
      label="Tehsil"
      value={tehsilFilter}
      disabled={!districtFilter}
      onChange={(e) => {
        setTehsilFilter(e.target.value)
        setVillageFilter('')
      }}
      sx={{ minWidth: 180 }}
    >
      <MenuItem value="">All Tehsils</MenuItem>
      {tehsilOptions.map((t) => (
        <MenuItem key={t} value={t}>
          {t}
        </MenuItem>
      ))}
    </TextField>

    <TextField
      select
      size="small"
      label="Village"
      value={villageFilter}
      disabled={!tehsilFilter}
      onChange={(e) => setVillageFilter(e.target.value)}
      sx={{ minWidth: 180 }}
    >
      <MenuItem value="">All Villages</MenuItem>
      {villageOptions.map((v) => (
        <MenuItem key={v} value={v}>
          {v}
        </MenuItem>
      ))}
    </TextField>

  </Box>

  <TextField
    size="small"
    placeholder="Search locations..."
    value={search}
    onChange={(e) => {
      setSearch(e.target.value)
      setPage(0)
    }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon sx={{ fontSize: 16, color: '#555' }} />
        </InputAdornment>
      ),
    }}
    sx={{
      width: 250,
      '& .MuiOutlinedInput-root': {
        bgcolor: '#111111',
        '& fieldset': { borderColor: '#2A2A2A' },
      },
      '& .MuiInputBase-input': {
        color: '#fff',
        fontSize: 12,
      },
    }}
  />
</Box>

      {/* Table */}
<DataTable
  columns={columns}
  rows={filteredLocations}
  total={filteredLocations.length}
      page={page} pageSize={pageSize}
        onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(0) }} loading={isFetching} />

      {/* Dialogs */}
      {formOpen && (
        <LocationFormDialog open={formOpen} onClose={() => { setFormOpen(false); setEditing(null) }}
          editing={editing}
          onSaved={() => { setFormOpen(false); setEditing(null); qc.invalidateQueries({ queryKey: ['locations'] }) }} />
      )}

      <ViewDialog locId={viewId} onClose={() => setViewId(null)} />

      <ConfirmDialog open={!!confirmLoc} location={confirmLoc} onClose={() => setConfirmLoc(null)}
        loading={blockMutation.isPending}
        onConfirm={() => blockMutation.mutate({ id: confirmLoc.id, status: confirmLoc.status === 1 ? 2 : 1 })} />
    </Box>
  )
}

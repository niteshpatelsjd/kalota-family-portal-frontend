import { useState } from 'react'
import ViewFamilyPage from './ViewFamilyPage'
import AddMemberPage from './AddMemberPage'
import FamilyFormPage from './FamilyFormPage'

import {
  useQuery,
} from '@tanstack/react-query'

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
import GroupsIcon from '@mui/icons-material/Groups'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import BlockIcon from '@mui/icons-material/Block'
import PersonIcon from '@mui/icons-material/Person'
import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'

import api from '../../api/axiosInstance'

import DataTable from '../../components/common/DataTable'

/* ───────────────── API ───────────────── */

const getFamilies = (params) =>
  api
    .get(
      '/admin/family/getAllFamilies',
      {
        params,
      }
    )
    .then(
      (r) => r.data.responseBody
    )

const getDistricts = () =>
  api
    .get(
      '/admin/district/getAllDistrict',
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

const getTehsils = (
  districtId
) =>
  api
    .get(
      '/admin/tehsil/getAllTehsil',
      {
        params: {
          pageIndex: 0,
          pageSize: 100,
          status: 1,
          districtId,
        },
      }
    )
    .then(
      (r) => r.data.responseBody
    )

const getVillages = (
  districtId,
  tehsilId
) =>
  api
    .get(
      '/admin/village/getAllVillage',
      {
        params: {
          pageIndex: 0,
          pageSize: 100,
          status: 1,
          districtId,
          tehsilId,
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
  },

  '& .MuiInputLabel-root': {
    color: '#9C7A3B',
    fontSize: 13,
  },

  '& .MuiInputBase-input': {
    color: '#1E1E1E',
    fontSize: 13,
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

export default function FamilyPage() {
  const [page, setPage] =
    useState(0)

  const [
    pageSize,
    setPageSize,
  ] = useState(10)

  const [search, setSearch] =
    useState('')

  const [
    selectedDistrict,
    setSelectedDistrict,
  ] = useState('')

  const [
    selectedTehsil,
    setSelectedTehsil,
  ] = useState('')

  const [
    selectedVillage,
    setSelectedVillage,
  ] = useState('')

  const [
    selectedFamilyId,
    setSelectedFamilyId,
  ] = useState('')

  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false)

  const [
    addMemberOpen,
    setAddMemberOpen,
  ] = useState(false)

  const [
  familyFormOpen,
  setFamilyFormOpen,
] = useState(false)

const [
  selectedFamily,
  setSelectedFamily,
] = useState(null)
  /* ───────────────── FAMILY DATA ───────────────── */

  const {
    data,
    isFetching,
  } = useQuery({
    queryKey: [
      'families',
      page,
      pageSize,
      search,
      selectedDistrict,
      selectedTehsil,
      selectedVillage,
    ],

    queryFn: () =>
      getFamilies({
        pageIndex: page,

        pageSize,

        searchText:
          search || undefined,

        districtId:
          selectedDistrict ||
          undefined,

        tehsilId:
          selectedTehsil ||
          undefined,

        villageId:
          selectedVillage ||
          undefined,
      }),
  })

  const {
    data: districtData,
  } = useQuery({
    queryKey: ['districts'],
    queryFn: getDistricts,
  })

  const {
    data: tehsilData,
  } = useQuery({
    queryKey: [
      'tehsils',
      selectedDistrict,
    ],

    queryFn: () =>
      getTehsils(
        selectedDistrict
      ),

    enabled:
      !!selectedDistrict,
  })

  const {
    data: villageData,
  } = useQuery({
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

  const districts =
    districtData?.content ?? []

  const tehsils =
    tehsilData?.content ?? []

  const villages =
    villageData?.content ?? []

  const families =
    data?.content ?? []

  const total =
    data?.total || 0

  const totalFamilies =
    data?.totalFamilies || 0

  const activeCount =
    data?.totalActive || 0

  const inactiveCount =
    data?.totalInactive || 0

  /* ───────────────── TABLE COLUMNS ───────────────── */

  const columns = [
    {
      key: 'familyId',

      label: 'Family ID',

      render: (r) => (
        <Typography
          fontSize={12}
          fontWeight={700}
          color="#7A1E1E"
        >
          {r.familyId}
        </Typography>
      ),
    },

    {
      key: 'familyTitle',

      label: 'Family',

      render: (r) => (
        <Typography
          fontSize={13}
          fontWeight={600}
        >
          {r.familyTitle}
        </Typography>
      ),
    },

    {
      key: 'profile',

      label: 'Profile',

      render: (r) => (
        <Avatar
          src={
            r.familyHead
              ?.profileImage
          }
          sx={{
            width: 40,
            height: 40,
            bgcolor:
              'rgba(122,30,30,0.10)',
          }}
        >
          <PersonIcon />
        </Avatar>
      ),
    },

    {
      key: 'headName',

      label: 'Head Name',

      render: (r) => (
        <Typography
          fontSize={13}
          fontWeight={600}
        >
          {r.familyHead
            ?.firstName}{' '}
          {
            r.familyHead
              ?.middleName
          }{' '}
          {
            r.familyHead
              ?.lastName
          }
        </Typography>
      ),
    },

    {
      key: 'mobile',

      label: 'Mobile',

      render: (r) => (
        <Typography
          fontSize={12}
        >
          {
            r.familyHead
              ?.mobile
          }
        </Typography>
      ),
    },

    {
      key: 'totalMembers',

      label: 'Members',

      render: (r) => (
        <Chip
          label={`${r.totalMembers} Members`}
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
      key: 'district',

      label: 'District',

      render: (r) => (
        <Typography
          fontSize={12}
        >
          {r.district?.name}
        </Typography>
      ),
    },

    {
      key: 'tehsil',

      label: 'Tehsil',

      render: (r) => (
        <Typography
          fontSize={12}
        >
          {r.tehsil?.name}
        </Typography>
      ),
    },

    {
      key: 'village',

      label: 'Village',

      render: (r) => (
        <Typography
          fontSize={12}
        >
          {r.village?.name}
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
              onClick={() => {
                setSelectedFamilyId(
                  r.familyId
                )

                setProfileOpen(
                  true
                )
              }}
              sx={{
                color: '#1976d2',

                bgcolor:
                  'rgba(25,118,210,0.08)',

                '&:hover': {
                  bgcolor:
                    'rgba(25,118,210,0.18)',
                },
              }}
            >
              <VisibilityIcon
                sx={{
                  fontSize: 18,
                }}
              />
            </IconButton>
          </Tooltip>

     

<Tooltip title="Edit">
  <IconButton
    size="small"
    onClick={() => {

      setSelectedFamily(r)

      setFamilyFormOpen(true)
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
      sx={{
        fontSize: 18,
      }}
    />
  </IconButton>
</Tooltip>

          <Tooltip title="Block">
            <IconButton
              size="small"
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
              <BlockIcon
                sx={{
                  fontSize: 18,
                }}
              />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ]



  /* ───────────────── ADD MEMBER PAGE ───────────────── */

  if (addMemberOpen) {
    return (
      <AddMemberPage
        familyId={
          selectedFamilyId
        }
        onBack={() =>
          setAddMemberOpen(false)
        }
      />
    )
  }

if (familyFormOpen) {

  return (
    <FamilyFormPage
      family={selectedFamily}
      onBack={() => {

        setFamilyFormOpen(false)

        setSelectedFamily(null)
      }}
    />
  )
}
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
          Family Management
        </Typography>
<Stack direction="row" spacing={2}>
  <Button
    variant="outlined"
    onClick={() => {
      setSelectedFamilyId('')
      setAddMemberOpen(true)
    }}
    sx={{
      borderRadius: 3,
      textTransform: 'none',
      borderColor: '#D0D5DD',
      color: '#344054',
      px: 3,
      bgcolor: '#FFF',

      '&:hover': {
        borderColor: '#BFC6D4',
        bgcolor: '#F9FAFB',
      },
    }}
  >
    Add New Member
  </Button>

<Button
  variant="contained"
  onClick={() => {

    setSelectedFamily(null)

    setFamilyFormOpen(true)
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
  Add Family
</Button>
</Stack>
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
          label="Total Families"
          value={totalFamilies}
          color="#E31E24"
          icon={<GroupsIcon />}
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
            ? `Showing ${families.length} of ${total} families`
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
            label="District"
            size="small"
            value={
              selectedDistrict
            }
            onChange={(e) => {
              setSelectedDistrict(
                e.target.value
              )

              setSelectedTehsil(
                ''
              )

              setSelectedVillage(
                ''
              )

              setPage(0)
            }}
            sx={filterStyle}
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

          <TextField
            select
            label="Tehsil"
            size="small"
            value={
              selectedTehsil
            }
            onChange={(e) => {
              setSelectedTehsil(
                e.target.value
              )

              setSelectedVillage(
                ''
              )

              setPage(0)
            }}
            sx={filterStyle}
          >
            <MenuItem value="">
              All Tehsils
            </MenuItem>

            {tehsils.map((t) => (
              <MenuItem
                key={t._id}
                value={t._id}
              >
                {t.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Village"
            size="small"
            value={
              selectedVillage
            }
            onChange={(e) => {
              setSelectedVillage(
                e.target.value
              )

              setPage(0)
            }}
            sx={filterStyle}
          >
            <MenuItem value="">
              All Villages
            </MenuItem>

            {villages.map((v) => (
              <MenuItem
                key={v._id}
                value={v._id}
              >
                {v.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            size="small"
            placeholder="Search family..."
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
        rows={families}
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

      {/* VIEW FAMILY */}

      <ViewFamilyPage
        open={profileOpen}
        familyId={
          selectedFamilyId
        }
        onClose={() =>
          setProfileOpen(false)
        }
      />
    </Box>
  )}

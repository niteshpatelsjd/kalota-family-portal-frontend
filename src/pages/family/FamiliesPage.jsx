import { useMemo, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'

import FamilyStats from './components/FamilyStats'
import FamilyFilters from './components/FamilyFilters'
import FamilyTable from './components/FamilyTable'
import CreateFamilyDrawer from './components/CreateFamilyDrawer'


import { getFamilies } from './services/familyApi'

export default function FamiliesPage() {

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [page, setPage] = useState(0)

  const [pageSize, setPageSize] =
    useState(10)

  const [search, setSearch] =
    useState('')

  /* ---------------- QUERY ---------------- */

  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: [
      'families',
      page,
      pageSize,
      search,
    ],

    queryFn: () =>
      getFamilies({
        page,
        pageSize,
        searchText: search,
      }),

    keepPreviousData: true,
  })

  /* ---------------- DATA ---------------- */

  const families =
    data?.responseBody?.content ||
    []

  const total =
    data?.responseBody
      ?.totalRecords || 0

  /* ---------------- STATS ---------------- */

  const stats = useMemo(
    () => ({
      total,

      active:
        families.filter(
          (x) => x.status === 1
        ).length || 0,

      inactive:
        families.filter(
          (x) => x.status !== 1
        ).length || 0,
    }),

    [families, total]
  )

  /* ---------------- LOADING ---------------- */

  if (isLoading && page === 0) {
    return (
      <Box
        sx={{
          height: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent:
            'center',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      {/* HEADER */}

      <Box
        sx={{
          mb: 4,
        }}
      >
        <Stack
          direction={{
            xs: 'column',
            sm: 'row',
          }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{
            xs: 'flex-start',
            sm: 'center',
          }}
        >
          {/* LEFT */}

          <Box>
            <Typography
              sx={{
                color: '#fff',
                fontSize: 28,
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              Family Management
            </Typography>

            <Typography
              sx={{
                color: '#666',
                fontSize: 13,
                mt: 0.7,
              }}
            >
              Manage all registered
              families and their
              lineage
            </Typography>
          </Box>

          {/* RIGHT */}

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              console.log(
                'Create Family Clicked'
              )
              setDrawerOpen(true)
            }}
            sx={{
              bgcolor: '#E31E24',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              px: 2.5,
              height: 42,
              borderRadius: 2,
              boxShadow: 'none',

              '&:hover': {
                bgcolor: '#c41820',
                boxShadow: 'none',
              },
            }}
          >
            Create Family
          </Button>
        </Stack>
      </Box>

      {/* STATS */}

      <Box
        sx={{
          mb: 4,
        }}
      >
        <FamilyStats
          stats={stats}
        />
      </Box>

      {/* FILTERS */}

      <Box
        sx={{
          mb: 3,
        }}
      >
        <FamilyFilters
          search={search}
          setSearch={(
            value
          ) => {
            setPage(0)
            setSearch(value)
          }}
        />
      </Box>

      {/* TABLE */}

      <FamilyTable
        rows={families}
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(
          size
        ) => {
          setPage(0)
          setPageSize(size)
        }}
        loading={isLoading}
      />

      {/* EMPTY STATE */}

      {!isLoading &&
        families.length ===
          0 && (
          <Box
            sx={{
              py: 10,
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{
                color: '#666',
                fontSize: 16,
              }}
            >
              No families found
            </Typography>
          </Box>
        )}
        <CreateFamilyDrawer open={drawerOpen} onClose={() => setDrawerOpen(false) } 
        onSuccess={() => { 
          refetch() 
          }} />
    </Box>
  )
}


import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import {
  Box,
  CircularProgress,
  Grid,
  Button,
  Stack,
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'

import FamilyHeader from './components/FamilyHeader'
import HeadProfileCard from './components/HeadProfileCard'
import FamilyMetaCard from './components/FamilyMetaCard'
import FamilyMembers from './components/FamilyMembers'
import AddMemberDrawer from './components/AddMemberDrawer'

import { getFamilyDetails } from './services/familyApi'

export default function FamilyDetailsPage() {
  const { id } = useParams()

  const [drawerOpen, setDrawerOpen] =
    useState(false)

  const [editData, setEditData] = useState(null)
  const [mode, setMode] = useState('create')

  const {
    data,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['family-details', id],

    queryFn: () =>
      getFamilyDetails(id),
  })

  const family = data?.responseBody

  const members =
    family?.members || []

  const head =
    members.find(
      (m) =>
        m.relationToHead === 'SELF'
    ) || members[0]

  if (isLoading) {
    return (
      <Box
        sx={{
          height: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}

      <FamilyHeader family={family} />

      {/* Action Bar */}

      <Stack
        direction="row"
        justifyContent="flex-end"
        mb={3}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => { setMode('create') 
            setEditData(null) 
            setDrawerOpen(true)
          }}
          sx={{
            bgcolor: '#E31E24',
            textTransform: 'none',
            fontWeight: 600,

            '&:hover': {
              bgcolor: '#c41820',
            },
          }}
        >
          Add Member
        </Button>
      </Stack>

      {/* Main Content */}

      <Grid container spacing={3}>
        {/* Left */}

        <Grid item xs={12} md={3}>
          <HeadProfileCard head={head} />
        </Grid>

        {/* Center */}

        <Grid item xs={12} md={6}>
          <FamilyMembers members={members}
           onEdit={(member) => { setMode('edit') 
           setEditData(member) 
           setDrawerOpen(true) 
           }} />
        </Grid>

        {/* Right */}

        <Grid item xs={12} md={3}>
          <FamilyMetaCard family={family} />
        </Grid>
      </Grid>

      {/* Add Member Drawer */}

      <AddMemberDrawer open={drawerOpen} onClose={() => setDrawerOpen(false) } familyId={id} members={members} mode={mode} editData={editData} onSuccess={() => { refetch() }} />
    </Box>
  )
}

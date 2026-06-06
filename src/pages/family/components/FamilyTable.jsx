import {
  Box,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'

import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import LocationOnIcon from '@mui/icons-material/LocationOn'

import { useNavigate } from 'react-router-dom'

import DataTable from '../../../components/common/DataTable'

export default function FamilyTable({
  rows,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading,
}) {
  const navigate = useNavigate()

  const columns = [
    /* ================= FAMILY ID ================= */

    {
      key: 'familyId',

      label: 'Family ID',

      render: (row) => (
        <Typography
          sx={{
            color: '#fff',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0.3,
          }}
        >
          {row.familyId}
        </Typography>
      ),
    },

    /* ================= HEAD ================= */

    {
      key: 'headName',

      label: 'Head Profile',

      render: (row) => (
        <Box>
          <Typography
            sx={{
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {row.headName}
          </Typography>

          <Typography
            sx={{
              color: '#666',
              fontSize: 11,
              mt: 0.3,
            }}
          >
            {row.displayName}
          </Typography>
        </Box>
      ),
    },

    /* ================= LOCATION ================= */

    {
      key: 'location',

      label: 'Location',

      render: (row) => (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
        >
          <LocationOnIcon
            sx={{
              color: '#666',
              fontSize: 15,
            }}
          />

          <Box>
            <Typography
              sx={{
                color: '#ccc',
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              {row.village}
            </Typography>

            <Typography
              sx={{
                color: '#666',
                fontSize: 11,
              }}
            >
              {row.tehsil}, {row.district}
            </Typography>
          </Box>
        </Stack>
      ),
    },

    /* ================= STATUS ================= */

    {
      key: 'status',

      label: 'Status',

      render: (row) => (
        <Chip
          label={
            row.status === 1
              ? 'Active'
              : 'Inactive'
          }
          size="small"
          sx={{
            bgcolor:
              row.status === 1
                ? 'rgba(34,197,94,0.12)'
                : 'rgba(239,68,68,0.12)',

            color:
              row.status === 1
                ? '#22c55e'
                : '#ef4444',

            fontWeight: 600,
            minWidth: 82,
          }}
        />
      ),
    },

    /* ================= CREATED ================= */

    {
      key: 'createdAt',

      label: 'Created',

      render: (row) => (
        <Typography
          sx={{
            color: '#888',
            fontSize: 12,
          }}
        >
          {new Date(
            row.createdAt
          ).toLocaleDateString()}
        </Typography>
      ),
    },

    /* ================= ACTIONS ================= */

    {
      key: 'actions',

      label: 'Actions',

      render: (row) => (
        <Stack
          direction="row"
          spacing={1}
        >
          {/* VIEW */}

          <Tooltip title="View">
            <IconButton
              size="small"
              onClick={() =>
                navigate(
                  `/families/${row.id}`
                )
              }
              sx={{
                color: '#666',

                '&:hover': {
                  color: '#fff',
                  bgcolor:
                    'rgba(255,255,255,0.05)',
                },
              }}
            >
              <VisibilityIcon
                fontSize="small"
              />
            </IconButton>
          </Tooltip>

          {/* EDIT */}

          <Tooltip title="Edit">
            <IconButton
              size="small"
              sx={{
                color: '#E31E24',

                '&:hover': {
                  bgcolor:
                    'rgba(227,30,36,0.10)',
                },
              }}
            >
              <EditIcon
                fontSize="small"
              />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      rows={rows}
      total={total}
      page={page}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={
        onPageSizeChange
      }
      loading={loading}
    />
  )
}

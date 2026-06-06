import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

import {
  useEffect,
  useMemo,
} from 'react'

import { useForm } from 'react-hook-form'

import {
  useMutation,
} from '@tanstack/react-query'

import toast from 'react-hot-toast'

import {
  addFamilyMember,
  updateFamilyMember,
} from '../services/familyApi'

const RELATIONS = [
  'SELF',
  'WIFE',
  'SON',
  'DAUGHTER',
  'BROTHER',
  'SISTER',
  'FATHER',
  'MOTHER',
  'GRANDFATHER',
  'GRANDMOTHER',
]

export default function AddMemberDrawer({
  open,
  onClose,
  familyId,
  members = [],
  onSuccess,
  mode = 'create',
  editData = null,
}) {
  const isEdit =
    mode === 'edit'

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm()

  const image =
    watch('profileImage')

  const memberOptions = useMemo(
    () =>
      members.map((m) => ({
        label: m.fullName,
        value: m.id,
      })),
    [members]
  )

  /* ---------------- PREFILL ---------------- */

  useEffect(() => {
    if (
      isEdit &&
      editData
    ) {
      Object.keys(editData).forEach(
        (key) => {
          setValue(
            key,
            editData[key]
          )
        }
      )
    }
  }, [
    editData,
    isEdit,
    setValue,
  ])

  /* ---------------- CREATE ---------------- */

  const createMutation =
    useMutation({
      mutationFn:
        addFamilyMember,

      onSuccess: () => {
        toast.success(
          'Member added successfully'
        )

        reset()

        onClose()

        onSuccess?.()
      },

      onError: (err) => {
        toast.error(
          err?.response?.data
            ?.message ||
            'Failed to add member'
        )
      },
    })

  /* ---------------- UPDATE ---------------- */

  const updateMutation =
    useMutation({
      mutationFn:
        updateFamilyMember,

      onSuccess: () => {
        toast.success(
          'Member updated successfully'
        )

        reset()

        onClose()

        onSuccess?.()
      },

      onError: (err) => {
        toast.error(
          err?.response?.data
            ?.message ||
            'Failed to update member'
        )
      },
    })

  /* ---------------- SUBMIT ---------------- */

  const onSubmit = (
    values
  ) => {
    const formData =
      new FormData()

    Object.entries(
      values
    ).forEach(
      ([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== ''
        ) {
          if (
            key ===
              'profileImage' &&
            value?.[0]
          ) {
            formData.append(
              key,
              value[0]
            )
          } else {
            formData.append(
              key,
              value
            )
          }
        }
      }
    )

    formData.append(
      'familyId',
      familyId
    )

    if (isEdit) {
      updateMutation.mutate({
        id: editData.id,
        payload: formData,
      })
    } else {
      createMutation.mutate(
        formData
      )
    }
  }

  const loading =
    createMutation.isPending ||
    updateMutation.isPending

  const fieldSx = {
    '& .MuiOutlinedInput-root':
      {
        bgcolor: '#111111',

        '& fieldset': {
          borderColor:
            '#2A2A2A',
        },

        '&:hover fieldset': {
          borderColor: '#444',
        },

        '&.Mui-focused fieldset':
          {
            borderColor:
              '#E31E24',
          },
      },

    '& .MuiInputBase-input': {
      color: '#fff',
      fontSize: 13,
    },

    '& .MuiInputLabel-root': {
      color: '#666',
    },
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: {
            xs: '100%',
            sm: 520,
          },

          bgcolor: '#0D0D0D',
          borderLeft:
            '1px solid #2A2A2A',
        },
      }}
    >
      {/* Header */}

      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          justifyContent:
            'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography
            sx={{
              color: '#fff',
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            {isEdit
              ? 'Edit Member'
              : 'Add Family Member'}
          </Typography>

          <Typography
            sx={{
              color: '#666',
              fontSize: 12,
              mt: 0.5,
            }}
          >
            {isEdit
              ? 'Update member profile'
              : 'Create new member profile'}
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          sx={{
            color: '#666',
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider
        sx={{
          borderColor:
            '#2A2A2A',
        }}
      />

      {/* Form */}

      <Box
        component="form"
        onSubmit={handleSubmit(
          onSubmit
        )}
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 3,
        }}
      >
        <Grid
          container
          spacing={2}
        >
          {/* IMAGE */}

          <Grid item xs={12}>
            <Stack
              alignItems="center"
              spacing={2}
            >
              <Avatar
                src={
                  image?.[0]
                    ? URL.createObjectURL(
                        image[0]
                      )
                    : editData?.profileImage
                }
                sx={{
                  width: 90,
                  height: 90,
                  bgcolor:
                    'rgba(227,30,36,0.18)',
                }}
              />

              <Button
                component="label"
                variant="outlined"
                startIcon={
                  <CloudUploadIcon />
                }
                sx={{
                  borderColor:
                    '#2A2A2A',
                  color: '#fff',
                }}
              >
                Upload Photo

                <input
                  hidden
                  type="file"
                  accept="image/*"
                  {...register(
                    'profileImage'
                  )}
                />
              </Button>
            </Stack>
          </Grid>

          {/* FIRST NAME */}

          <Grid
            item
            xs={12}
            sm={6}
          >
            <TextField
              fullWidth
              label="First Name"
              size="small"
              {...register(
                'firstName',
                {
                  required:
                    'First name required',
                }
              )}
              error={
                !!errors.firstName
              }
              helperText={
                errors.firstName
                  ?.message
              }
              sx={fieldSx}
            />
          </Grid>

          {/* LAST NAME */}

          <Grid
            item
            xs={12}
            sm={6}
          >
            <TextField
              fullWidth
              label="Last Name"
              size="small"
              {...register(
                'lastName'
              )}
              sx={fieldSx}
            />
          </Grid>

          {/* MOBILE */}

          <Grid
            item
            xs={12}
            sm={6}
          >
            <TextField
              fullWidth
              label="Mobile Number"
              size="small"
              {...register(
                'mobileNumber'
              )}
              sx={fieldSx}
            />
          </Grid>

          {/* GENDER */}

          <Grid
            item
            xs={12}
            sm={6}
          >
            <TextField
              select
              fullWidth
              label="Gender"
              size="small"
              defaultValue=""
              {...register(
                'gender'
              )}
              sx={fieldSx}
            >
              <MenuItem value="Male">
                Male
              </MenuItem>

              <MenuItem value="Female">
                Female
              </MenuItem>
            </TextField>
          </Grid>

          {/* RELATION */}

          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Relation To Head"
              size="small"
              defaultValue=""
              {...register(
                'relationToHead',
                {
                  required:
                    'Relation is required',
                }
              )}
              error={
                !!errors.relationToHead
              }
              helperText={
                errors
                  .relationToHead
                  ?.message
              }
              sx={fieldSx}
            >
              {RELATIONS.map(
                (item) => (
                  <MenuItem
                    key={item}
                    value={item}
                  >
                    {item}
                  </MenuItem>
                )
              )}
            </TextField>
          </Grid>

          {/* PARENT */}

          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Parent"
              size="small"
              defaultValue=""
              {...register(
                'parentProfileId'
              )}
              sx={fieldSx}
            >
              <MenuItem value="">
                None
              </MenuItem>

              {memberOptions.map(
                (member) => (
                  <MenuItem
                    key={
                      member.value
                    }
                    value={
                      member.value
                    }
                  >
                    {member.label}
                  </MenuItem>
                )
              )}
            </TextField>
          </Grid>

          {/* OCCUPATION */}

          <Grid
            item
            xs={12}
            sm={6}
          >
            <TextField
              fullWidth
              label="Occupation"
              size="small"
              {...register(
                'occupation'
              )}
              sx={fieldSx}
            />
          </Grid>

          {/* EDUCATION */}

          <Grid
            item
            xs={12}
            sm={6}
          >
            <TextField
              fullWidth
              label="Education"
              size="small"
              {...register(
                'education'
              )}
              sx={fieldSx}
            />
          </Grid>

          {/* DOB */}

          <Grid item xs={12}>
            <TextField
              fullWidth
              type="date"
              label="Date of Birth"
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              {...register(
                'dob'
              )}
              sx={fieldSx}
            />
          </Grid>
        </Grid>

        {/* FOOTER */}

        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          mt={4}
        >
          <Button
            onClick={onClose}
            sx={{
              color: '#666',
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: '#E31E24',

              '&:hover': {
                bgcolor:
                  '#c41820',
              },
            }}
          >
            {loading
              ? 'Saving...'
              : isEdit
              ? 'Update Member'
              : 'Add Member'}
          </Button>
        </Stack>
      </Box>
    </Drawer>
  )
}

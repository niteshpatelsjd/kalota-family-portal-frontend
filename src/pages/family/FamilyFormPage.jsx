import { useState, useEffect } from 'react'

import SearchIcon from '@mui/icons-material/Search'

import {
  InputAdornment,
} from '@mui/material'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Button,
  Stack,
  Avatar,
} from '@mui/material'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import {
  useMutation,
  useQueryClient,
  useQuery,
} from '@tanstack/react-query'

import toast from 'react-hot-toast'
import api from '../../api/axiosInstance'

/* ───────────────── SAVE API ───────────────── */

const saveFamily = async (
  formData
) => {

  const response =
    await api.post(
      '/admin/family/createOrUpdateFamily',
      formData,
      {
        headers: {
          'Content-Type':
            'multipart/form-data',
        },
      }
    )

  return response.data
}

/* ───────────────── PAGE ───────────────── */

export default function FamilyFormPage({
  family,
  onBack,
}) {

  const queryClient =
    useQueryClient()

  const isEdit =
    !!family

    /* ───────────────── LOCATION STATE ───────────────── */

const [
  selectedDistrict,
  setSelectedDistrict,
] = useState(
  family?.district?._id || ''
)

const [
  selectedTehsil,
  setSelectedTehsil,
] = useState(
  family?.tehsil?._id || ''
)

const [
  selectedVillage,
  setSelectedVillage,
] = useState(
  family?.village?.id || ''
)

/* ───────────────── DISTRICT QUERY ───────────────── */

const {
  data: districtData,
} = useQuery({
  queryKey: ['districts'],
  queryFn: async () => {

    const response =
      await api.get(
        '/admin/district/getAllDistrict'
      )

    return response.data
  },
})

/* ───────────────── TEHSIL QUERY ───────────────── */

const {
  data: tehsilData,
} = useQuery({
  queryKey: [
    'tehsils',
    selectedDistrict,
  ],

  enabled:
    !!selectedDistrict,

  queryFn: async () => {

    const response =
      await api.get(
        `/admin/tehsil/getAllTehsil?districtId=${selectedDistrict}`
      )

    return response.data
  },
})

/* ───────────────── VILLAGE QUERY ───────────────── */

const {
  data: villageData,
} = useQuery({
  queryKey: [
    'villages',
    selectedTehsil,
  ],

  enabled:
    !!selectedTehsil,

  queryFn: async () => {

    const response =
      await api.get(
        `/admin/village/getAllVillage?tehsilId=${selectedTehsil}`
      )

    return response.data
  },
})


useEffect(() => {

  if (family) {

    setSelectedDistrict(
      family?.district?._id || ''
    )

    setSelectedTehsil(
      family?.tehsil?._id || ''
    )

    setSelectedVillage(
      family?.village?.id || ''
    )
  }

}, [family])
  /* ───────────────── FORM STATE ───────────────── */

  const [form, setForm] =
    useState({

      firstName:
        family?.familyHead
          ?.firstName || '',

      middleName:
        family?.familyHead
          ?.middleName || '',

      lastName:
        family?.familyHead
          ?.lastName || '',

      fatherFirstName: '',

      fatherMiddleName: '',

      fatherLastName: '',

      motherFirstName: '',

      motherMiddleName: '',

      motherLastName: '',

      gender: '',

      dob: '',

      mobile:
        family?.familyHead
          ?.mobile || '',

      email: '',

      occupation: '',

      education: '',

      maritalStatus: '',


    })

  const [
    profileImage,
    setProfileImage,
  ] = useState(null)

  /* ───────────────── MUTATION ───────────────── */

  const mutation =
    useMutation({

      mutationFn: saveFamily,

      onSuccess: () => {

        toast.success(
          isEdit
            ? 'Family updated successfully'
            : 'Family created successfully'
        )

        queryClient.invalidateQueries({
          queryKey: ['families'],
        })

        onBack()
      },

      onError: (err) => {

        toast.error(
          err?.response?.data
            ?.message ||
            'Something went wrong'
        )
      },
    })

  /* ───────────────── HANDLE CHANGE ───────────────── */

  const handleChange = (
    e
  ) => {

    setForm((prev) => ({
      ...prev,

      [e.target.name]:
        e.target.value,
    }))
  }

  /* ───────────────── SUBMIT ───────────────── */

const handleSubmit = () => {

  const formData =
    new FormData()

  /*
   * Only send in update mode
   */

  if (isEdit) {

    formData.append(
      'familyRefId',
      family?._id ||
        family?.id ||
        family?.familyRefId ||
        ''
    )
  }

  /*
   * Form fields
   */

  Object.keys(form).forEach(
    (key) => {

      formData.append(
        key,
        form[key]
      )
    }
  )

  /*
   * Village Id
   */

  formData.append(
    'villageId',
    selectedVillage || ''
  )

  /*
   * Profile Image
   */

  if (profileImage) {

    formData.append(
      'profileImage',
      profileImage
    )
  }

  mutation.mutate(
    formData
  )
}

  /* ───────────────── FIELD STYLE ───────────────── */

  const fieldStyle = {

    '& .MuiOutlinedInput-root': {
      bgcolor: '#FFFFFF',
      borderRadius: 2,
      height: 56,

      '& fieldset': {
        borderColor: '#E7D4C7',
      },

      '&:hover fieldset': {
        borderColor: '#9C7A3B',
      },

      '&.Mui-focused fieldset': {
        borderColor: '#7A1E1E',
        borderWidth: '1.5px',
      },
    },

    '& .MuiInputLabel-root': {
      color: '#9C7A3B',
      fontSize: 13,
      fontWeight: 500,
    },

    '& .MuiInputLabel-root.Mui-focused': {
      color: '#7A1E1E',
    },

    '& .MuiInputBase-input': {
      fontSize: 14,
      color: '#1E1E1E',
    },

    '& .MuiSelect-select': {
      display: 'flex',
      alignItems: 'center',
      minHeight: '56px !important',
      fontSize: 14,
      color: '#1E1E1E',
    },

    '& input::placeholder': {
      color: '#999',
      opacity: 1,
    },
  }

  /* ───────────────── UI ───────────────── */

  return (
    <Box>

      {/* HEADER */}

      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        mb={3}
      >
        <Button
          startIcon={
            <ArrowBackIcon />
          }
          onClick={onBack}
          sx={{
            textTransform:
              'none',
            color: '#7A1E1E',
            fontWeight: 600,
          }}
        >
          Back
        </Button>

        <Typography
          sx={{
            fontSize: 24,
            fontWeight: 700,
            color: '#7A1E1E',
            letterSpacing: 0.3,
          }}
        >
          {isEdit
            ? 'Update Family'
            : 'Add Family'}
        </Typography>
      </Stack>

      {/* FORM */}

      <Card
        sx={{
          bgcolor: '#FFFDF8',
          border:
            '1px solid rgba(122,30,30,0.10)',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow:
            '0 10px 35px rgba(122,30,30,0.10)',
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 2,
              md: 4,
            },
          }}
        >

          <Grid
            container
            spacing={3}
          >

            {/* PROFILE */}

            <Grid
              item
              xs={12}
            >
              <Stack
                alignItems="center"
                spacing={2}
                mb={1}
              >
                <Box
                  sx={{
                    position:
                      'relative',
                    width: 110,
                    height: 110,
                  }}
                >
                  <Avatar
                    src={
                      profileImage
                        ? URL.createObjectURL(
                            profileImage
                          )
                        : family
                            ?.familyHead
                            ?.profileImage
                    }
                    sx={{
                      width: 110,
                      height: 110,
                      bgcolor:
                        '#F5E6DA',
                      color:
                        '#7A1E1E',
                      fontSize: 32,
                      fontWeight: 700,
                      border:
                        '3px solid #E7D4C7',
                      boxShadow:
                        '0 4px 14px rgba(0,0,0,0.08)',
                    }}
                  >
                    {!profileImage &&
                      !family
                        ?.familyHead
                        ?.profileImage &&
                      'F'}
                  </Avatar>

                  <Button
                    component="label"
                    variant="contained"
                    size="small"
                    sx={{
                      position:
                        'absolute',
                      bottom: -10,
                      left: '50%',
                      transform:
                        'translateX(-50%)',
                      textTransform:
                        'none',
                      bgcolor:
                        '#7A1E1E',
                      borderRadius: 5,
                      px: 2,
                      fontSize: 11,

                      '&:hover': {
                        bgcolor:
                          '#651818',
                      },
                    }}
                  >
                    Upload

                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setProfileImage(
                          e.target
                            .files[0]
                        )
                      }
                    />
                  </Button>
                </Box>
              </Stack>
            </Grid>

            {/* FIRST NAME */}

            <Grid
              item
              xs={12}
              md={4}
            >
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={
                  form.firstName
                }
                onChange={
                  handleChange
                }
                sx={fieldStyle}
              />
            </Grid>

            {/* MIDDLE NAME */}

            <Grid
              item
              xs={12}
              md={4}
            >
              <TextField
                fullWidth
                label="Middle Name"
                name="middleName"
                value={
                  form.middleName
                }
                onChange={
                  handleChange
                }
                sx={fieldStyle}
              />
            </Grid>

            {/* LAST NAME */}

            <Grid
              item
              xs={12}
              md={4}
            >
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={
                  form.lastName
                }
                onChange={
                  handleChange
                }
                sx={fieldStyle}
              />
            </Grid>

            {/* FATHER FIRST NAME */}

<Grid
  item
  xs={12}
  md={4}
>
  <TextField
    fullWidth
    label="Father First Name"
    name="fatherFirstName"
    value={
      form.fatherFirstName
    }
    onChange={
      handleChange
    }
    sx={fieldStyle}
  />
</Grid>

{/* MOTHER FIRST NAME */}

<Grid
  item
  xs={12}
  md={4}
>
  <TextField
    fullWidth
    label="Mother First Name"
    name="motherFirstName"
    value={
      form.motherFirstName
    }
    onChange={
      handleChange
    }
    sx={fieldStyle}
  />
</Grid>

{/* DISTRICT */}

<Grid
  item
  xs={12}
  md={4}
>
  <TextField
    select
    fullWidth
    label="District"
    value={selectedDistrict}
    onChange={(e) => {

      setSelectedDistrict(
        e.target.value
      )

      setSelectedTehsil('')
      setSelectedVillage('')
    }}
    sx={fieldStyle}
  >
   {districtData?.responseBody?.content?.map(
      (district) => (
        <MenuItem
          key={district._id}
          value={district._id}
        >
          {district.name}
        </MenuItem>
      )
    )}
  </TextField>
</Grid>

{/* TEHSIL */}

<Grid
  item
  xs={12}
  md={4}
>
  <TextField
    select
    fullWidth
    label="Tehsil"
    value={selectedTehsil}
    onChange={(e) => {

      setSelectedTehsil(
        e.target.value
      )

      setSelectedVillage('')
    }}
    disabled={!selectedDistrict}
    sx={fieldStyle}
  >
    {tehsilData?.responseBody?.content?.map(
      (tehsil) => (
        <MenuItem
          key={tehsil._id}
          value={tehsil._id}
        >
          {tehsil.name}
        </MenuItem>
      )
    )}
  </TextField>
</Grid>

{/* VILLAGE */}

<Grid
  item
  xs={12}
  md={4}
>
  <TextField
    select
    fullWidth
    label="Village"
    value={selectedVillage}
    onChange={(e) => {

      setSelectedVillage(
        e.target.value
      )
    }}
    disabled={!selectedTehsil}
    sx={fieldStyle}
  >
    {villageData?.responseBody?.content?.map(
      (village) => (
        <MenuItem
          key={village.id}
          value={village.id}
        >
          {village.name}
        </MenuItem>
      )
    )}
  </TextField>
</Grid>

{/* MOBILE */}

            {/* MOBILE */}

            <Grid
              item
              xs={12}
              md={4}
            >
              <TextField
                fullWidth
                label="Mobile"
                name="mobile"
                value={
                  form.mobile
                }
                onChange={
                  handleChange
                }
                sx={fieldStyle}
              />
            </Grid>


            {/* EMAIL */}

            <Grid
              item
              xs={12}
              md={4}
            >
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={
                  form.email
                }
                onChange={
                  handleChange
                }
                sx={fieldStyle}
              />
            </Grid>

            {/* GENDER */}

            <Grid
              item
              xs={12}
              md={4}
            >
              <TextField
                select
                fullWidth
                label="Gender"
                name="gender"
                value={
                  form.gender
                }
                onChange={
                  handleChange
                }
                sx={fieldStyle}
              >
                <MenuItem value="MALE">
                  Male
                </MenuItem>

                <MenuItem value="FEMALE">
                  Female
                </MenuItem>

                <MenuItem value="OTHER">
                  Other
                </MenuItem>
              </TextField>
            </Grid>

            {/* DOB */}

            <Grid
              item
              xs={12}
              md={4}
            >
              <TextField
                fullWidth
                label="DOB"
                name="dob"
                placeholder="25-12-1995"
                value={form.dob}
                onChange={
                  handleChange
                }
                sx={fieldStyle}
              />
            </Grid>

            {/* MARITAL STATUS */}

            <Grid
              item
              xs={12}
              md={4}
            >
              <TextField
                select
                fullWidth
                label="Marital Status"
                name="maritalStatus"
                value={
                  form.maritalStatus
                }
                onChange={
                  handleChange
                }
                sx={fieldStyle}
              >
                <MenuItem value="SINGLE">
                  SINGLE
                </MenuItem>

                <MenuItem value="MARRIED">
                  MARRIED
                </MenuItem>
              </TextField>
            </Grid>

            
            {/* EDUCATION DETAIL */}

            <Grid
              item
              xs={12}
              md={4}
            >
              <TextField
                select
                fullWidth
                label="Education Details"
                name="education"
                value={
                  form.education
                }
                onChange={
                  handleChange
                }
                sx={fieldStyle}
              >
                <MenuItem value="School">
                  School
                </MenuItem>

                <MenuItem value="Diploma">
                  Diploma
                </MenuItem>
                <MenuItem value="Graduation">
                  Graduation
                </MenuItem>

                <MenuItem value="Post Graduation">
                  Post Graduation
                </MenuItem>
              </TextField>
            </Grid>

 {/* Occupation DETAIL */}

            <Grid
              item
              xs={12}
              md={4}
            >
              <TextField
                select
                fullWidth
                label="Occupation Details"
                name="occupation"
                value={
                  form.occupation
                }
                onChange={
                  handleChange
                }
                sx={fieldStyle}
              >
                <MenuItem value="Farmer">
                  Farmer
                </MenuItem>

                <MenuItem value="Professional">
                  Professional
                </MenuItem>
                <MenuItem value="Business">
                  Business
                </MenuItem>

              </TextField>
            </Grid>

            {/* BUTTONS */}

            <Grid
              item
              xs={12}
            >
              <Stack
                direction="row"
                justifyContent="flex-end"
                spacing={2}
                mt={1}
              >
                <Button
                  variant="outlined"
                  onClick={onBack}
                  sx={{
                    borderColor:
                      '#E7D4C7',
                    color: '#8A6D3B',
                    fontWeight: 600,
                    textTransform:
                      'none',
                    px: 3,

                    '&:hover': {
                      borderColor:
                        '#9C7A3B',
                      bgcolor:
                        'rgba(122,30,30,0.04)',
                    },
                  }}
                >
                  Cancel
                </Button>

                <Button
                  variant="contained"
                  onClick={
                    handleSubmit
                  }
                  disabled={
                    mutation.isPending
                  }
                  sx={{
                    bgcolor:
                      '#7A1E1E',
                    color: '#fff',
                    fontWeight: 600,
                    px: 3,
                    borderRadius: 2,
                    textTransform:
                      'none',

                    '&:hover': {
                      bgcolor:
                        '#651818',
                    },
                  }}
                >
                  {mutation.isPending
                    ? 'Saving...'
                    : isEdit
                    ? 'Update Family'
                    : 'Create Family'}
                </Button>
              </Stack>
            </Grid>

          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}
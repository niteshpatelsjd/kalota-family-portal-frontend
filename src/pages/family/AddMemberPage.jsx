// src/pages/family/AddMemberPage.jsx

import { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar'

import IconButton from '@mui/material/IconButton'

import EditIcon from '@mui/icons-material/Edit'

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
  Divider,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material'

import SaveIcon from '@mui/icons-material/Save'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import {
  useQuery,
} from '@tanstack/react-query'

import api from '../../api/axiosInstance'

/* ───────────────── API ───────────────── */

const getDistricts = () =>
  api
    .get(
      '/admin/district/getAllDistrict',
      {
        params: {
          pageIndex: 0,
          pageSize: 200,
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
          pageSize: 200,
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
          pageSize: 200,
          status: 1,
          districtId,
          tehsilId,
        },
      }
    )
    .then(
      (r) => r.data.responseBody
    )

const getFamilies = (
  villageId
) =>
  api
    .get(
      '/admin/family/getAllFamilies',
      {
        params: {
          pageIndex: 0,
          pageSize: 500,
          villageId,
        },
      }
    )
    .then(
      (r) => r.data.responseBody
    )

const getMembers = (
  familyId
) =>
  api
    .get(
      '/admin/person/getPersonsByFamily',
      {
        params: {
          familyId,
        },
      }
    )
    .then(
      (r) => r.data.responseBody
    )

/* ───────────────── STYLE ───────────────── */

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    bgcolor: '#FFFFFF',
    borderRadius: '14px',

    '& fieldset': {
      borderColor: '#E5E7EB',
    },

    '&:hover fieldset': {
      borderColor: '#CBD5E1',
    },

    '&.Mui-focused fieldset': {
      borderColor: '#E31E24',
      borderWidth: '2px',
    },
  },

  '& .MuiInputLabel-root': {
    color: '#64748B',
    fontSize: 13,
    fontWeight: 500,
  },

  '& .MuiInputBase-input': {
    fontSize: 14,
    color: '#334155',
  },
}

const selectMenuStyle = {
  PaperProps: {
    sx: {
      maxHeight: 320,
      borderRadius: '16px',
      mt: 1,
      border: '1px solid #E2E8F0',
      bgcolor: '#FFFFFF',

      '& .MuiMenuItem-root': {
        color: '#0F172A',
        bgcolor: '#FFFFFF',
      },

      '& .MuiMenuItem-root:hover': {
        bgcolor: '#F8FAFC',
      },

      '& .MuiMenuItem-root.Mui-selected': {
        bgcolor: '#EEF2FF',
        color: '#0F172A',
      },

      '& .MuiMenuItem-root.Mui-selected:hover': {
        bgcolor: '#E0E7FF',
      },
    },
  },
}

/* ───────────────── INITIAL STATE ───────────────── */

const initialState = {
  firstName: '',
  middleName: '',
  lastName: '',

  gender: 'MALE',

  dob: '',

  mobile: '',

  email: '',

  occupation: '',

  education: '',

  maritalStatus: 'SINGLE',

  marriageDate: '',

  spouseName: '',

  fatherFirstName: '',
  fatherMiddleName: '',
  fatherLastName: '',

  motherFirstName: '',
  motherLastName: '',

  grandFatherFirstName: '',
  grandFatherMiddleName: '',
  grandFatherLastName: '',

  villageId: '',

  familyId: '',

  relationType: 'SON',

  isAlive: true,

  deathDate: '',

  linkedPersonId: '',

  nativeFamilyRefId: '',

  marriedFamilyRefId: '',

  parentVillageId: '',

  profileImage: null,
}

/* ───────────────── PAGE ───────────────── */

export default function AddMemberPage({
  onBack,
}) {
  const [formData, setFormData] =
    useState(initialState)

  const [loading, setLoading] =
    useState(false)

  const [success, setSuccess] =
    useState(false)

  const [error, setError] =
    useState('')

  /* ───────────────── MAIN FAMILY STATES ───────────────── */

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
    selectedFamily,
    setSelectedFamily,
  ] = useState('')

  /* ───────────────── PARENT FAMILY STATES ───────────────── */

  const [
    parentDistrict,
    setParentDistrict,
  ] = useState('')

  const [
    parentTehsil,
    setParentTehsil,
  ] = useState('')

  const [
    parentVillage,
    setParentVillage,
  ] = useState('')

  const [
    parentFamily,
    setParentFamily,
  ] = useState('')

  const [
    parentMember,
    setParentMember,
  ] = useState('')

  /* ───────────────── SASURAL STATES ───────────────── */

  const [
    sasuralDistrict,
    setSasuralDistrict,
  ] = useState('')

  const [
    sasuralTehsil,
    setSasuralTehsil,
  ] = useState('')

  const [
    sasuralVillage,
    setSasuralVillage,
  ] = useState('')

  const [
    sasuralFamily,
    setSasuralFamily,
  ] = useState('')

  const [
    sasuralMember,
    setSasuralMember,
  ] = useState('')

  /* ───────────────── CONDITIONS ───────────────── */

  const showParentFamily =
    formData.relationType ===
      'MOTHER' ||
    formData.relationType ===
      'SPOUSE'

  const showSasuralFamily =
    [
      'SISTER',
      'DAUGHTER',
      'GRAND_DAUGHTER',
    ].includes(
      formData.relationType
    ) &&
    formData.maritalStatus ===
      'MARRIED'

  /* ───────────────── QUERIES ───────────────── */

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

  const {
    data: familyData,
    isFetching: familyLoading,
  } = useQuery({
    queryKey: [
      'families',
      selectedVillage,
    ],

    queryFn: () =>
      getFamilies(
        selectedVillage
      ),

    enabled: !!selectedVillage,
  })

  const {
    data: memberData,
  } = useQuery({
    queryKey: [
      'members',
      selectedFamily,
    ],

    queryFn: () =>
      getMembers(
        selectedFamily
      ),

    enabled: !!selectedFamily,
  })

  /* ───────────────── PARENT QUERIES ───────────────── */

  const {
    data: parentTehsilData,
  } = useQuery({
    queryKey: [
      'parentTehsil',
      parentDistrict,
    ],

    queryFn: () =>
      getTehsils(
        parentDistrict
      ),

    enabled: !!parentDistrict,
  })

  const {
    data: parentVillageData,
  } = useQuery({
    queryKey: [
      'parentVillage',
      parentDistrict,
      parentTehsil,
    ],

    queryFn: () =>
      getVillages(
        parentDistrict,
        parentTehsil
      ),

    enabled:
      !!parentDistrict &&
      !!parentTehsil,
  })

  const {
    data: parentFamilyData,
  } = useQuery({
    queryKey: [
      'parentFamilies',
      parentVillage,
    ],

    queryFn: () =>
      getFamilies(
        parentVillage
      ),

    enabled: !!parentVillage,
  })

  const {
    data: parentMemberData,
  } = useQuery({
    queryKey: [
      'parentMembers',
      parentFamily,
    ],

    queryFn: () =>
      getMembers(
        parentFamily
      ),

    enabled: !!parentFamily,
  })

  /* ───────────────── SASURAL QUERIES ───────────────── */

  const {
    data: sasuralTehsilData,
  } = useQuery({
    queryKey: [
      'sasuralTehsil',
      sasuralDistrict,
    ],

    queryFn: () =>
      getTehsils(
        sasuralDistrict
      ),

    enabled:
      !!sasuralDistrict,
  })

  const {
    data: sasuralVillageData,
  } = useQuery({
    queryKey: [
      'sasuralVillage',
      sasuralDistrict,
      sasuralTehsil,
    ],

    queryFn: () =>
      getVillages(
        sasuralDistrict,
        sasuralTehsil
      ),

    enabled:
      !!sasuralDistrict &&
      !!sasuralTehsil,
  })

  const {
    data: sasuralFamilyData,
  } = useQuery({
    queryKey: [
      'sasuralFamilies',
      sasuralVillage,
    ],

    queryFn: () =>
      getFamilies(
        sasuralVillage
      ),

    enabled:
      !!sasuralVillage,
  })

  const {
    data: sasuralMemberData,
  } = useQuery({
    queryKey: [
      'sasuralMembers',
      sasuralFamily,
    ],

    queryFn: () =>
      getMembers(
        sasuralFamily
      ),

    enabled:
      !!sasuralFamily,
  })

  /* ───────────────── DATA ───────────────── */

  const districts =
    districtData?.content ?? []

  const tehsils =
    tehsilData?.content ?? []

  const villages =
    villageData?.content ?? []

  const families =
    familyData?.content ?? []

const members = Array.isArray(memberData)
  ? memberData
  : memberData?.content ?? []

  const parentTehsils =
    parentTehsilData?.content ??
    []

  const parentVillages =
    parentVillageData?.content ??
    []

  const parentFamilies =
    parentFamilyData?.content ??
    []
const parentMembers = Array.isArray(parentMemberData)
  ? parentMemberData
  : parentMemberData?.content ?? []


  const sasuralTehsils =
    sasuralTehsilData?.content ??
    []

  const sasuralVillages =
    sasuralVillageData?.content ??
    []

  const sasuralFamilies =
    sasuralFamilyData?.content ??
    []

const sasuralMembers = Array.isArray(sasuralMemberData)
  ? sasuralMemberData
  : sasuralMemberData?.content ?? []

  /* ───────────────── AUTO BIND ───────────────── */

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      familyId: selectedFamily,
      villageId:
        selectedVillage,
    }))
  }, [
    selectedFamily,
    selectedVillage,
  ])

  /* ───────────────── HANDLERS ───────────────── */

  const handleChange = (e) => {
    const { name, value } =
      e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSwitch = (e) => {
    setFormData((prev) => ({
      ...prev,
      isAlive:
        e.target.checked,
    }))
  }

  const handleFile = (e) => {
    setFormData((prev) => ({
      ...prev,
      profileImage:
        e.target.files[0],
    }))
  }

  /* ───────────────── SUBMIT ───────────────── */

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault()

    try {
      setLoading(true)

      const payload =
        new FormData()

      Object.keys(formData).forEach(
        (key) => {
          payload.append(
            key,
            formData[key] ?? ''
          )
        }
      )

      const response =
        await api.post(
          '/admin/person/createMember',
          payload,
          {
            headers: {
              'Content-Type':
                'multipart/form-data',
            },
          }
        )

      console.log(response.data)

      setSuccess(true)

      setFormData(initialState)
    } catch (err) {
      console.error(err)

      setError(
        err?.response?.data
          ?.message ||
          'Failed to create member'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
  sx={{
    minHeight: '100vh',
    bgcolor: '#F1F5F9',
    p: 3,
  }}
>
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
            fontSize: 26,
            fontWeight: 700,
            color: '#1E293B',
          }}
        >
          Add Family Member
        </Typography>

        <Button
  variant="outlined"
  startIcon={<ArrowBackIcon />}
  onClick={onBack}
  sx={{
    borderColor: '#CBD5E1',
    color: '#475569',
    borderRadius: '12px',
    textTransform: 'none',
    px: 2.5,

    '&:hover': {
      borderColor: '#94A3B8',
      bgcolor: '#F8FAFC',
    },
  }}
>
  Back
</Button>
      </Box>

      <Card
  sx={{
    borderRadius: '24px',
    border: '1px solid #E2E8F0',
    bgcolor: '#FFFFFF',
    boxShadow:
      '0 4px 20px rgba(15,23,42,0.05)',
  }}
>
        <CardContent
  sx={{
    p: { xs: 2, md: 3 },
  }}
>
          <form
            onSubmit={
              handleSubmit
            }
          >
            {/* BASIC */}

            <Typography
              sx={{
                fontWeight: 700,
                mb: 3,
                color: '#1E293B',
                fontSize: 18,
              }}
            >
              Basic Information
            </Typography>

            <Grid
              container
              spacing={2}
            >
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={
                    formData.firstName
                  }
                  onChange={
                    handleChange
                  }
                  required
                  sx={inputStyle}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Middle Name"
                  name="middleName"
                  value={
                    formData.middleName
                  }
                  onChange={
                    handleChange
                  }
                  sx={inputStyle}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={
                    formData.lastName
                  }
                  onChange={
                    handleChange
                  }
                  required
                  sx={inputStyle}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Gender"
                  name="gender"
                  value={
                    formData.gender
                  }
                  onChange={
                    handleChange
                  }
                  sx={inputStyle}
                >
                  <MenuItem value="MALE">
                    Male
                  </MenuItem>

                  <MenuItem value="FEMALE">
                    Female
                  </MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="dob"
                  value={
                    formData.dob
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="DD-MM-YYYY"
                  sx={inputStyle}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Relation Type"
                  name="relationType"
                  value={
                    formData.relationType
                  }
                  onChange={
                    handleChange
                  }
                  sx={inputStyle}
                >
                  <MenuItem value="FATHER">
                    Father
                  </MenuItem>

                  <MenuItem value="MOTHER">
                    Mother
                  </MenuItem>

                  <MenuItem value="SON">
                    Son
                  </MenuItem>

                  <MenuItem value="DAUGHTER">
                    Daughter
                  </MenuItem>

                  <MenuItem value="BROTHER">
                    Brother
                  </MenuItem>

                  <MenuItem value="SISTER">
                    Sister
                  </MenuItem>

                  <MenuItem value="SPOUSE">
                    Spouse
                  </MenuItem>

                  <MenuItem value="GRAND_DAUGHTER">
                    Grand Daughter
                  </MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* FAMILY FLOW */}

            <Typography
              sx={{
                fontWeight: 700,
                mb: 3,
                color: '#1E293B',
                fontSize: 18,
              }}
            >
              Family Selection
            </Typography>

            <Grid
              container
              spacing={2}
            >
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  label="District"
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

                    setSelectedFamily(
                      ''
                    )
                  }}
                  sx={inputStyle}
                >
                  {districts.map((d) => (
                    <MenuItem
                      key={d._id}
                      value={d._id}
                    >
                      {d.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Tehsil"
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

                    setSelectedFamily(
                      ''
                    )
                  }}
                  sx={inputStyle}
                >
                  {tehsils.map((t) => (
                    <MenuItem
                      key={t._id}
                      value={t._id}
                    >
                      {t.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={2}>
                <TextField
                  select
                  fullWidth
                  label="Village"
                  value={
                    selectedVillage
                  }
                  onChange={(e) => {
                    setSelectedVillage(
                      e.target.value
                    )

                    setSelectedFamily(
                      ''
                    )
                  }}
                  sx={inputStyle}
                >
                  {villages.map((v) => (
  <MenuItem
    key={v.id}
    value={v.id}
  >
    {v.name}
  </MenuItem>
))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={2}>
                <TextField
                  select
                  fullWidth
                  label="Family"
                  value={
                    selectedFamily
                  }
                  onChange={(e) =>
                    setSelectedFamily(
                      e.target.value
                    )
                  }
                  sx={inputStyle}
                  helperText={
                    selectedVillage &&
                    !familyLoading &&
                    families.length ===
                      0
                      ? 'No families found for selected village'
                      : ''
                  }
                >
                  {familyLoading && (
                    <MenuItem disabled>
                      <CircularProgress
                        size={18}
                      />
                    </MenuItem>
                  )}

                  {families.map((f) => (
                    <MenuItem
                      key={f._id}
                      value={f.familyId}
                    >
                      {f.familyTitle}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>


<Grid item xs={12} md={2}>
  <TextField
    select
    fullWidth
    label="Member"
    name="linkedPersonId"
    value={formData.linkedPersonId}
    onChange={handleChange}
    sx={{
      ...inputStyle,

      '& .MuiSelect-select': {
        display: 'flex',
        alignItems: 'center',
        color: '#0F172A !important',
      },
    }}
    SelectProps={{
      MenuProps: {
        PaperProps: {
          sx: {
            maxHeight: 340,

            mt: 1,

            p: 1,

            borderRadius: '20px',

            bgcolor: '#FFFFFF !important',

            backgroundImage: 'none !important',

            border: '1px solid #E2E8F0',

            boxShadow:
              '0 20px 40px rgba(15,23,42,0.12)',

            '& .MuiMenu-list': {
              p: 0.5,
              bgcolor: '#FFFFFF',
            },

            '& .MuiMenuItem-root': {
              bgcolor: '#FFFFFF !important',
              color: '#0F172A !important',
            },

            '& .MuiMenuItem-root:hover': {
              bgcolor: '#F8FAFC !important',
            },

            '& .MuiMenuItem-root.Mui-selected': {
              bgcolor: '#EEF2FF !important',
            },

            '& .MuiMenuItem-root.Mui-selected:hover': {
              bgcolor: '#E0E7FF !important',
            },
          },
        },
      },
    }}
  >
    {members.map((m) => (
      <MenuItem
        key={m.id}
        value={m.id}
        sx={{
          py: 1.5,

          px: 1.5,

          borderRadius: '16px',

          mb: 1,

          transition: 'all 0.2s ease',

          bgcolor: '#FFFFFF !important',

          color: '#0F172A !important',

          '&:hover': {
            bgcolor: '#F8FAFC !important',
          },

          '&.Mui-selected': {
            bgcolor: '#EEF2FF !important',
          },

          '&.Mui-selected:hover': {
            bgcolor: '#E0E7FF !important',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            width: '100%',
          }}
        >
          <Avatar
            src={m.profileImage}
            alt={m.name}
            sx={{
              width: 44,
              height: 44,

              bgcolor: '#E2E8F0',

              color: '#334155',

              fontSize: 16,

              fontWeight: 700,
            }}
          >
            {m.name?.[0]}
          </Avatar>

          <Typography
            sx={{
              fontSize: 16,

              fontWeight: 600,

              color: '#0F172A !important',
            }}
          >
            {m.name}
          </Typography>
        </Box>
      </MenuItem>
    ))}
  </TextField>
</Grid>
            </Grid>

            {/* PARENT FAMILY */}

            {showParentFamily && (
              <>
                <Divider
                  sx={{ my: 4 }}
                />

                <Typography
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: '#334155',
fontSize: 18,
letterSpacing: '0.3px',
                  }}
                >
                  Parent Family
                  (Optional)
                </Typography>

                <Grid
                  container
                  spacing={2.5}
                >
                  <Grid
                    item
                    xs={12}
                    md={2}
                  >
                    <TextField
                      select
                      fullWidth
                      label="District"
                      value={
                        parentDistrict
                      }
                      onChange={(
                        e
                      ) => {
                        setParentDistrict(
                          e.target
                            .value
                        )

                        setParentTehsil(
                          ''
                        )

                        setParentVillage(
                          ''
                        )

                        setParentFamily(
                          ''
                        )
                      }}
                      sx={
                        inputStyle
                      }
                    >
                      {districts.map(
                        (d) => (
                          <MenuItem
                            key={
                              d._id
                            }
                            value={
                              d._id
                            }
                          >
                            {
                              d.name
                            }
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={2}
                  >
                    <TextField
                      select
                      fullWidth
                      label="Tehsil"
                      value={
                        parentTehsil
                      }
                      onChange={(
                        e
                      ) => {
                        setParentTehsil(
                          e.target
                            .value
                        )

                        setParentVillage(
                          ''
                        )

                        setParentFamily(
                          ''
                        )
                      }}
                      sx={
                        inputStyle
                      }
                    >
                      {parentTehsils.map(
                        (t) => (
                          <MenuItem
                            key={
                              t._id
                            }
                            value={
                              t._id
                            }
                          >
                            {
                              t.name
                            }
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={2}
                  >
                    <TextField
                      select
                      fullWidth
                      label="Village"
                      value={
                        parentVillage
                      }
                      onChange={(
                        e
                      ) => {
                        setParentVillage(
                          e.target
                            .value
                        )

                        setParentFamily(
                          ''
                        )

                        setFormData(
                          (
                            prev
                          ) => ({
                            ...prev,
                            parentVillageId:
                              e
                                .target
                                .value,
                          })
                        )
                      }}
                      sx={
                        inputStyle
                      }
                    >
                      {parentVillages.map(
                        (v) => (
                          <MenuItem
                            key={
                              v.id
                            }
                            value={
                              v.id
                            }
                          >
                            {
                              v.name
                            }
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={3}
                  >
                    <TextField
                      select
                      fullWidth
                      label="Parent Family"
                      value={
                        parentFamily
                      }
                      onChange={(
                        e
                      ) => {
                        setParentFamily(
                          e.target
                            .value
                        )

                        setFormData(
                          (
                            prev
                          ) => ({
                            ...prev,
                            nativeFamilyRefId:
                              e
                                .target
                                .value,
                          })
                        )
                      }}
                      sx={
                        inputStyle
                      }
                    >
                      {parentFamilies.map(
                        (f) => (
                          <MenuItem
                            key={
                              f._id
                            }
                            value={
                              f.familyId
                            }
                          >
                            {
                              f.familyTitle
                            }
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={3}
                  >
                    <TextField
                      select
                      fullWidth
                      label="Parent Member"
                      value={
                        parentMember
                      }
                      onChange={(
                        e
                      ) => {
                        setParentMember(
                          e.target
                            .value
                        )

                        setFormData(
                          (
                            prev
                          ) => ({
                            ...prev,
                            linkedPersonId:
                              e
                                .target
                                .value,
                          })
                        )
                      }}
                      sx={
                        inputStyle
                      }
                    >
    {members.map((m) => (
      <MenuItem
        key={m.id}
        value={m.id}
        sx={{
          py: 1.5,

          px: 1.5,

          borderRadius: '16px',

          mb: 1,

          transition: 'all 0.2s ease',

          bgcolor: '#FFFFFF !important',

          color: '#0F172A !important',

          '&:hover': {
            bgcolor: '#F8FAFC !important',
          },

          '&.Mui-selected': {
            bgcolor: '#EEF2FF !important',
          },

          '&.Mui-selected:hover': {
            bgcolor: '#E0E7FF !important',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            width: '100%',
          }}
        >
          <Avatar
            src={m.profileImage}
            alt={m.name}
            sx={{
              width: 44,
              height: 44,

              bgcolor: '#E2E8F0',

              color: '#334155',

              fontSize: 16,

              fontWeight: 700,
            }}
          >
            {m.name?.[0]}
          </Avatar>

          <Typography
            sx={{
              fontSize: 16,

              fontWeight: 600,

              color: '#0F172A !important',
            }}
          >
            {m.name}
          </Typography>
        </Box>
      </MenuItem>
    ))}
                    </TextField>
                  </Grid>
                </Grid>
              </>
            )}

            {/* SASURAL */}

            {showSasuralFamily && (
              <>
                <Divider
                  sx={{ my: 4 }}
                />

                <Typography
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: '#334155',
fontSize: 18,
letterSpacing: '0.3px',
                  }}
                >
                  Sasural Family
                  (Optional)
                </Typography>

                <Grid
                  container
                  spacing={2}
                >
                  <Grid
                    item
                    xs={12}
                    md={2}
                  >
                    <TextField
                      select
                      fullWidth
                      label="District"
                      value={
                        sasuralDistrict
                      }
                      onChange={(
                        e
                      ) => {
                        setSasuralDistrict(
                          e.target
                            .value
                        )

                        setSasuralTehsil(
                          ''
                        )

                        setSasuralVillage(
                          ''
                        )

                        setSasuralFamily(
                          ''
                        )
                      }}
                      sx={
                        inputStyle
                      }
                    >
                      {districts.map(
                        (d) => (
                          <MenuItem
                            key={
                              d._id
                            }
                            value={
                              d._id
                            }
                          >
                            {
                              d.name
                            }
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={2}
                  >
                    <TextField
                      select
                      fullWidth
                      label="Tehsil"
                      value={
                        sasuralTehsil
                      }
                      onChange={(
                        e
                      ) => {
                        setSasuralTehsil(
                          e.target
                            .value
                        )

                        setSasuralVillage(
                          ''
                        )

                        setSasuralFamily(
                          ''
                        )
                      }}
                      sx={
                        inputStyle
                      }
                    >
                      {sasuralTehsils.map(
                        (t) => (
                          <MenuItem
                            key={
                              t._id
                            }
                            value={
                              t._id
                            }
                          >
                            {
                              t.name
                            }
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={2}
                  >
                    <TextField
                      select
                      fullWidth
                      label="Village"
                      value={
                        sasuralVillage
                      }
                      onChange={(
                        e
                      ) =>
                        setSasuralVillage(
                          e.target
                            .value
                        )
                      }
                      sx={
                        inputStyle
                      }
                    >
                      {sasuralVillages.map(
                        (v) => (
                          <MenuItem
                            key={
                              v.id
                            }
                            value={
                              v.id
                            }
                          >
                            {
                              v.name
                            }
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={3}
                  >
                    <TextField
                      select
                      fullWidth
                      label="Sasural Family"
                      value={
                        sasuralFamily
                      }
                      onChange={(
                        e
                      ) => {
                        setSasuralFamily(
                          e.target
                            .value
                        )

                        setFormData(
                          (
                            prev
                          ) => ({
                            ...prev,
                            marriedFamilyRefId:
                              e
                                .target
                                .value,
                          })
                        )
                      }}
                      sx={
                        inputStyle
                      }
                    >
                      {sasuralFamilies.map(
                        (f) => (
                          <MenuItem
                            key={
                              f._id
                            }
                            value={
                              f.familyId
                            }
                          >
                            {
                              f.familyTitle
                            }
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={3}
                  >
                    <TextField
                      select
                      fullWidth
                      label="Husband / Wife"
                      value={
                        sasuralMember
                      }
                      onChange={(
                        e
                      ) => {
                        setSasuralMember(
                          e.target
                            .value
                        )

                        setFormData(
                          (
                            prev
                          ) => ({
                            ...prev,
                            linkedPersonId:
                              e
                                .target
                                .value,
                          })
                        )
                      }}
                      sx={
                        inputStyle
                      }
                    >
    {members.map((m) => (
      <MenuItem
        key={m.id}
        value={m.id}
        sx={{
          py: 1.5,

          px: 1.5,

          borderRadius: '16px',

          mb: 1,

          transition: 'all 0.2s ease',

          bgcolor: '#FFFFFF !important',

          color: '#0F172A !important',

          '&:hover': {
            bgcolor: '#F8FAFC !important',
          },

          '&.Mui-selected': {
            bgcolor: '#EEF2FF !important',
          },

          '&.Mui-selected:hover': {
            bgcolor: '#E0E7FF !important',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            width: '100%',
          }}
        >
          <Avatar
            src={m.profileImage}
            alt={m.name}
            sx={{
              width: 44,
              height: 44,

              bgcolor: '#E2E8F0',

              color: '#334155',

              fontSize: 16,

              fontWeight: 700,
            }}
          >
            {m.name?.[0]}
          </Avatar>

          <Typography
            sx={{
              fontSize: 16,

              fontWeight: 600,

              color: '#0F172A !important',
            }}
          >
            {m.name}
          </Typography>
        </Box>
      </MenuItem>
    ))}
                    </TextField>
                  </Grid>
                </Grid>
              </>
            )}

            <Divider sx={{ my: 4 }} />

            {/* OTHER DETAILS */}

            <Typography
              sx={{
                fontWeight: 700,
                mb: 3,
                color: '#1E293B',
                fontSize: 18,
              }}
            >
              Other Details
            </Typography>

            <Grid
              container
              spacing={2}
            >
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Mobile"
                  name="mobile"
                  value={
                    formData.mobile
                  }
                  onChange={
                    handleChange
                  }
                  sx={inputStyle}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                  sx={inputStyle}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Occupation"
                  name="occupation"
                  value={
                    formData.occupation
                  }
                  onChange={
                    handleChange
                  }
                  sx={inputStyle}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Education"
                  name="education"
                  value={
                    formData.education
                  }
                  onChange={
                    handleChange
                  }
                  sx={inputStyle}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Marital Status"
                  name="maritalStatus"
                  value={
                    formData.maritalStatus
                  }
                  onChange={
                    handleChange
                  }
                  sx={inputStyle}
                >
                  <MenuItem value="SINGLE">
                    Single
                  </MenuItem>

                  <MenuItem value="MARRIED">
                    Married
                  </MenuItem>

                  <MenuItem value="WIDOWER">
                    Widower
                  </MenuItem>

                  <MenuItem value="DIVORCED">
                    Divorced
                  </MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Marriage Date"
                  name="marriageDate"
                  value={
                    formData.marriageDate
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="DD-MM-YYYY"
                  sx={inputStyle}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Spouse Name"
                  name="spouseName"
                  value={
                    formData.spouseName
                  }
                  onChange={
                    handleChange
                  }
                  sx={inputStyle}
                />
              </Grid>

<Grid item xs={12}>
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 3,

      p: 2.5,

      border: '1px solid #E2E8F0',

      borderRadius: '20px',

      bgcolor: '#FFFFFF',
    }}
  >
    <Box
      sx={{
        position: 'relative',
        width: 92,
        height: 92,
        flexShrink: 0,
      }}
    >
      <Avatar
        src={
          formData.profileImage
            ? URL.createObjectURL(
                formData.profileImage
              )
            : ''
        }
        sx={{
          width: 92,
          height: 92,

          bgcolor: '#E2E8F0',

          color: '#475569',

          fontSize: 30,

          fontWeight: 700,
        }}
      >
        {formData.firstName?.[0] ||
          'U'}
      </Avatar>

      <IconButton
        component="label"
        size="small"
        sx={{
          position: 'absolute',

          bottom: -2,

          right: -2,

          width: 34,

          height: 34,

          bgcolor: '#FFFFFF',

          border:
            '1px solid #CBD5E1',

          boxShadow:
            '0 4px 10px rgba(0,0,0,0.08)',

          '&:hover': {
            bgcolor: '#F8FAFC',
          },
        }}
      >
        <EditIcon
          sx={{
            fontSize: 18,
            color: '#475569',
          }}
        />

        <input
          hidden
          type="file"
          accept="image/*"
          onChange={handleFile}
        />
      </IconButton>
    </Box>

    <Box>
      <Typography
        sx={{
          fontWeight: 700,
          color: '#0F172A',
          fontSize: 16,
          mb: 0.5,
        }}
      >
        Profile Photo
      </Typography>

      <Typography
        sx={{
          color: '#64748B',
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        Upload member image for
        better identification
      </Typography>
    </Box>
  </Box>
</Grid>

<Grid item xs={12}>
  <Box
    sx={{
      display: 'flex',

      alignItems: 'center',

      justifyContent:
        'space-between',

      border:
        '1px solid #E2E8F0',

      borderRadius: '20px',

      px: 3,

      py: 2.2,

      bgcolor: '#FFFFFF',
    }}
  >
    <Box>
      <Typography
        sx={{
          fontWeight: 700,

          color: '#0F172A',

          fontSize: 16,

          mb: 0.4,
        }}
      >
        Member Status
      </Typography>

      <Typography
        sx={{
          color: '#64748B',

          fontSize: 13,
        }}
      >
        Enable if the member is
        alive
      </Typography>
    </Box>

    <Stack
      direction="row"
      spacing={1.2}
      alignItems="center"
    >
      <Typography
        sx={{
          fontWeight: 600,

          color: formData.isAlive
            ? '#16A34A'
            : '#DC2626',

          fontSize: 14,
        }}
      >
        {formData.isAlive
          ? 'Alive'
          : 'Deceased'}
      </Typography>

      <Switch
        checked={formData.isAlive}
        onChange={handleSwitch}
      />
    </Stack>
  </Box>
</Grid>

              {!formData.isAlive && (
                <Grid
                  item
                  xs={12}
                  md={6}
                >
                  <TextField
                    fullWidth
                    label="Death Date"
                    name="deathDate"
                    value={
                      formData.deathDate
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="DD-MM-YYYY"
                    sx={inputStyle}
                  />
                </Grid>
              )}
            </Grid>

<Box
  sx={{
    display: 'flex',

    justifyContent: 'flex-end',

    mt: 5,
  }}
>
  <Button
    type="submit"
    variant="contained"
    startIcon={<SaveIcon />}
    disabled={loading}
    sx={{
      minWidth: 190,

      height: 52,

      bgcolor: '#0F172A',

      color: '#FFFFFF',

      borderRadius: '14px',

      textTransform: 'none',

      fontSize: 15,

      fontWeight: 700,

      px: 4,

      boxShadow:
        '0 10px 25px rgba(15,23,42,0.12)',

      '&:hover': {
        bgcolor: '#1E293B',

        boxShadow:
          '0 14px 30px rgba(15,23,42,0.18)',
      },
    }}
  >
    {loading
      ? 'Saving...'
      : 'Create Member'}
  </Button>
</Box>
          </form>
        </CardContent>
      </Card>

      {/* SUCCESS */}

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() =>
          setSuccess(false)
        }
      >
        <Alert severity="success">
          Member created
          successfully
        </Alert>
      </Snackbar>

      {/* ERROR */}

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() =>
          setError('')
        }
      >
        <Alert severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
}
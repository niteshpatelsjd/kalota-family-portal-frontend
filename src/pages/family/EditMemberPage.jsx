// src/pages/family/EditMemberPage.jsx

import { useEffect, useMemo, useState } from 'react'

import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'

import {
  Dialog,
  DialogContent,
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
  Switch,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material'

import SaveIcon from '@mui/icons-material/Save'

import { useQuery } from '@tanstack/react-query'

import api from '../../api/axiosInstance'

/* ───────────────── API ───────────────── */

const getDistricts = () =>
  api
    .get('/admin/district/getAllDistrict', {
      params: {
        pageIndex: 0,
        pageSize: 200,
        status: 1,
      },
    })
    .then((r) => r.data.responseBody)

const getTehsils = (districtId) =>
  api
    .get('/admin/tehsil/getAllTehsil', {
      params: {
        pageIndex: 0,
        pageSize: 200,
        status: 1,
        districtId,
      },
    })
    .then((r) => r.data.responseBody)

const getVillages = (
  districtId,
  tehsilId
) =>
  api
    .get('/admin/village/getAllVillage', {
      params: {
        pageIndex: 0,
        pageSize: 200,
        status: 1,
        districtId,
        tehsilId,
      },
    })
    .then((r) => r.data.responseBody)

const getFamilies = (villageId) =>
  api
    .get('/admin/family/getAllFamilies', {
      params: {
        pageIndex: 0,
        pageSize: 500,
        villageId,
      },
    })
    .then((r) => r.data.responseBody)

const getMembers = (familyId) =>
  api
    .get('/admin/person/getPersonsByFamily', {
      params: {
        familyId,
      },
    })
    .then((r) => r.data.responseBody)

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

/* ───────────────── COMPONENT ───────────────── */

export default function EditMemberPage({
  open,
  onClose,
  member,
  onSuccess,
}) {
  const [loading, setLoading] =
    useState(false)

  const [success, setSuccess] =
    useState(false)

  const [error, setError] =
    useState('')

const [
  selectedParentDistrict,
  setSelectedParentDistrict,
] = useState('')

const [
  selectedParentTehsil,
  setSelectedParentTehsil,
] = useState('')

const [
  selectedParentVillage,
  setSelectedParentVillage,
] = useState('')

const [
  selectedParentFamily,
  setSelectedParentFamily,
] = useState('')



  const [formData, setFormData] =
    useState({
      personId: '',
      parentFamilyId: '',
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

      villageId: '',

      familyId: '',

      relationType: 'SON',

      isAlive: true,

      deathDate: '',

      linkedPersonId: '',

      profileImage: null,
    })

  /* ───────────────── STATES ───────────────── */

  const { data: parentTehsilData } =
  useQuery({
    queryKey: [
      'parentTehsils',
      selectedParentDistrict,
    ],

    queryFn: () =>
      getTehsils(
        selectedParentDistrict
      ),

    enabled:
      !!selectedParentDistrict,
  })

const { data: parentVillageData } =
  useQuery({
    queryKey: [
      'parentVillages',
      selectedParentDistrict,
      selectedParentTehsil,
    ],

    queryFn: () =>
      getVillages(
        selectedParentDistrict,
        selectedParentTehsil
      ),

    enabled:
      !!selectedParentDistrict &&
      !!selectedParentTehsil,
  })

const { data: parentFamilyData } =
  useQuery({
    queryKey: [
      'parentFamilies',
      selectedParentVillage,
    ],

    queryFn: () =>
      getFamilies(
        selectedParentVillage
      ),

    enabled:
      !!selectedParentVillage,
  })

const { data: parentMemberData } =
  useQuery({
    queryKey: [
      'parentMembers',
      selectedParentFamily,
    ],

    queryFn: () =>
      getMembers(
        selectedParentFamily
      ),

    enabled:
      !!selectedParentFamily,
  })


const parentTehsils =
  parentTehsilData?.content ?? []

const parentVillages =
  parentVillageData?.content ?? []

const parentFamilies =
  parentFamilyData?.content ?? []


const parentMembers = Array.isArray(
  parentMemberData
)
  ? parentMemberData
  : parentMemberData?.content ?? []
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

  /* ───────────────── QUERIES ───────────────── */

  const { data: districtData } =
    useQuery({
      queryKey: ['districts'],
      queryFn: getDistricts,
    })

  const { data: tehsilData } =
    useQuery({
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

  const { data: villageData } =
    useQuery({
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

  const { data: memberData } =
    useQuery({
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

  /* ───────────────── DATA ───────────────── */

  const districts =
    districtData?.content ?? []

  const tehsils =
    tehsilData?.content ?? []

  const villages =
    villageData?.content ?? []

  const families =
    familyData?.content ?? []

  const members = Array.isArray(
    memberData
  )
    ? memberData
    : memberData?.content ?? []

  /* ───────────────── PREFILL ───────────────── */

useEffect(() => {
  if (!member) return

  setFormData({
    personId: member?._id || '',
    parentFamilyId: member?.parentFamilyId || '',
    firstName: member?.firstName || '',
    middleName: member?.middleName || '',
    lastName: member?.lastName || '',
    gender: member?.gender || 'MALE',
    dob: member?.dob || '',
    mobile: member?.mobile || '',
    email: member?.email || '',
    occupation: member?.occupation || '',
    education: member?.education || '',
    maritalStatus:
      member?.maritalStatus || 'SINGLE',
    marriageDate:
      member?.marriageDate || '',
    spouseName: member?.spouseName || '',
    relationType:
      member?.relationType || 'SON',
    familyId: member?.familyId || '',
    villageId: member?.villageId || '',
    linkedPersonId:
      member?.linkedPersonId || '',
    isAlive: member?.isAlive ?? true,
    deathDate: member?.deathDate || '',
    profileImage: null,
  })

  setSelectedDistrict(
    member?.districtId || ''
  )

  setSelectedTehsil(
    member?.tehsilId || ''
  )

  setSelectedVillage(
    member?.villageId || ''
  )

  setSelectedFamily(
    member?.familyId || ''
  )

  
}, [member])
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

  /* ───────────────── IMAGE PREVIEW ───────────────── */

const [previewImage, setPreviewImage] =
  useState('')

useEffect(() => {
  if (!formData.profileImage) {
    setPreviewImage(
      member?.profileImage || ''
    )
    return
  }

  const objectUrl =
    URL.createObjectURL(
      formData.profileImage
    )

  setPreviewImage(objectUrl)

  return () =>
    URL.revokeObjectURL(objectUrl)
}, [formData.profileImage, member])
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
    const checked =
      e.target.checked

    setFormData((prev) => ({
      ...prev,
      isAlive: checked,

      // clear death date if alive
      deathDate: checked
        ? ''
        : prev.deathDate,
    }))
  }

  const handleFile = (e) => {
    const file =
      e.target.files?.[0]

    if (!file) return

    setFormData((prev) => ({
      ...prev,
      profileImage: file,
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

      Object.entries(
        formData
      ).forEach(
        ([key, value]) => {
          // skip empty profile image
          if (
            key ===
              'profileImage' &&
            !value
          ) {
            return
          }

          payload.append(
            key,
            value ?? ''
          )
        }
      )

      await api.put(
        '/admin/person/updateProfile',
        payload,
        {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },
        }
      )

      setSuccess(true)

      onSuccess?.()

      setTimeout(() => {
        onClose?.()
      }, 1000)
    } catch (err) {
      console.error(err)

      setError(
        err?.response?.data
          ?.message ||
          'Failed to update member'
      )
    } finally {
      setLoading(false)
    }
  }

const showParentFamilySection =
  formData.relationType ===
    'MOTHER' ||
  formData.relationType ===
    'SPOUSE'

const showSasuralSection =
  (
    [
      'SISTER',
      'DAUGHTER',
      'GRAND_DAUGHTER',
    ].includes(
      formData.relationType
    ) &&
    formData.maritalStatus ===
      'MARRIED'
  )
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
    >
      <DialogContent
        sx={{
          bgcolor: '#F1F5F9',
          p: 3,
        }}
      >
        <Card
          sx={{
            borderRadius: '24px',
            border:
              '1px solid #E2E8F0',
            bgcolor: '#FFFFFF',
            boxShadow:
              '0 4px 20px rgba(15,23,42,0.05)',
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 2,
                md: 3,
              },
            }}
          >
            <Box
  sx={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 4,
  }}
>
  <Typography
    sx={{
      fontSize: 26,
      fontWeight: 700,
      color: '#1E293B',
    }}
  >
    Edit Member
  </Typography>

  <Button
    variant="outlined"
    onClick={onClose}
    sx={{
      borderRadius: '12px',
      textTransform: 'none',
      fontWeight: 600,
      borderColor: '#CBD5E1',
      color: '#334155',
      px: 2.5,

      '&:hover': {
        borderColor: '#94A3B8',
        bgcolor: '#F8FAFC',
      },
    }}
  >
    Close
  </Button>
</Box>

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
                      formData.firstName
                    }
                    onChange={
                      handleChange
                    }
                    sx={inputStyle}
                  />
                </Grid>

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
                      formData.middleName
                    }
                    onChange={
                      handleChange
                    }
                    sx={inputStyle}
                  />
                </Grid>

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
                      formData.lastName
                    }
                    onChange={
                      handleChange
                    }
                    sx={inputStyle}
                  />
                </Grid>

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

                <Grid
                  item
                  xs={12}
                  md={4}
                >
                  <TextField
                    fullWidth
                    type="date"
                    label="Date of Birth"
                    name="dob"
                    value={
                      formData.dob
                    }
                    onChange={
                      handleChange
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={inputStyle}
                  />
                </Grid>

                {/* RELATION TYPE */}

<Grid
  item
  xs={12}
  md={4}
>
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
    <MenuItem value="WIDOW">
      Widower
    </MenuItem>
    <MenuItem value="WIDOWER">
      Widower
    </MenuItem>

    <MenuItem value="DIVORCED">
      Divorced
    </MenuItem>
  </TextField>
</Grid>

{/* MARRIAGE DATE */}

{formData.maritalStatus !==
  'SINGLE' && (
  <Grid
    item
    xs={12}
    md={4}
  >
    <TextField
      fullWidth
      type="date"
      label="Marriage Date"
      name="marriageDate"
      value={
        formData.marriageDate
      }
      onChange={
        handleChange
      }
      InputLabelProps={{
        shrink: true,
      }}
      sx={inputStyle}
    />
  </Grid>
)}

              </Grid>

              <Divider sx={{ my: 4 }} />

              {/* FAMILY */}

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

  
<Grid container spacing={2}>

  {/* DISTRICT */}

  <Grid item xs={12} sm={6} md={2.4}>
    <TextField
      select
      fullWidth
      label="District"
      value={selectedDistrict || ''}
      onChange={(e) => {

        setSelectedDistrict(
          e.target.value
        )

        setSelectedTehsil('')
        setSelectedVillage('')
        setSelectedFamily('')

      }}
      InputLabelProps={{
        shrink: true,
      }}
      sx={inputStyle}
    >

      <MenuItem value="">
        Select District
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
  </Grid>

  {/* TEHSIL */}

  <Grid item xs={12} sm={6} md={2.4}>
    <TextField
      select
      fullWidth
      label="Tehsil"
      value={selectedTehsil || ''}
      onChange={(e) => {

        setSelectedTehsil(
          e.target.value
        )

        setSelectedVillage('')
        setSelectedFamily('')

      }}
      InputLabelProps={{
        shrink: true,
      }}
      sx={inputStyle}
    >

      <MenuItem value="">
        Select Tehsil
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
  </Grid>

  {/* VILLAGE */}

  <Grid item xs={12} sm={6} md={2.4}>
    <TextField
      select
      fullWidth
      label="Village"
      value={selectedVillage || ''}
      onChange={(e) => {

        setSelectedVillage(
          e.target.value
        )

        setSelectedFamily('')

      }}
      InputLabelProps={{
        shrink: true,
      }}
      sx={inputStyle}
    >

      <MenuItem value="">
        Select Village
      </MenuItem>

      {villages.map((v) => (
        <MenuItem
          key={v.id || v._id}
          value={v.id || v._id}
        >
          {v.name}
        </MenuItem>
      ))}

    </TextField>
  </Grid>

  {/* FAMILY */}

  <Grid item xs={12} sm={6} md={2.4}>
    <TextField
      select
      fullWidth
      label="Family"
      value={selectedFamily || ''}
      onChange={(e) => {

        setSelectedFamily(
          e.target.value
        )

      }}
      InputLabelProps={{
        shrink: true,
      }}
      sx={inputStyle}
    >

      <MenuItem value="">
        Select Family
      </MenuItem>

      {families.map((f) => (
        <MenuItem
          key={f.familyId}
          value={f.familyId}
        >
          {f.familyTitle}
        </MenuItem>
      ))}

    </TextField>
  </Grid>

  {/* MEMBER */}

  <Grid item xs={12} sm={6} md={2.4}>
    <TextField
      select
      fullWidth
      label="Family Member"
      name="linkedPersonId"
      value={
        formData.linkedPersonId || ''
      }
      onChange={handleChange}
      InputLabelProps={{
        shrink: true,
      }}
      sx={inputStyle}
    >

      <MenuItem value="">
        Select Member
      </MenuItem>

      {members.map((m) => (
        <MenuItem
          key={m.id}
          value={m.id}
        >
          {m.name}
        </MenuItem>
      ))}

    </TextField>
  </Grid>

</Grid>


{(
  showParentFamilySection ||
  showSasuralSection
) && (
  <Box sx={{ mt: 4 }}>

    <Typography
      sx={{
        fontWeight: 700,
        mb: 3,
        color: '#1E293B',
        fontSize: 18,
      }}
    >
      {showSasuralSection
        ? 'Sasural Family Selection'
        : 'Parent Family Selection'}
    </Typography>

    <Grid container spacing={2}>

      {/* DISTRICT */}

      <Grid item xs={12} md={3}>
        <TextField
          select
          fullWidth
          label={
            showSasuralSection
              ? 'Sasural District'
              : 'Parent District'
          }
          value={selectedParentDistrict}
          onChange={(e) => {

            setSelectedParentDistrict(
              e.target.value
            )

            setSelectedParentTehsil('')
            setSelectedParentVillage('')
            setSelectedParentFamily('')

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

      {/* TEHSIL */}

      <Grid item xs={12} md={3}>
        <TextField
          select
          fullWidth
          label={
            showSasuralSection
              ? 'Sasural Tehsil'
              : 'Parent Tehsil'
          }
          value={selectedParentTehsil}
          onChange={(e) => {

            setSelectedParentTehsil(
              e.target.value
            )

            setSelectedParentVillage('')
            setSelectedParentFamily('')

          }}
          sx={inputStyle}
        >
          {parentTehsils.map((t) => (
            <MenuItem
              key={t._id}
              value={t._id}
            >
              {t.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      {/* VILLAGE */}

      <Grid item xs={12} md={2}>
        <TextField
          select
          fullWidth
          label={
            showSasuralSection
              ? 'Sasural Village'
              : 'Parent Village'
          }
          value={selectedParentVillage}
          onChange={(e) => {

            setSelectedParentVillage(
              e.target.value
            )

            setSelectedParentFamily('')

          }}
          sx={inputStyle}
        >
          {parentVillages.map((v) => (
            <MenuItem
              key={v._id || v.id}
              value={v._id || v.id}
            >
              {v.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      {/* FAMILY */}

      <Grid item xs={12} md={2}>
        <TextField
          select
          fullWidth
          label={
            showSasuralSection
              ? 'Sasural Family'
              : 'Parent Family'
          }
          value={selectedParentFamily}
          onChange={(e) => {

            setSelectedParentFamily(
              e.target.value
            )

            setFormData((prev) => ({
              ...prev,
              parentFamilyId:
                e.target.value,
            }))

          }}
          sx={inputStyle}
        >
          {parentFamilies.map((f) => (
            <MenuItem
              key={f.familyId}
              value={f.familyId}
            >
              {f.familyTitle}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      {/* MEMBER */}

      <Grid item xs={12} md={2}>
        <TextField
          select
          fullWidth
          label={
            showSasuralSection
              ? 'Sasural Member'
              : 'Parent Member'
          }
          name="linkedPersonId"
          value={formData.linkedPersonId}
          onChange={handleChange}
          sx={inputStyle}
        >
          {parentMembers.map((m) => (
            <MenuItem
              key={m.id}
              value={m.id}
            >
              {m.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

    </Grid>
  </Box>
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
                      formData.mobile
                    }
                    onChange={
                      handleChange
                    }
                    sx={inputStyle}
                  />
                </Grid>

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
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    sx={inputStyle}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={4}
                >
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

                <Grid
                  item
                  xs={12}
                  md={4}
                >
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

              

                {/* PROFILE */}

                <Grid item xs={12}>
                  <Box
                    sx={{
                      display:
                        'flex',

                      alignItems:
                        'center',

                      gap: 3,

                      p: 2.5,

                      border:
                        '1px solid #E2E8F0',

                      borderRadius:
                        '20px',

                      bgcolor:
                        '#FFFFFF',
                    }}
                  >
                    <Box
                      sx={{
                        position:
                          'relative',

                        width: 92,

                        height: 92,

                        flexShrink: 0,
                      }}
                    >
                      <Avatar
                        src={
                          previewImage
                        }
                        sx={{
                          width: 92,
                          height: 92,

                          bgcolor:
                            '#E2E8F0',

                          color:
                            '#475569',

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
                          position:
                            'absolute',

                          bottom: -2,

                          right: -2,

                          width: 34,

                          height: 34,

                          bgcolor:
                            '#FFFFFF',

                          border:
                            '1px solid #CBD5E1',

                          boxShadow:
                            '0 4px 10px rgba(0,0,0,0.08)',

                          '&:hover':
                            {
                              bgcolor:
                                '#F8FAFC',
                            },
                        }}
                      >
                        <EditIcon
                          sx={{
                            fontSize: 18,
                            color:
                              '#475569',
                          }}
                        />

                        <input
                          hidden
                          type="file"
                          accept="image/*"
                          onChange={
                            handleFile
                          }
                        />
                      </IconButton>
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color:
                            '#0F172A',
                          fontSize: 16,
                          mb: 0.5,
                        }}
                      >
                        Update Profile
                        Photo
                      </Typography>

                      <Typography
                        sx={{
                          color:
                            '#64748B',
                          fontSize: 13,
                          lineHeight: 1.6,
                        }}
                      >
                        Upload member
                        image for
                        better
                        identification
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* MEMBER STATUS */}

                <Grid item xs={12}>
                  <Box
                    sx={{
                      display:
                        'flex',

                      alignItems:
                        'center',

                      justifyContent:
                        'space-between',

                      border:
                        '1px solid #E2E8F0',

                      borderRadius:
                        '20px',

                      px: 3,

                      py: 2.2,

                      bgcolor:
                        '#FFFFFF',
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 700,

                          color:
                            '#0F172A',

                          fontSize: 16,

                          mb: 0.4,
                        }}
                      >
                        Life Status
                      </Typography>

                      <Typography
                        sx={{
                          color:
                            '#64748B',

                          fontSize: 13,
                        }}
                      >
                        Toggle member
                        alive/deceased
                        status
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

                          color:
                            formData.isAlive
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
                        checked={
                          formData.isAlive
                        }
                        onChange={
                          handleSwitch
                        }
                      />
                    </Stack>
                  </Box>
                </Grid>

                {/* DEATH DATE */}

                {!formData.isAlive && (
                  <Grid
                    item
                    xs={12}
                    md={6}
                  >
                    <TextField
                      fullWidth
                      type="date"
                      label="Death Date"
                      name="deathDate"
                      value={
                        formData.deathDate
                      }
                      onChange={
                        handleChange
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={inputStyle}
                    />
                  </Grid>
                )}
              </Grid>

              {/* UPDATE BUTTON */}

              <Box
                sx={{
                  display: 'flex',

                  justifyContent:
                    'flex-end',

                  mt: 5,
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={
                    loading ? (
                      <CircularProgress
                        size={18}
                        color="inherit"
                      />
                    ) : (
                      <SaveIcon />
                    )
                  }
                  disabled={loading}
                  sx={{
                    minWidth: 220,

                    height: 52,

                    bgcolor:
                      '#0F172A',

                    color:
                      '#FFFFFF',

                    borderRadius:
                      '14px',

                    textTransform:
                      'none',

                    fontSize: 15,

                    fontWeight: 700,

                    px: 4,

                    boxShadow:
                      '0 10px 25px rgba(15,23,42,0.12)',

                    '&:hover': {
                      bgcolor:
                        '#1E293B',

                      boxShadow:
                        '0 14px 30px rgba(15,23,42,0.18)',
                    },

                    '&.Mui-disabled':
                      {
                        bgcolor:
                          '#94A3B8',
                        color:
                          '#FFFFFF',
                      },
                  }}
                >
                  {loading
                    ? 'Updating Member...'
                    : 'Update Member'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>

        <Snackbar
          open={success}
          autoHideDuration={3000}
          onClose={() =>
            setSuccess(false)
          }
        >
          <Alert severity="success">
            Member updated
            successfully
          </Alert>
        </Snackbar>

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
      </DialogContent>
    </Dialog>
  )
}
import {
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
  Paper,
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom'

import { useForm, useFieldArray } from 'react-hook-form'

import toast from 'react-hot-toast' 
import { useMutation } from '@tanstack/react-query' 
import { createFamily } from '../services/familyApi'



const locationData = {
  Dewas: {
    Tonkkhurd: [
      'Piplayasadak',
      'Jamgod',
      'Balon',
    ],

    Sonkatch: [
      'Sonkatch',
      'Bhawarna',
    ],
  },

  Indore: {
    Sanwer: [
      'Hatod',
      'Mangliya',
    ],

    Depalpur: [
      'Depalpur',
      'Betma',
    ],
  },

  Ujjain: {
    Ujjain: [
      'Makdon',
      'Badnagar',
    ],
  },
}

export default function CreateFamilyDrawer({
  open,
  onClose,
  onSuccess,
}) {


const {
  mutate,
  isPending,
} = useMutation({
  mutationFn: createFamily,

  onSuccess: () => {
    toast.success(
      'Family created successfully'
    )

    reset()

    onSuccess?.()

    onClose()
  },

  onError: (error) => {
    toast.error(
      error?.response?.data
        ?.message ||
        'Failed to create family'
    )
  },
})


const {
  register,
  watch,
  control,
  handleSubmit,
  reset,
  setValue,
  formState: { errors },
} = useForm({
  defaultValues: {
    name: '',
    mobileNumber: '',
    gender: 'MALE',
    dob: new Date()
      .toISOString()
      .split('T')[0],

    fatherName: '',
    motherName: '',
    grandFatherName: '',
    occupation: '',
    education: '',
    district: '',
    tehsil: '',
    village: '',
    email: '',

    isMarried: 'true',

    spouses: [
      {
        name: '',
        fatherName: '',
        district: '',
        tehsil: '',
        village: '',
      },
    ],

    children: [],
  },
})

const {
  fields: spouseFields,
} = useFieldArray({
  control,
  name: 'spouses',
})

const selectedDistrict =
  watch('district')

const selectedTehsil =
  watch('tehsil')

const tehsilOptions =
  selectedDistrict
    ? Object.keys(
        locationData[
          selectedDistrict
        ] || {}
      )
    : []

const villageOptions =
  selectedDistrict &&
  selectedTehsil
    ? locationData[
        selectedDistrict
      ]?.[selectedTehsil] || []
    : []


const {
  fields: childFields,
  append: addChild,
  remove: removeChild,
} = useFieldArray({
  control,
  name: 'children',
})

const onSubmit = (values) => {
  mutate({
    familyId: '',

    headProfile: {
      name: values.name,
      dob: values.dob,
      gender: values.gender,

      isMarried:
        values.isMarried === 'true',

      occupation:
        values.occupation,

      education:
        values.education,

      mobileNumber:
        values.mobileNumber,

      email: values.email,

      fatherName:
        values.fatherName,

      motherName:
        values.motherName,

      grandFatherName:
        values.grandFatherName,

      district:
        values.district,

      tehsil:
        values.tehsil,

      village:
        values.village,

      address:
        values.address,

      profileImage: '',
    },

    profiles: [
  // SPOUSE
  ...values.spouses.map((spouse) => ({
    relationToHead: 'SPOUSE',

    name: spouse.name,
    dob: spouse.dob || '',

    gender: 'FEMALE',

    isMarried: true,

    occupation: '',
    education: '',

    mobileNumber: '',
    email: '',

    fatherName: spouse.fatherName,
    motherName: '',
    grandFatherName: '',

    district: spouse.district,
    tehsil: spouse.tehsil,
    village: spouse.village,

    profileImage: '',
    parentProfileId: '',
    spouseFamilyId: '',
  })),

  // CHILDREN
  ...values.children.map((child) => ({
    relationToHead: 'CHILD',

    name: child.name,
    dob: child.dob || '',

    gender: child.gender,

    isMarried: false,

    occupation: '',
    education: '',

    mobileNumber: '',
    email: '',

    fatherName: values.name,
    motherName:
      values.spouses?.[0]?.name || '',

    grandFatherName:
      values.grandFatherName || '',

    district: values.district,
    tehsil: values.tehsil,
    village: values.village,

    profileImage: '',
    parentProfileId: '',
    spouseFamilyId: '',
  })),
],
  })
}




const inputSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: '#151515',
    borderRadius: 2,

    '& fieldset': {
      borderColor: '#2A2A2A',
    },

    '&:hover fieldset': {
      borderColor: '#444',
    },

    '&.Mui-focused fieldset': {
      borderColor: '#E31E24',
    },
  },

  '& .MuiInputBase-input': {
    color: '#fff',
    fontSize: 13,
  },

  '& .MuiInputLabel-root': {
    color: '#777',
    fontSize: 13,
  },

  '& .MuiFormHelperText-root': {
    color: '#E31E24',
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
            sm: 560,
          },

          bgcolor: '#0D0D0D',
          borderLeft:
            '1px solid #222',
          overflow: 'hidden',
        },
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          px: 3,
          py: 2.5,
          borderBottom:
            '1px solid #1F1F1F',

          background:
            'linear-gradient(to right, rgba(227,30,36,0.10), transparent)',
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                bgcolor:
                  'rgba(227,30,36,0.12)',

                border:
                  '1px solid rgba(227,30,36,0.25)',

                display: 'flex',
                alignItems: 'center',
                justifyContent:
                  'center',
              }}
            >
              <FamilyRestroomIcon
                sx={{
                  color: '#E31E24',
                  fontSize: 22,
                }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  color: '#fff',
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                Create Family
              </Typography>

              <Typography
                sx={{
                  color: '#777',
                  fontSize: 12,
                  mt: 0.3,
                }}
              >
                Register a new family
                into the portal
              </Typography>
            </Box>
          </Stack>

          <IconButton
            onClick={onClose}
            sx={{
              color: '#777',

              '&:hover': {
                bgcolor:
                  'rgba(255,255,255,0.05)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </Box>

      {/* BODY */}

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 3,
        }}
      >
        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
          id="create-family-form"
        >
          {/* BASIC INFO */}

          <Paper
            elevation={0}
            sx={{
              bgcolor: '#111111',
              border:
                '1px solid #1F1F1F',
              borderRadius: 3,
              p: 3,
              mb: 3,
            }}
          >
            <Typography
              sx={{
                color: '#fff',
                fontSize: 15,
                fontWeight: 600,
                mb: 2.5,
              }}
            >
              Basic Information
            </Typography>

  <Grid
  container
  spacing={2.5}
>
  {/* HEAD NAME */}

  <Grid item xs={12}>
    <TextField
      fullWidth
      label="Head Name"
      placeholder="Enter full name"
      size="small"
      {...register('name', {
        required:
          'Head name is required',
      })}
      error={!!errors.name}
      helperText={
        errors.name?.message
      }
      sx={inputSx}
    />
  </Grid>

  {/* MOBILE */}

  <Grid item xs={12} sm={6}>
    <TextField
      fullWidth
      label="Mobile Number"
      placeholder="9876543210"
      size="small"
      {...register(
        'mobileNumber',
        {
          required:
            'Mobile number is required',

          pattern: {
            value:
              /^[6-9]\d{9}$/,

            message:
              'Enter valid mobile number',
          },
        }
      )}
      error={
        !!errors.mobileNumber
      }
      helperText={
        errors.mobileNumber
          ?.message
      }
      sx={inputSx}
    />
  </Grid>

  {/* GENDER */}

  <Grid item xs={12} sm={6}>
    <TextField
      select
      fullWidth
      label="Gender"
      size="small"
      defaultValue="MALE"
      {...register('gender', {
        required:
          'Gender is required',
      })}
      error={!!errors.gender}
      helperText={
        errors.gender?.message
      }
      sx={inputSx}
    >
      <MenuItem value="MALE">
        Male
      </MenuItem>

      <MenuItem value="FEMALE">
        Female
      </MenuItem>
    </TextField>
  </Grid>

  {/* DOB */}

<Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    type="date"
    label="Date of Birth"
    size="small"
    defaultValue={
      new Date()
        .toISOString()
        .split('T')[0]
    }
    InputLabelProps={{
      shrink: true,
    }}
    inputProps={{
      max: new Date()
        .toISOString()
        .split('T')[0],
    }}
    {...register('dob', {
      required:
        'Date of birth is required',
    })}
    error={!!errors.dob}
    helperText={
      errors.dob?.message
    }
    sx={{
      ...inputSx,

      '& input': {
        color: '#fff',
      },

      '& input[type="date"]': {
        colorScheme: 'dark',
      },

      '& input[type="date"]::-webkit-calendar-picker-indicator':
        {
          filter: 'invert(1)',
          cursor: 'pointer',
        },
    }}
  />
</Grid>

  {/* FATHER NAME */}

  <Grid item xs={12} sm={6}>
    <TextField
      fullWidth
      label="Father Name"
      size="small"
      {...register(
        'fatherName',
        {
          required:
            'Father name is required',
        }
      )}
      error={
        !!errors.fatherName
      }
      helperText={
        errors.fatherName
          ?.message
      }
      sx={inputSx}
    />
  </Grid>

  {/* MOTHER NAME */}

  <Grid item xs={12} sm={6}>
    <TextField
      fullWidth
      label="Mother Name"
      size="small"
      {...register(
        'motherName'
      )}
      sx={inputSx}
    />
  </Grid>

  {/* OCCUPATION */}

  <Grid item xs={12} sm={6}>
    <TextField
      fullWidth
      label="Occupation"
      size="small"
      {...register(
        'occupation'
      )}
      sx={inputSx}
    />
  </Grid>

  {/* EDUCATION */}

  <Grid item xs={12} sm={6}>
    <TextField
      fullWidth
      label="Education"
      size="small"
      {...register(
        'education'
      )}
      sx={inputSx}
    />
  </Grid>

  {/* DISTRICT */}

<Grid item xs={12} sm={4}>
  <TextField
    select
    fullWidth
    label="District"
    size="small"
    defaultValue="Indore"
    InputLabelProps={{
    shrink: true,
    }}
    {...register('district', {
      required:
        'District is required',
    })}
    error={!!errors.district}
    helperText={
      errors.district?.message
    }
    onChange={(e) => {
      setValue(
        'district',
        e.target.value
      )

      setValue('tehsil', '')
      setValue('village', '')
    }}
    sx={inputSx}
  >
    {Object.keys(locationData).map(
      (district) => (
        <MenuItem
          key={district}
          value={district}
        >
          {district}
        </MenuItem>
      )
    )}
  </TextField>
</Grid>

  {/* TEHSIL */}

<Grid item xs={12} sm={4}>
  <TextField
    select
    fullWidth
    label="Tehsil"
    size="small"
    defaultValue="Sanwer"
    
    {...register('tehsil', {
      required:
        'Tehsil is required',
    })}
    error={!!errors.tehsil}
    helperText={
      errors.tehsil?.message
    }
    onChange={(e) => {
      setValue(
        'tehsil',
        e.target.value
      )

      setValue('village', '')
    }}
    disabled={!selectedDistrict}
    sx={inputSx}
  >
    {tehsilOptions.map(
      (tehsil) => (
        <MenuItem
          key={tehsil}
          value={tehsil}
        >
          {tehsil}
        </MenuItem>
      )
    )}
  </TextField>
</Grid>

  {/* VILLAGE */}

<Grid item xs={12} sm={4}>
  <TextField
    select
    fullWidth
    label="Village"
    size="small"
    defaultValue="Hatod"
    {...register('village', {
      required:
        'Village is required',
    })}
    error={!!errors.village}
    helperText={
      errors.village?.message
    }
    disabled={!selectedTehsil}
    sx={inputSx}
  >
    {villageOptions.map(
      (village) => (
        <MenuItem
          key={village}
          value={village}
        >
          {village}
        </MenuItem>
      )
    )}
  </TextField>
</Grid>

  {/* EMAIL */}

<Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    label="Email Address"
    placeholder="example@gmail.com"
    size="small"
    {...register('email', {
      pattern: {
        value:
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Enter valid email',
      },
    })}
    error={!!errors.email}
    helperText={errors.email?.message}
    sx={inputSx}
  />
</Grid>

{/* MARITAL STATUS */}

<Grid item xs={12} sm={6}>
  <TextField
    select
    fullWidth
    label="Marital Status"
    size="small"
    defaultValue="true"
    InputLabelProps={{
      shrink: true,
    }}
    {...register('isMarried')}
    sx={inputSx}
  >
    <MenuItem value="true">
      Married
    </MenuItem>

    <MenuItem value="false">
      Unmarried
    </MenuItem>
  </TextField>
</Grid>

{/* GRANDFATHER NAME */}

<Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    label="Grand Father Name"
    size="small"
    {...register('grandFatherName')}
    sx={inputSx}
  />
</Grid>

{/* ADDRESS */}

<Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    label="Address"
    size="small"
    {...register('address')}
    sx={inputSx}
  />
</Grid>

{/* PROFILE IMAGE */}

<Grid item xs={12}>
  <Button
    variant="outlined"
    component="label"
    sx={{
      borderColor: '#2A2A2A',
      color: '#fff',
      textTransform: 'none',

      '&:hover': {
        borderColor: '#E31E24',
      },
    }}
  >
    Upload Profile Image

    <input
      type="file"
      hidden
      accept="image/*"
      onChange={(e) => {
        console.log(e.target.files[0])
      }}
    />
  </Button>
</Grid>

{/* =========================================
   SPOUSE DETAILS
========================================= */}

{watch('isMarried') === 'true' && (
  <>
    <Grid item xs={12}>
      <Typography
        sx={{
          color: '#fff',
          fontSize: 15,
          fontWeight: 600,
          mt: 2,
          mb: 1,
        }}
      >
        Spouse Details
      </Typography>
    </Grid>

    {spouseFields.map((field, index) => (
      <Grid container spacing={2} key={field.id}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Spouse Name"
            size="small"
            {...register(`spouses.${index}.name`)}
            sx={inputSx}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Father Name"
            size="small"
            {...register(`spouses.${index}.fatherName`)}
            sx={inputSx}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="District"
            size="small"
            {...register(`spouses.${index}.district`)}
            sx={inputSx}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Tehsil"
            size="small"
            {...register(`spouses.${index}.tehsil`)}
            sx={inputSx}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Village"
            size="small"
            {...register(`spouses.${index}.village`)}
            sx={inputSx}
          />
        </Grid>
      </Grid>
    ))}
  </>
)}

{/* =========================================
   CHILDREN SECTION
========================================= */}

<Grid item xs={12}>
  <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    mt={2}
  >
    <Typography
      sx={{
        color: '#fff',
        fontSize: 15,
        fontWeight: 600,
      }}
    >
      Children Details
    </Typography>

    <Button
      variant="contained"
      size="small"
      onClick={() =>
        addChild({
          name: '',
          relationToHead: 'CHILD',
          gender: 'MALE',
          dob: '',
        })
      }
      sx={{
        bgcolor: '#E31E24',
        textTransform: 'none',

        '&:hover': {
          bgcolor: '#c41820',
        },
      }}
    >
      Add Child
    </Button>
  </Stack>
</Grid>

{childFields.map((field, index) => (
  <Grid
    container
    spacing={2}
    key={field.id}
    sx={{ mt: 1 }}
  >
    <Grid item xs={12} sm={4}>
      <TextField
        fullWidth
        label="Child Name"
        size="small"
        {...register(`children.${index}.name`)}
        sx={inputSx}
      />
    </Grid>

    <Grid item xs={12} sm={4}>
      <TextField
        select
        fullWidth
        label="Gender"
        size="small"
        defaultValue="MALE"
        {...register(`children.${index}.gender`)}
        sx={inputSx}
      >
        <MenuItem value="MALE">
          Male
        </MenuItem>

        <MenuItem value="FEMALE">
          Female
        </MenuItem>
      </TextField>
    </Grid>

    <Grid item xs={12} sm={3}>
      <TextField
        fullWidth
        type="date"
        size="small"
        {...register(`children.${index}.dob`)}
        sx={{
          ...inputSx,

          '& input': {
            color: '#fff',
          },

          '& input[type="date"]': {
            colorScheme: 'dark',
          },

          '& input[type="date"]::-webkit-calendar-picker-indicator':
            {
              filter: 'invert(1)',
              cursor: 'pointer',
            },
        }}
      />
    </Grid>

    <Grid item xs={12} sm={1}>
      <Button
        fullWidth
        color="error"
        variant="outlined"
        onClick={() =>
          removeChild(index)
        }
        sx={{
          minWidth: 0,
          height: 40,
        }}
      >
        X
      </Button>
    </Grid>
  </Grid>
))}


</Grid>
          </Paper>
        </form>
      </Box>

      {/* FOOTER */}

      <Box
        sx={{
          p: 2.5,
          borderTop:
            '1px solid #1F1F1F',
          bgcolor: '#111111',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
        >
          <Button
            onClick={onClose}
            sx={{
              color: '#777',
              textTransform:
                'none',
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>

        <Button
        type="submit"
        form="create-family-form"
        variant="contained"
        disabled={isPending}
        sx={{
            bgcolor: '#E31E24',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            height: 42,
            borderRadius: 2,
            boxShadow: 'none',

            '&:hover': {
            bgcolor: '#c41820',
            boxShadow: 'none',
            },
        }}
        >
        {isPending
            ? 'Creating...'
            : 'Create Family'}
        </Button>


        </Stack>
      </Box>
    </Drawer>
  )
}

import { useQuery } from '@tanstack/react-query'

import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stack,
  Divider,
  Button,
} from '@mui/material'

import PersonIcon from '@mui/icons-material/Person'
import FavoriteIcon from '@mui/icons-material/Favorite'

import api from '../../api/axiosInstance'

/* ───────────────── API ───────────────── */

const getFamilyProfile = (
  familyId
) =>
  api
    .get('/admin/family/profile', {
      params: {
        familyId,
      },
    })
    .then((r) => r.data.responseBody)

/* ───────────────── COMMON COLORS ───────────────── */

const primaryColor = '#7A1E1E'

const softBg =
  'rgba(122,30,30,0.06)'

/* ───────────────── FORMAT DATE ───────────────── */

const formatDate = (date) => {
  if (!date) return '-'

  try {
    const d = new Date(date)

    if (
      isNaN(d.getTime())
    ) {
      return date
    }

    return d.toLocaleDateString(
      'en-IN'
    )
  } catch {
    return date
  }
}

/* ───────────────── MEMBER CARD ───────────────── */

function FamilyMemberCard({
  member,
  highlight = false,
}) {
  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: 340,

        borderRadius: 5,

        background: highlight
          ? `linear-gradient(135deg, ${primaryColor}, #A52A2A)`
          : '#fff',

        color: highlight
          ? '#fff'
          : '#111827',

        border: `1px solid rgba(122,30,30,0.10)`,

        boxShadow: highlight
          ? '0 15px 40px rgba(122,30,30,0.28)'
          : '0 8px 28px rgba(0,0,0,0.08)',

        transition:
          'all .25s ease',

        '&:hover': {
          transform:
            'translateY(-5px)',
        },
      }}
    >
      <CardContent
        sx={{
          p: 2.5,
        }}
      >
        {/* TOP */}

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Avatar
            sx={{
              width: 72,
              height: 72,

              bgcolor: highlight
                ? 'rgba(255,255,255,0.15)'
                : softBg,

              color: highlight
                ? '#fff'
                : primaryColor,

              fontWeight: 800,
              fontSize: 28,
            }}
          >
            {member.firstName?.[0] ||
              'P'}
          </Avatar>

          <Box flex={1}>
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 800,
                lineHeight: 1.3,
              }}
            >
              {member.firstName}{' '}
              {
                member.middleName
              }{' '}
              {member.lastName}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              mt={1}
              flexWrap="wrap"
            >
              <Chip
                size="small"
                label={
                  member.relationType
                }
                sx={{
                  bgcolor: highlight
                    ? 'rgba(255,255,255,0.14)'
                    : softBg,

                  color: highlight
                    ? '#fff'
                    : primaryColor,

                  fontWeight: 700,
                }}
              />

              <Chip
                size="small"
                label={
                  member.isAlive
                    ? 'Alive'
                    : 'Deceased'
                }
                sx={{
                  bgcolor:
                    member.isAlive
                      ? 'rgba(34,197,94,0.12)'
                      : 'rgba(239,68,68,0.12)',

                  color:
                    member.isAlive
                      ? '#16A34A'
                      : '#DC2626',

                  fontWeight: 700,
                }}
              />
            </Stack>
          </Box>
        </Stack>

        <Divider
          sx={{
            my: 2,
            borderColor: highlight
              ? 'rgba(255,255,255,0.12)'
              : 'rgba(0,0,0,0.08)',
          }}
        />

        {/* DETAILS */}

        <Stack spacing={1}>
          <Typography
            fontSize={14}
          >
            <b>Gender:</b>{' '}
            {member.gender ||
              '-'}
          </Typography>

          <Typography
            fontSize={14}
          >
            <b>DOB:</b>{' '}
            {formatDate(
              member.dob
            )}
          </Typography>

          <Typography
            fontSize={14}
          >
            <b>Occupation:</b>{' '}
            {member.occupation ||
              '-'}
          </Typography>

          <Typography
            fontSize={14}
          >
            <b>Education:</b>{' '}
            {member.education ||
              '-'}
          </Typography>

          <Typography
            fontSize={14}
          >
            <b>Mobile:</b>{' '}
            {member.mobile ||
              '-'}
          </Typography>

          <Typography
            fontSize={14}
          >
            <b>Marital:</b>{' '}
            {
              member.maritalStatus
            }
          </Typography>

          {(member.fatherFirstName ||
            member.fatherLastName) && (
            <Typography
              fontSize={14}
            >
              <b>Father:</b>{' '}
              {
                member.fatherFirstName
              }{' '}
              {
                member.fatherLastName
              }
            </Typography>
          )}

          {(member.motherFirstName ||
            member.motherLastName) && (
            <Typography
              fontSize={14}
            >
              <b>Mother:</b>{' '}
              {
                member.motherFirstName
              }{' '}
              {
                member.motherLastName
              }
            </Typography>
          )}

          {!member.isAlive && (
            <Typography
              fontSize={14}
              color="#DC2626"
            >
              <b>Death:</b>{' '}
              {formatDate(
                member.deathDate
              )}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

/* ───────────────── COMPONENT ───────────────── */

export default function ViewFamilyPage({
  open,
  onClose,
  familyId,
}) {
  const { data, isFetching } =
    useQuery({
      queryKey: [
        'family-profile',
        familyId,
      ],

      queryFn: () =>
        getFamilyProfile(familyId),

      enabled:
        open && !!familyId,
    })

  const family = data?.family

  const members =
    data?.members || []

  /* ───────────────── FIND MEMBERS ───────────────── */

  const head =
    members.find(
      (m) =>
        m.relationType === 'HEAD'
    )

  const parents = members.filter(
    (m) =>
      [
        'FATHER',
        'MOTHER',
      ].includes(m.relationType)
  )

  const children = members.filter(
    (m) =>
      [
        'SON',
        'DAUGHTER',
      ].includes(m.relationType)
  )

  const siblings = members.filter(
    (m) =>
      [
        'BROTHER',
        'SISTER',
      ].includes(m.relationType)
  )

  const grandChildren =
    members.filter((m) =>
      [
        'GRANDSON',
        'GRANDDAUGHTER',
      ].includes(m.relationType)
    )

  /* ───────────────── SPOUSE MAP ───────────────── */

  const spouses = members.filter(
    (m) =>
      m.relationType ===
      'SPOUSE'
  )

  const getSpouse = (
    personId
  ) => {
    return spouses.find(
      (s) =>
        s.linkedPersonId ===
          personId ||
        s.spouseIds?.includes(
          personId
        )
    )
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          overflow: 'hidden',
          bgcolor: '#FFF8F3',
        },
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          px: 4,
          py: 3,

          background: `linear-gradient(135deg, ${primaryColor}, #A52A2A)`,

          color: '#fff',

          display: 'flex',
          justifyContent:
            'space-between',

          alignItems: 'center',
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 30,
              fontWeight: 800,
            }}
          >
            Family Tree
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              mt: 0.5,
              opacity: 0.9,
            }}
          >
            {family?.familyId}
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            bgcolor: '#fff',
            color: primaryColor,
            fontWeight: 700,

            '&:hover': {
              bgcolor: '#f4f4f4',
            },
          }}
        >
          Close
        </Button>
      </Box>

      <DialogContent
        sx={{
          p: 4,
          bgcolor: '#FFF8F3',
        }}
      >
        {isFetching ? (
          <Typography>
            Loading...
          </Typography>
        ) : (
          <>
            {/* FAMILY SUMMARY */}

            <Card
              sx={{
                borderRadius: 5,
                mb: 5,

                background:
                  'linear-gradient(135deg,#111827,#1F2937)',

                color: '#fff',

                boxShadow:
                  '0 12px 40px rgba(0,0,0,0.18)',
              }}
            >
              <CardContent
                sx={{
                  p: 4,
                }}
              >
                <Stack
                  direction={{
                    xs: 'column',
                    md: 'row',
                  }}
                  spacing={3}
                  alignItems="center"
                >
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,

                      bgcolor:
                        'rgba(255,255,255,0.10)',

                      color: '#fff',
                    }}
                  >
                    <PersonIcon
                      sx={{
                        fontSize: 50,
                      }}
                    />
                  </Avatar>

                  <Box flex={1}>
                    <Typography
                      sx={{
                        fontSize: 34,
                        fontWeight: 800,
                      }}
                    >
                      {
                        family?.familyTitle
                      }
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1.5}
                      mt={2}
                      flexWrap="wrap"
                    >
                      <Chip
                        label={
                          family?.familyId
                        }
                        sx={{
                          bgcolor:
                            'rgba(239,68,68,0.14)',

                          color:
                            '#FF6B6B',

                          fontWeight: 700,
                        }}
                      />

                      <Chip
                        label={`${family?.totalMembers} Members`}
                        sx={{
                          bgcolor:
                            'rgba(59,130,246,0.14)',

                          color:
                            '#60A5FA',

                          fontWeight: 700,
                        }}
                      />

                      <Chip
                        label={
                          family?.status ===
                          1
                            ? 'Active'
                            : 'Inactive'
                        }
                        sx={{
                          bgcolor:
                            family?.status ===
                            1
                              ? 'rgba(34,197,94,0.14)'
                              : 'rgba(239,68,68,0.14)',

                          color:
                            family?.status ===
                            1
                              ? '#4ADE80'
                              : '#F87171',

                          fontWeight: 700,
                        }}
                      />
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* TREE TITLE */}

            <Typography
              sx={{
                fontSize: 28,
                fontWeight: 800,
                color: primaryColor,
                mb: 5,
                textAlign: 'center',
              }}
            >
              Family Hierarchy
            </Typography>

            {/* TREE */}

            <Box
              sx={{
                display: 'flex',
                flexDirection:
                  'column',

                alignItems:
                  'center',

                gap: 5,
              }}
            >
              {/* PARENTS */}

              {parents.length >
                0 && (
                <Stack
                  direction={{
                    xs: 'column',
                    md: 'row',
                  }}
                  spacing={4}
                  justifyContent="center"
                  alignItems="center"
                  flexWrap="wrap"
                >
                  {parents.map(
                    (member) => (
                      <FamilyMemberCard
                        key={
                          member._id
                        }
                        member={
                          member
                        }
                      />
                    )
                  )}
                </Stack>
              )}

              {/* CONNECTOR */}

              <Box
                sx={{
                  width: 4,
                  height: 45,
                  bgcolor:
                    '#D7B7A5',
                  borderRadius: 20,
                }}
              />

              {/* HEAD + SPOUSE */}

              <Stack
                direction={{
                  xs: 'column',
                  lg: 'row',
                }}
                spacing={4}
                alignItems="center"
                justifyContent="center"
                flexWrap="wrap"
              >
                {head && (
                  <FamilyMemberCard
                    member={head}
                    highlight
                  />
                )}

                {getSpouse(
                  head?._id
                ) && (
                  <>
                    <FavoriteIcon
                      sx={{
                        color:
                          '#EC4899',
                        fontSize: 42,
                      }}
                    />

                    <FamilyMemberCard
                      member={getSpouse(
                        head?._id
                      )}
                    />
                  </>
                )}
              </Stack>

              {/* CHILDREN */}

              {children.length >
                0 && (
                <>
                  <Box
                    sx={{
                      width: 4,
                      height: 45,
                      bgcolor:
                        '#D7B7A5',
                      borderRadius: 20,
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: 24,
                      fontWeight: 700,
                      color:
                        primaryColor,
                    }}
                  >
                    Children
                  </Typography>

                  <Box
                    sx={{
                      display:
                        'grid',

                      gridTemplateColumns:
                        {
                          xs: '1fr',
                          md: 'repeat(2,1fr)',
                          xl: 'repeat(3,1fr)',
                        },

                      gap: 4,
                      width: '100%',
                      justifyItems:
                        'center',
                    }}
                  >
                    {children.map(
                      (
                        child
                      ) => {
                        const spouse =
                          getSpouse(
                            child._id
                          )

                        return (
                          <Stack
                            key={
                              child._id
                            }
                            spacing={
                              2
                            }
                            alignItems="center"
                          >
                            <FamilyMemberCard
                              member={
                                child
                              }
                            />

                            {spouse && (
                              <>
                                <FavoriteIcon
                                  sx={{
                                    color:
                                      '#EC4899',
                                  }}
                                />

                                <FamilyMemberCard
                                  member={
                                    spouse
                                  }
                                />
                              </>
                            )}
                          </Stack>
                        )
                      }
                    )}
                  </Box>
                </>
              )}

              {/* GRANDCHILDREN */}

              {grandChildren.length >
                0 && (
                <>
                  <Box
                    sx={{
                      width: 4,
                      height: 45,
                      bgcolor:
                        '#D7B7A5',
                      borderRadius: 20,
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: 24,
                      fontWeight: 700,
                      color:
                        primaryColor,
                    }}
                  >
                    Grand Children
                  </Typography>

                  <Box
                    sx={{
                      display:
                        'grid',

                      gridTemplateColumns:
                        {
                          xs: '1fr',
                          sm: 'repeat(2,1fr)',
                          lg: 'repeat(3,1fr)',
                        },

                      gap: 4,
                      width: '100%',
                      justifyItems:
                        'center',
                    }}
                  >
                    {grandChildren.map(
                      (
                        member
                      ) => (
                        <FamilyMemberCard
                          key={
                            member._id
                          }
                          member={
                            member
                          }
                        />
                      )
                    )}
                  </Box>
                </>
              )}

              {/* SIBLINGS */}

              {siblings.length >
                0 && (
                <>
                  <Box
                    sx={{
                      width: 4,
                      height: 45,
                      bgcolor:
                        '#D7B7A5',
                      borderRadius: 20,
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: 24,
                      fontWeight: 700,
                      color:
                        primaryColor,
                    }}
                  >
                    Siblings
                  </Typography>

                  <Box
                    sx={{
                      display:
                        'grid',

                      gridTemplateColumns:
                        {
                          xs: '1fr',
                          md: 'repeat(2,1fr)',
                        },

                      gap: 4,
                      width: '100%',
                      justifyItems:
                        'center',
                    }}
                  >
                    {siblings.map(
                      (
                        member
                      ) => (
                        <FamilyMemberCard
                          key={
                            member._id
                          }
                          member={
                            member
                          }
                        />
                      )
                    )}
                  </Box>
                </>
              )}
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
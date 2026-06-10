import { useMemo, useState } from 'react'

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
  Button,
  IconButton,
} from '@mui/material'

import PersonIcon from '@mui/icons-material/Person'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'

import api from '../../api/axiosInstance'

import EditMemberPage from './EditMemberPage'

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

/* ───────────────── COLORS ───────────────── */

const primary = '#7A1E1E'

const lightBg = '#FFF8F3'

const borderColor =
  'rgba(122,30,30,0.10)'

const lineColor = '#D9B8A8'

/* ───────────────── DATE FORMAT ───────────────── */

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

function MemberCard({
  member,
  isHead = false,
  onEdit,
}) {
  const fullName = [
    member?.firstName,
    member?.middleName,
    member?.lastName,
  ]
    .filter(Boolean)
    .join(' ')

  const DetailRow = ({
    label,
    value,
  }) => {
    if (!value) return null

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent:
            'space-between',

          gap: 2,
          py: 1,

          borderBottom:
            '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 700,
            color: '#6B7280',
            minWidth: 120,
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 600,
            color: '#111827',
            textAlign: 'right',
            flex: 1,
            wordBreak:
              'break-word',
          }}
        >
          {value}
        </Typography>
      </Box>
    )
  }

  return (
    <Card
      sx={{
        width: 340,

        borderRadius: 6,
        position: 'relative',
pointerEvents: 'auto',

        background: isHead
          ? 'linear-gradient(180deg,#FFF7F2 0%,#FFFFFF 100%)'
          : '#FFFFFF',

        border: isHead
          ? '2px solid #7A1E1E'
          : '1px solid rgba(0,0,0,0.08)',

        boxShadow: isHead
          ? '0 20px 40px rgba(122,30,30,0.15)'
          : '0 8px 24px rgba(0,0,0,0.08)',

        overflow: 'hidden',

        transition:
          'all .25s ease',

        position: 'relative',

        '&:hover': {
          transform:
            'translateY(-6px)',

          boxShadow:
            '0 20px 40px rgba(0,0,0,0.12)',
        },
      }}
    >
      {/* EDIT BUTTON */}

<IconButton
  onClick={(e) => {
    e.stopPropagation()
    onEdit(member)
  }}
  sx={{
    position: 'absolute',
    top: 12,
    right: 12,

    width: 38,
    height: 38,

    bgcolor: '#FFFFFF',

    border:
      '1px solid rgba(122,30,30,0.12)',

    boxShadow:
      '0 4px 12px rgba(0,0,0,0.08)',

    zIndex: 999,

    cursor: 'pointer',

    '&:hover': {
      bgcolor: '#FFF5F5',
      transform: 'scale(1.05)',
    },
  }}
>
  <EditRoundedIcon
    sx={{
      fontSize: 18,
      color: primary,
    }}
  />
</IconButton>

      {/* TOP HEADER */}

      <Box
        sx={{
          px: 3,
          pt: 3,
          pb: 2,

          background: isHead
            ? 'linear-gradient(135deg,#7A1E1E,#A52A2A)'
            : '#FAFAFA',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
        >
<Avatar
  src={member?.profileImage}
  sx={{
    width: 72,
    height: 72,

    bgcolor: isHead
      ? 'rgba(255,255,255,0.18)'
      : 'rgba(122,30,30,0.10)',

    color: isHead
      ? '#FFFFFF'
      : '#7A1E1E',

    fontSize: 30,
    fontWeight: 800,

    border:
      '3px solid rgba(255,255,255,0.20)',
  }}
>
  {member?.firstName?.[0] || (
    <PersonIcon />
  )}
</Avatar>

          <Box flex={1}>
            <Typography
              sx={{
                fontSize: 24,
                fontWeight: 800,

                color: isHead
                  ? '#FFFFFF'
                  : '#111827',

                lineHeight: 1.2,
              }}
            >
              {fullName || '-'}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              mt={1.5}
              flexWrap="wrap"
              useFlexGap
            >
              <Chip
                size="small"
                label={
                  member?.relationType
                }
                sx={{
                  bgcolor: isHead
                    ? 'rgba(255,255,255,0.18)'
                    : 'rgba(122,30,30,0.08)',

                  color: isHead
                    ? '#FFFFFF'
                    : '#7A1E1E',

                  fontWeight: 700,
                }}
              />

              <Chip
                size="small"
                label={
                  member?.isAlive
                    ? 'Alive'
                    : 'Deceased'
                }
                sx={{
                  bgcolor:
                    member?.isAlive
                      ? 'rgba(34,197,94,0.12)'
                      : 'rgba(239,68,68,0.12)',

                  color:
                    member?.isAlive
                      ? '#16A34A'
                      : '#DC2626',

                  fontWeight: 700,
                }}
              />
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* DETAILS */}

      <CardContent
        sx={{
          p: 3,
        }}
      >
        <Stack spacing={0.2}>
          <DetailRow
            label="Gender"
            value={member?.gender}
          />

          <DetailRow
            label="DOB"
            value={formatDate(
              member?.dob
            )}
          />

          <DetailRow
            label="Mobile"
            value={
              member?.mobile || '-'
            }
          />

          <DetailRow
            label="Occupation"
            value={
              member?.occupation
            }
          />

          <DetailRow
            label="Education"
            value={
              member?.education
            }
          />

          <DetailRow
            label="Marital"
            value={
              member?.maritalStatus
            }
          />

          {/* Husband */}

          {member?.gender ===
            'FEMALE' &&
            member?.husbandName && (
              <DetailRow
                label="Husband"
                value={
                  member?.husbandName
                }
              />
            )}

          {/* Wife */}

          {member?.gender ===
            'MALE' &&
            member?.wifeName && (
              <DetailRow
                label="Wife"
                value={
                  member?.wifeName
                }
              />
            )}

          {/* Father */}

          <DetailRow
            label="Father"
            value={[
              member?.fatherFirstName,
              member?.fatherMiddleName,
              member?.fatherLastName,
            ]
              .filter(Boolean)
              .join(' ')}
          />

          {/* Mother */}

          <DetailRow
            label="Mother"
            value={[
              member?.motherFirstName,
              member?.motherMiddleName,
              member?.motherLastName,
            ]
              .filter(Boolean)
              .join(' ')}
          />

          {/* Native Village */}

          {[
            'MOTHER',
            'SPOUSE',
          ].includes(
            member?.relationType
          ) && (
            <DetailRow
              label="Native Village"
              value={
                member?.nativeVillageName
              }
            />
          )}

          {/* Married Village */}

          {[
            'SISTER',
            'DAUGHTER',
            'GRANDDAUGHTER',
          ].includes(
            member?.relationType
          ) && (
            <DetailRow
              label="Married Village"
              value={
                member?.marriedVillageName
              }
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

/* ───────────────── RELATION LINE ───────────────── */

function VerticalLine() {
  return (
    <Box
      sx={{
        width: 3,
        height: 45,
        bgcolor: lineColor,
        borderRadius: 20,
      }}
    />
  )
}

/* ───────────────── COUPLE BLOCK ───────────────── */

function CoupleBlock({
  person,
  spouse,
  isHead = false,
  onEdit,
}) {
  return (
    <Stack
      direction={{
        xs: 'column',
        lg: 'row',
      }}
      spacing={2}
      alignItems="center"
      justifyContent="center"
    >
      <MemberCard
        member={person}
        isHead={isHead}
        onEdit={onEdit}
      />

      {spouse && (
        <>
          <FavoriteRoundedIcon
            sx={{
              color: '#EC4899',
              fontSize: 34,
            }}
          />

          <MemberCard
            member={spouse}
            onEdit={onEdit}
          />
        </>
      )}
    </Stack>
  )
}

/* ───────────────── COMPONENT ───────────────── */

export default function ViewFamilyPage({
  open,
  onClose,
  familyId,
}) {
  const [editOpen, setEditOpen] =
    useState(false)

  const [selectedMember, setSelectedMember] =
    useState(null)

  const {
    data,
    isFetching,
    refetch,
  } = useQuery({
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

    const head =
    members.find(
      (m) =>
        m.relationType ===
        'HEAD'
    )

  /* ───────────────── EDIT ───────────────── */

  const handleEdit = (
    member
  ) => {
    setSelectedMember(member)
    setEditOpen(true)
  }

  /* ───────────────── SPOUSE FINDER ───────────────── */

  const getSpouse =
    useMemo(() => {
      return (person) => {
        return members.find(
          (m) =>
            m.relationType ===
              'SPOUSE' &&
            (
              m.linkedPersonId ===
                person?._id ||
              m.spouseIds?.includes(
                person?._id
              ) ||
              person?.spouseIds?.includes(
                m._id
              )
            )
        )
      }
    }, [members])

  /* ───────────────── RELATION GROUPS ───────────────── */

  const parents =
    members.filter((m) =>
      [
        'FATHER',
        'MOTHER',
      ].includes(
        m.relationType
      )
    )

  

  const siblings =
    members.filter((m) =>
      [
        'BROTHER',
        'SISTER',
      ].includes(
        m.relationType
      )
    )

  const children =
    members.filter((m) =>
      [
        'SON',
        'DAUGHTER',
      ].includes(
        m.relationType
      )
    )

  const grandChildren =
    members.filter((m) =>
      [
        'GRANDSON',
        'GRANDDAUGHTER',
      ].includes(
        m.relationType
      )
    )

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 5,
            overflow: 'hidden',
            bgcolor: lightBg,
          },
        }}
      >
        {/* HEADER */}

        <Box
          sx={{
            px: 4,
            py: 3,

            background: `linear-gradient(135deg, ${primary}, #A52A2A)`,

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
              color: primary,
              fontWeight: 700,

              '&:hover': {
                bgcolor: '#F3F4F6',
              },
            }}
          >
            Close
          </Button>
        </Box>

        <DialogContent
          sx={{
            p: 4,
            bgcolor: lightBg,
          }}
        >
          {isFetching ? (
            <Typography>
              Loading...
            </Typography>
          ) : (
            <>
              {/* FAMILY HEADER */}

              <Card
                sx={{
                  mb: 5,
                  borderRadius: 5,
                  background:
                    'linear-gradient(135deg,#FFFFFF,#FFF4EC)',

                  border: `1px solid ${borderColor}`,

                  boxShadow:
                    '0 10px 35px rgba(0,0,0,0.06)',
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
                        width: 95,
                        height: 95,

                        bgcolor:
                          'rgba(122,30,30,0.10)',

                        color: primary,
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
                          color:
                            '#111827',
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
                              'rgba(122,30,30,0.08)',

                            color:
                              primary,

                            fontWeight: 700,
                          }}
                        />

                        <Chip
                          label={`${family?.totalMembers} Members`}
                          sx={{
                            bgcolor:
                              'rgba(59,130,246,0.10)',

                            color:
                              '#2563EB',

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
                                ? 'rgba(34,197,94,0.10)'
                                : 'rgba(239,68,68,0.10)',

                            color:
                              family?.status ===
                              1
                                ? '#16A34A'
                                : '#DC2626',

                            fontWeight: 700,
                          }}
                        />
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

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
                  <>
                    <Typography
                      sx={{
                        fontSize: 24,
                        fontWeight: 800,
                        color: primary,
                      }}
                    >
                      Parents
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
                        justifyItems:
                          'center',
                        width: '100%',
                      }}
                    >
                      {parents.map(
                        (
                          parent
                        ) => (
                          <CoupleBlock
                            key={
                              parent._id
                            }
                            person={
                              parent
                            }
                            spouse={null}
                            onEdit={
                              handleEdit
                            }
                          />
                        )
                      )}
                    </Box>

                    <VerticalLine />
                  </>
                )}

                {/* MAIN FAMILY */}

                <Typography
                  sx={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: primary,
                  }}
                >
                  Main Family
                </Typography>

                <Box
                  sx={{
                    display: 'grid',

                    gridTemplateColumns:
                      {
                        xs: '1fr',
                        md: 'repeat(2,1fr)',
                      },

                    gap: 4,
                    justifyItems:
                      'center',
                    width: '100%',
                  }}
                >
                  {head && (
                    <CoupleBlock
                      person={head}
                      spouse={getSpouse(
                        head
                      )}
                      isHead
                      onEdit={
                        handleEdit
                      }
                    />
                  )}

                  {siblings.map(
                    (sibling) => (
                      <CoupleBlock
                        key={
                          sibling._id
                        }
                        person={
                          sibling
                        }
                        spouse={getSpouse(
                          sibling
                        )}
                        onEdit={
                          handleEdit
                        }
                      />
                    )
                  )}
                </Box>

                {/* CHILDREN */}

                {children.length >
                  0 && (
                  <>
                    <VerticalLine />

                    <Typography
                      sx={{
                        fontSize: 24,
                        fontWeight: 800,
                        color: primary,
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
                        justifyItems:
                          'center',
                        width: '100%',
                      }}
                    >
                      {children.map(
                        (
                          child
                        ) => (
                          <CoupleBlock
                            key={
                              child._id
                            }
                            person={
                              child
                            }
                            spouse={getSpouse(
                              child
                            )}
                            onEdit={
                              handleEdit
                            }
                          />
                        )
                      )}
                    </Box>
                  </>
                )}

                {/* GRAND CHILDREN */}

                {grandChildren.length >
                  0 && (
                  <>
                    <VerticalLine />

                    <Typography
                      sx={{
                        fontSize: 24,
                        fontWeight: 800,
                        color: primary,
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
                            xl: 'repeat(3,1fr)',
                          },

                        gap: 4,
                        justifyItems:
                          'center',
                        width: '100%',
                      }}
                    >
                      {grandChildren.map(
                        (
                          grand
                        ) => (
                          <CoupleBlock
                            key={
                              grand._id
                            }
                            person={
                              grand
                            }
                            spouse={getSpouse(
                              grand
                            )}
                            onEdit={
                              handleEdit
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

      {/* EDIT MEMBER DIALOG */}

      <EditMemberPage
        open={editOpen}
        onClose={() =>
          setEditOpen(false)
        }
        member={selectedMember}
        onSuccess={() => {
          refetch()
          setEditOpen(false)
        }}
      />
    </>
  )
}
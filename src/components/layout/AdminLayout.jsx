import { useState } from 'react'

import {
  Outlet,
  NavLink,
  useNavigate,
} from 'react-router-dom'

import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  AppBar,
  Typography,
  IconButton,
  ListItemIcon,
  Divider,
  Avatar,
  Toolbar,
  LinearProgress,
} from '@mui/material'

import Collapse from '@mui/material/Collapse'

import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import ExtensionIcon from '@mui/icons-material/Extension'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom'
import GroupsIcon from '@mui/icons-material/Groups'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'

import {
  useDispatch,
  useSelector,
} from 'react-redux'

import { logout } from '../../store/slices/authSlice'

import api from '../../api/axiosInstance'

import toast from 'react-hot-toast'

import kalotaLogo from '../../assets/kshatriya-kalota-logo.png'

const DRAWER_WIDTH = 260

const MODULE_MAP = {
  dashboard: {
    to: '/dashboard',

    icon: (
      <DashboardIcon
        sx={{ fontSize: 16 }}
      />
    ),
  },

  staff: {
    to: '/users',

    icon: (
      <PersonIcon
        sx={{ fontSize: 16 }}
      />
    ),
  },

  role: {
    to: '/roles',

    icon: (
      <AdminPanelSettingsIcon
        sx={{ fontSize: 16 }}
      />
    ),
  },

  'member management': {
    to: '/members',

    icon: (
      <GroupsIcon
        sx={{ fontSize: 16 }}
      />
    ),
  },

  'family management': {
    to: '/families',

    icon: (
      <FamilyRestroomIcon
        sx={{ fontSize: 16 }}
      />
    ),
  },

  location: {
    to: '/location',

    icon: (
      <LocationOnIcon
        sx={{ fontSize: 16 }}
      />
    ),
  },

  module: {
    to: '/modules',

    icon: (
      <ExtensionIcon
        sx={{ fontSize: 16 }}
      />
    ),
  },
}

const fallbackIcon = (
  <SettingsIcon
    sx={{ fontSize: 16 }}
  />
)

const sidebarSx = {
  width: DRAWER_WIDTH,

  flexShrink: 0,

  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,

    boxSizing: 'border-box',

    background:
      'linear-gradient(180deg, #7A1E1E 0%, #5C1414 100%)',

    borderRight:
      '1px solid rgba(255,255,255,0.08)',

    color: '#fff',
  },
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] =
    useState(false)

  const [openLocation, setOpenLocation] =
    useState(false)

  const [navigating, setNavigating] =
    useState(false)

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const { token, user } =
    useSelector((s) => s.auth)

  const moduleList =
    user?.roleResponse
      ?.roleModuleList ?? []

  const navItems = moduleList
    .filter(
      (m) =>
        m.moduleAction === 1 &&
        m.status === 1
    )
    .map((m) => {
      const key = m.moduleCode
        ?.toLowerCase()
        .trim()

      const mapped =
        MODULE_MAP[key]

      if (key === 'location') {
        return {
          label: m.moduleName,

          to:
            mapped?.to ??
            '/location',

          icon:
            mapped?.icon ??
            fallbackIcon,

          children: [
            {
              label: 'District',

              to: '/district',
            },

            {
              label: 'Tehsil',

              to: '/tehsil',
            },

            {
              label: 'Village',

              to: '/village',
            },
          ],
        }
      }

      return {
        label: m.moduleName,

        to:
          mapped?.to ??
          `/${key}`,

        icon:
          mapped?.icon ??
          fallbackIcon,
      }
    })

  const handleNavClick = (to) => {
    setNavigating(true)

    navigate(to)

    setTimeout(() => {
      setNavigating(false)
    }, 500)
  }

  const handleLogout =
    async () => {
      try {
        await api.get(
          `/admin/user/logout?token=${token}`
        )
      } catch (_) {}

      dispatch(logout())

      navigate('/login')

      toast.success('Logged out')
    }

  const drawer = (
    <Box
      sx={{
        display: 'flex',

        flexDirection: 'column',

        height: '100%',
      }}
    >
      {/* LOGO */}

      <Box
        sx={{
          px: 2.5,

          py: 2.5,

          display: 'flex',

          alignItems: 'center',

          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 42,

            height: 42,

            borderRadius: 2,

            background:
              'rgba(255,255,255,0.10)',

            display: 'flex',

            alignItems: 'center',

            justifyContent:
              'center',

            overflow: 'hidden',

            flexShrink: 0,
          }}
        >
          <Box
            component="img"
            src={kalotaLogo}
            alt="Logo"
            sx={{
              width: 34,

              height: 34,

              objectFit: 'cover',

              borderRadius: '50%',
            }}
          />
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: 14,

              fontWeight: 700,

              color: '#fff',

              lineHeight: 1.2,
            }}
          >
            Kalota Portal
          </Typography>

          <Typography
            sx={{
              fontSize: 11,

              color:
                'rgba(255,255,255,0.6)',

              lineHeight: 1.4,
            }}
          >
            {user?.roleResponse
              ?.roleName ?? 'Admin'}
          </Typography>
        </Box>
      </Box>

      <Divider
        sx={{
          borderColor:
            'rgba(255,255,255,0.08)',

          mx: 2,
        }}
      />

      {/* MENU */}

      <List
        sx={{
          px: 1.5,

          pt: 1.5,

          flex: 1,

          overflowY: 'auto',
        }}
      >
        <Typography
          sx={{
            fontSize: 12,

            fontWeight: 700,

            color:
              'rgba(255,255,255,0.7)',

            letterSpacing: '0.08em',

            textTransform:
              'uppercase',

            px: 1,

            mb: 1.2,
          }}
        >
          Menu
        </Typography>

        {navItems.length === 0 ? (
          <Typography
            sx={{
              fontSize: 11,

              color:
                'rgba(255,255,255,0.6)',

              px: 1,
            }}
          >
            No modules assigned
          </Typography>
        ) : (
          navItems.map(
            ({
              label,
              to,
              icon,
              children,
            }) => (
              <Box key={to}>
                {/* MAIN MENU */}

                <ListItemButton
                  component={
                    children
                      ? 'div'
                      : NavLink
                  }
                  to={
                    children
                      ? undefined
                      : to
                  }
                  onClick={() => {
                    if (children) {
                      setOpenLocation(
                        !openLocation
                      )
                    } else {
                      handleNavClick(
                        to
                      )
                    }
                  }}
                  sx={{
                    borderRadius: 2,

                    mb: 0.6,

                    px: 1.5,

                    py: 1,

                    color:
                      'rgba(255,255,255,0.82)',

                    transition:
                      'all 0.2s ease',

                    '& .MuiListItemIcon-root':
                      {
                        color:
                          'rgba(255,255,255,0.82)',
                      },

                    '&.active': {
                      bgcolor:
                        'rgba(255,255,255,0.14)',

                      color: '#fff',

                      '& .MuiListItemIcon-root':
                        {
                          color:
                            '#FFE082',
                        },
                    },

                    '&:hover': {
                      bgcolor:
                        'rgba(255,255,255,0.08)',

                      color: '#fff',

                      '& .MuiListItemIcon-root':
                        {
                          color:
                            '#fff',
                        },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 32,

                      color:
                        'inherit',
                    }}
                  >
                    {icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      fontSize: 13,

                      fontWeight: 500,
                    }}
                  />

                  {children ? (
                    openLocation ? (
                      <ExpandLessIcon
                        sx={{
                          fontSize: 18,
                        }}
                      />
                    ) : (
                      <ExpandMoreIcon
                        sx={{
                          fontSize: 18,
                        }}
                      />
                    )
                  ) : null}
                </ListItemButton>

                {/* SUB MENU */}

                {children && (
                  <Collapse
                    in={
                      openLocation
                    }
                    timeout="auto"
                    unmountOnExit
                  >
                    {children.map(
                      (sub) => (
                        <ListItemButton
                          key={
                            sub.to
                          }
                          component={
                            NavLink
                          }
                          to={sub.to}
                          onClick={() =>
                            handleNavClick(
                              sub.to
                            )
                          }
                          sx={{
                            ml: 4,

                            mb: 0.5,

                            borderRadius: 2,

                            py: 0.7,

                            color:
                              'rgba(255,255,255,0.72)',

                            '&.active':
                              {
                                bgcolor:
                                  'rgba(255,255,255,0.12)',

                                color:
                                  '#FFE082',
                              },

                            '&:hover':
                              {
                                bgcolor:
                                  'rgba(255,255,255,0.08)',
                              },
                          }}
                        >
                          <ListItemText
                            primary={
                              sub.label
                            }
                            primaryTypographyProps={{
                              fontSize: 12,

                              fontWeight: 500,
                            }}
                          />
                        </ListItemButton>
                      )
                    )}
                  </Collapse>
                )}
              </Box>
            )
          )
        )}
      </List>
    </Box>
  )

  return (
    <Box
      sx={{
        display: 'flex',

        background:
          'linear-gradient(135deg, #FFF9E6 0%, #FFF4CC 50%, #FDF6E3 100%)',

        minHeight: '100vh',

        overflowX: 'hidden',
      }}
    >
      {/* APPBAR */}

      <AppBar
        position="fixed"
        sx={{
          zIndex: (t) =>
            t.zIndex.drawer + 1,

          background: '#E6D5A7',

          boxShadow: 'none',
        }}
      >
        <Toolbar
          sx={{
            minHeight:
              '68px !important',

            px: 3,

            display: 'flex',

            justifyContent:
              'space-between',

            alignItems: 'center',
          }}
        >
          {/* LEFT */}

          <Box
            sx={{
              display: 'flex',

              alignItems: 'center',

              gap: 2,
            }}
          >
            <IconButton
              color="inherit"
              edge="start"
              onClick={() =>
                setMobileOpen(
                  !mobileOpen
                )
              }
              sx={{
                display: {
                  sm: 'none',
                },
              }}
            >
              <MenuIcon />
            </IconButton>

            <Box
              sx={{
                display: 'flex',

                alignItems: 'center',

                gap: 1.5,
              }}
            >
              <Box
                component="img"
                src={kalotaLogo}
                alt="Kalota Logo"
                sx={{
                  width: 40,

                  height: 40,

                  borderRadius:
                    '50%',

                  objectFit:
                    'cover',

                  border:
                    '2px solid rgba(227,30,36,0.25)',

                  background:
                    '#fff',

                  p: 0.2,

                  boxShadow:
                    '0 2px 10px rgba(0,0,0,0.25)',
                }}
              />

              <Box>
                <Typography
                  sx={{
                    fontSize: {
                      xs: 14,
                      md: 18,
                    },

                    fontWeight: 700,

                    color: '#7A1E1E',

                    lineHeight: 1.1,
                  }}
                >
                  क्षत्रिय कलोता
                  समाज परिवार
                  पोर्टल
                </Typography>

                <Typography
                  sx={{
                    fontSize: 11,

                    color: '#6B4E16',

                    mt: 0.2,
                  }}
                >
                  समाज प्रबंधन
                  प्रणाली
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* RIGHT */}

          <Box
            sx={{
              display: 'flex',

              alignItems: 'center',

              gap: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',

                alignItems: 'center',

                gap: 1.2,

                bgcolor:
                  'rgba(255,255,255,0.45)',

                px: 1.5,

                py: 0.8,

                borderRadius: 3,

                border:
                  '1px solid rgba(0,0,0,0.08)',
              }}
            >
              <Avatar
                src={
                  user?.profileUrl
                }
                sx={{
                  width: 34,

                  height: 34,

                  bgcolor:
                    'rgba(227,30,36,0.15)',

                  color: '#E31E24',

                  fontSize: 13,

                  fontWeight: 700,
                }}
              >
                {(
                  user?.name ||
                  user?.email ||
                  'A'
                )[0].toUpperCase()}
              </Avatar>

              <Box
                sx={{
                  display: {
                    xs: 'none',
                    sm: 'block',
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,

                    fontWeight: 700,

                    color: '#222',

                    lineHeight: 1.2,
                  }}
                >
                  {user?.name ||
                    'Admin'}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 11,

                    color: '#555',

                    lineHeight: 1.2,
                  }}
                >
                  {user?.email}
                </Typography>
              </Box>
            </Box>

            <IconButton
              onClick={handleLogout}
              sx={{
                bgcolor:
                  'rgba(227,30,36,0.12)',

                color: '#E31E24',

                '&:hover': {
                  bgcolor:
                    'rgba(227,30,36,0.2)',
                },
              }}
            >
              <LogoutIcon
                sx={{
                  fontSize: 20,
                }}
              />
            </IconButton>
          </Box>
        </Toolbar>

        <Box
          sx={{
            position: 'absolute',

            bottom: 0,

            left: 0,

            right: 0,

            height: 2,
          }}
        >
          {navigating && (
            <LinearProgress
              sx={{
                height: 2,

                bgcolor:
                  'transparent',

                '& .MuiLinearProgress-bar':
                  {
                    bgcolor:
                      '#E31E24',
                  },
              }}
            />
          )}
        </Box>
      </AppBar>

      {/* SIDEBAR */}

      <Drawer
        variant="permanent"
        sx={{
          ...sidebarSx,

          display: {
            xs: 'none',
            sm: 'block',
          },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() =>
          setMobileOpen(false)
        }
        sx={{
          ...sidebarSx,

          display: {
            xs: 'block',
            sm: 'none',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* MAIN */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,

          width: {
            xs: '100%',

            sm: `calc(100% - ${DRAWER_WIDTH}px)`,
          },

          maxWidth: '100vw',

          overflowX: 'hidden',

          p: 3,

          mt: '68px',

          minHeight: '100vh',

          background:
            'linear-gradient(135deg, #FFF9E6 0%, #FFF4CC 50%, #FDF6E3 100%)',

          opacity:
            navigating ? 0.4 : 1,

          transition:
            'opacity 0.25s ease',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}
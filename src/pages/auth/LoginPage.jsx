import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import { setCredentials } from '../../store/slices/authSlice'
import api from '../../api/axiosInstance'

import kalotaLogo from '../../assets/kshatriya-kalota-logo.png'

const schema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),

  password: yup
    .string()
    .required('Password is required'),
})

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [showPass, setShowPass] =
    useState(false)

  const {
    register,
    handleSubmit,

    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (
    data
  ) => {
    try {
      const res = await api.post(
        '/admin/user/login',
        {
          email: data.email,
          password: data.password,
        }
      )

      const body = res.data

      if (
        body.responseCode !== 200
      ) {
        toast.error(
          body.message ||
            'Invalid credentials'
        )

        return
      }

      const payload =
        body.responseBody

      dispatch(
        setCredentials({
          token:
            payload?.accessToken,

          user:
            payload?.userResponse,
        })
      )

      toast.success(
        'Welcome back!'
      )

      navigate('/dashboard', {
        replace: true,
      })
    } catch (err) {
      toast.error(
        err.response?.data
          ?.message ||
          'Invalid credentials'
      )
    }
  }

  return (
    <div style={styles.root}>
      {/* LEFT PANEL */}

      <div style={styles.left}>
        <div style={styles.leftInner}>
          <div
            style={
              styles.logoLargeWrap
            }
          >
            <img
              src={kalotaLogo}
              alt="Kalota Samaj"
              style={
                styles.logoLarge
              }
            />
          </div>

          <div
            style={
              styles.brandMark
            }
          />

          <h1 style={styles.leftTitle}>
            क्षत्रिय कलोता समाज
            परिवार पोर्टल
          </h1>

          <p style={styles.leftSub}>
            प्रशासनिक प्रबंधन
            प्रणाली
          </p>

          <div
            style={
              styles.featuresGrid
            }
          >
            {[
              'परिवार प्रबंधन',
              'सदस्य प्रबंधन',
              'ग्राम प्रबंधन',
              'कर्मचारी प्रबंधन',
            ].map((f) => (
              <div
                key={f}
                style={
                  styles.featureTag
                }
              >
                <span
                  style={
                    styles.featureDot
                  }
                />

                {f}
              </div>
            ))}
          </div>
        </div>

        <div style={styles.leftBg} />
      </div>

      {/* RIGHT PANEL */}

      <div style={styles.right}>
        <div style={styles.card}>
          {/* LOGO */}

          <div style={styles.logoWrap}>
            <div
              style={styles.logoBox}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="#7A1E1E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <h2 style={styles.title}>
            अपने खाते में लॉग इन
            करें
          </h2>

          <p style={styles.subtitle}>
            प्रशासनिक पैनल तक
            पहुँचने के लिए अपनी
            साख दर्ज करें
          </p>

          <form
            onSubmit={handleSubmit(
              onSubmit
            )}
            style={styles.form}
            noValidate
          >
            {/* EMAIL */}

            <div
              style={styles.fieldWrap}
            >
              <label
                style={styles.label}
              >
                ईमेल
              </label>

              <div
                style={styles.inputWrap}
              >
                <span
                  style={
                    styles.inputIcon
                  }
                >
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                      stroke="#7A1E1E"
                      strokeWidth="2"
                    />

                    <polyline
                      points="22,6 12,13 2,6"
                      stroke="#7A1E1E"
                      strokeWidth="2"
                    />
                  </svg>
                </span>

                <input
                  type="email"
                  placeholder="admin@example.com"
                  style={{
                    ...styles.input,

                    ...(errors.email
                      ? styles.inputError
                      : {}),
                  }}
                  {...register(
                    'email'
                  )}
                />
              </div>

              {errors.email && (
                <span
                  style={
                    styles.errorMsg
                  }
                >
                  {
                    errors.email
                      .message
                  }
                </span>
              )}
            </div>

            {/* PASSWORD */}

            <div
              style={styles.fieldWrap}
            >
              <label
                style={styles.label}
              >
                पासवर्ड
              </label>

              <div
                style={styles.inputWrap}
              >
                <span
                  style={
                    styles.inputIcon
                  }
                >
                  <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                    stroke="#7A1E1E"
                    strokeWidth="2"
                  />

                  <path
                    d="M7 11V7a5 5 0 0 1 10 0v4"
                    stroke="#7A1E1E"
                    strokeWidth="2"
                  />
                </svg>
                </span>

                <input
                  type={
                    showPass
                      ? 'text'
                      : 'password'
                  }
                  placeholder="••••••••"
                  style={{
                    ...styles.input,

                    paddingRight: 44,

                    ...(errors.password
                      ? styles.inputError
                      : {}),
                  }}
                  {...register(
                    'password'
                  )}
                />

                <button
                  type="button"
                  style={
                    styles.eyeBtn
                  }
                  onClick={() =>
                    setShowPass(
                      !showPass
                    )
                  }
                >
                  {showPass ? (
  <svg
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 24 24"
  >
    {/* FULL EYE */}
    <path
      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
      stroke="#7A1E1E"
      strokeWidth="1.5"
    />

    <circle
      cx="12"
      cy="12"
      r="3"
      stroke="#7A1E1E"
      strokeWidth="1.5"
    />

    {/* SLASH */}
    <line
      x1="1"
      y1="1"
      x2="23"
      y2="23"
      stroke="#7A1E1E"
      strokeWidth="1.5"
    />
  </svg>
) : (
  <svg
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
      stroke="#7A1E1E"
      strokeWidth="1.5"
    />

    <circle
      cx="12"
      cy="12"
      r="3"
      stroke="#7A1E1E"
      strokeWidth="1.5"
    />
  </svg>
)}
                </button>
              </div>

              {errors.password && (
                <span
                  style={
                    styles.errorMsg
                  }
                >
                  {
                    errors.password
                      .message
                  }
                </span>
              )}
            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              style={{
                ...styles.submitBtn,

                opacity:
                  isSubmitting
                    ? 0.7
                    : 1,
              }}
              disabled={
                isSubmitting
              }
            >
              {isSubmitting ? (
                <span
                  style={
                    styles.spinnerWrap
                  }
                >
                  <span
                    style={
                      styles.spinner
                    }
                  />

                  Signing in...
                </span>
              ) : (
                'लॉगिन'
              )}
            </button>
          </form>

          <p style={styles.footer}>
            क्षत्रिय कलोता समाज
            परिवार पोर्टल ©{' '}
            {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    background: '#0D0D0D',
    fontFamily:
      'Inter, sans-serif',
  },

  left: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',

    background:
      'linear-gradient(135deg, #FFF9E6 0%, #FFF4CC 50%, #FDF6E3 100%)',

    borderRight:
      '1px solid #E6D5A7',
  },

  leftBg: {
    position: 'absolute',
    inset: 0,

    background:
      'radial-gradient(circle at 20% 30%, rgba(212,175,55,0.25) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(227,30,36,0.08) 0%, transparent 40%)',

    pointerEvents: 'none',
  },

  leftInner: {
    position: 'relative',
    zIndex: 1,
    padding: '48px',
    maxWidth: 440,
  },

  brandMark: {
    width: 60,
    height: 4,
    background: '#D4AF37',
    borderRadius: 2,
    margin: '0 auto 24px',
  },

  logoLargeWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 24,
  },

  logoLarge: {
    width: 180,
    height: 180,
    objectFit: 'contain',
    filter:
      'drop-shadow(0 10px 20px rgba(0,0,0,0.15))',
  },

  leftTitle: {
    fontSize: 36,
    fontWeight: 700,
    color: '#7A1E1E',
    lineHeight: 1.2,
    marginBottom: 12,
    letterSpacing: '-0.5px',
    textAlign: 'center',
  },

  leftSub: {
    fontSize: 16,
    color: '#8A6D3B',
    marginBottom: 40,
    fontWeight: 500,
    textAlign: 'center',
  },

  featuresGrid: {
    display: 'grid',
    gridTemplateColumns:
      '1fr 1fr',
    gap: 12,
  },

  featureTag: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 14px',

    background:
      'rgba(255,255,255,0.6)',

    border:
      '1px solid #E6D5A7',

    borderRadius: 8,

    fontSize: 13,

    color: '#5C4033',

    fontWeight: 600,
  },

  featureDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#E31E24',
    flexShrink: 0,
  },

  right: {
    width: 480,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 24px',

    background:
      'linear-gradient(135deg, #7A1E1E 0%, #5C1414 100%)',

    
  },

  card: {
    width: '100%',
    maxWidth: 400,

    background:
      'linear-gradient(135deg, #FFF9E6 0%, #FFF4CC 50%, #FDF6E3 100%)',
    border:
      '1px solid rgba(255,255,255,0.08)',

    borderRadius: 24,

    padding: '36px 32px',

    boxShadow:
      '0 20px 50px rgba(0,0,0,0.35)',

    backdropFilter:
      'blur(10px)',
  },

  logoWrap: {
    marginBottom: 28,
  },

  logoBox: {
    width: 48,
    height: 48,

    background:
      'rgba(255,244,204,0.08)',

    border:
      '1px solid rgba(255,244,204,0.15)',

    borderRadius: 12,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: 700,
    color: '#7A1E1E',
    marginBottom: 6,
    letterSpacing: '-0.3px',
  },

  subtitle: {
    fontSize: 13,
    color:
      '#7A1E1E',
    marginBottom: 32,
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },

  fieldWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },

  label: {
    fontSize: 14,
    fontWeight: 700,
    color: '#7A1E1E',
  },

  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },

  inputIcon: {
  position: 'absolute',
  left: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#7A1E1E',
  zIndex: 2,
},

  input: {
    width: '100%',
    padding:
      '10px 12px 10px 40px',

    background:
      'rgba(255,255,255,0.08)',

    border:
      '1px solid #7A1E1E',

    borderRadius: 10,

    color: '#7A1E1E',

    fontSize: 14,

    outline: 'none',

    transition:
      'all 0.2s ease',

    fontFamily:
      'Inter, sans-serif',

    backdropFilter:
      'blur(8px)',
  },

  inputError: {
    borderColor: '#E31E24',
  },

  eyeBtn: {
    position: 'absolute',
    right: 12,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: 0,
  },

  errorMsg: {
    fontSize: 12,
    color: '#FFB4B4',
    marginTop: 2,
  },

  submitBtn: {
    marginTop: 4,
    width: '100%',
    padding: '11px 24px',

    background: '#E31E24',

    color: '#FFFFFF',

    border: 'none',
    borderRadius: 10,

    fontSize: 14,
    fontWeight: 600,

    cursor: 'pointer',

    fontFamily:
      'Inter, sans-serif',

    transition:
      'all 0.2s ease',

    letterSpacing: '0.2px',
  },

  spinnerWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  spinner: {
    width: 16,
    height: 16,

    border:
      '2px solid rgba(255,255,255,0.3)',

    borderTopColor: '#fff',

    borderRadius: '50%',

    animation:
      'spin 0.7s linear infinite',

    display: 'inline-block',
  },

  footer: {
    marginTop: 32,
    textAlign: 'center',
    fontSize: 12,

    color:
      '#7A1E1E',
  },
}
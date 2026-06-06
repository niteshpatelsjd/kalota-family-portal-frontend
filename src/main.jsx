import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, createTheme } from '@mui/material'
import { store } from './store'
import App from './App'
import './index.css'
import 'leaflet/dist/leaflet.css'

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30000 } } })

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#E31E24' },
    background: { default: '#0D0D0D', paper: '#111111' },
  },
  typography: { fontFamily: 'Inter, sans-serif' },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none', border: '1px solid #2A2A2A' } } },
    MuiTableCell: { styleOverrides: { root: { borderColor: '#2A2A2A' } } },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
)

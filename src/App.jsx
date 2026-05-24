import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Savor from './pages/Savor'
import Studio from './pages/Studio'
import Potluck from './pages/Potluck'
import RecipePage from './pages/RecipePage'
import DeleteAccount from './pages/DeleteAccount'
import Privacy from './pages/Privacy'
import ForagePrivacy from './pages/ForagePrivacy'
import Terms from './pages/Terms'
import { ThemeProvider } from './context/ThemeProvider'
import Nav from './components/Nav'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/"                    element={<Savor />} />
          <Route path="/potluck"             element={<Potluck />} />
          <Route path="/studio"              element={<Studio />} />
          <Route path="/r/:id"               element={<RecipePage />} />
          <Route path="/delete-account"      element={<DeleteAccount />} />
          <Route path="/privacy"             element={<Privacy />} />
          <Route path="/forage/privacy"      element={<ForagePrivacy />} />
          <Route path="/terms"               element={<Terms />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
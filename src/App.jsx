import { Routes, Route } from 'react-router-dom'
import Savor from './pages/Savor'
import Studio from './pages/Studio'
import Potluck from './pages/Potluck'
import Forage from './pages/Forage'
import About from './pages/About'
import Faq from './pages/Faq'
import RecipePage from './pages/RecipePage'
import DeleteAccount from './pages/DeleteAccount'
import DeleteForageAccount from './pages/DeleteForageAccount'
import Privacy from './pages/Privacy'
import ForagePrivacy from './pages/ForagePrivacy'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'
import { ThemeProvider } from './context/ThemeProvider'
import Nav from './components/Nav'

// Router-agnostic app tree. The Router (BrowserRouter for the client,
// StaticRouter for the prerender build) is supplied by the entry files.
export default function AppRoutes() {
  return (
    <ThemeProvider>
      <Nav />
      <Routes>
        <Route path="/"                         element={<Savor />} />
        <Route path="/potluck"                  element={<Potluck />} />
        <Route path="/forage"                   element={<Forage />} />
        <Route path="/about"                    element={<About />} />
        <Route path="/faq"                      element={<Faq />} />
        <Route path="/studio"                   element={<Studio />} />
        <Route path="/r/:id"                    element={<RecipePage />} />
        <Route path="/delete-account"           element={<DeleteAccount />} />
        <Route path="/forage/delete-account"    element={<DeleteForageAccount />} />
        <Route path="/privacy"                  element={<Privacy />} />
        <Route path="/forage/privacy"           element={<ForagePrivacy />} />
        <Route path="/terms"                    element={<Terms />} />
        <Route path="*"                         element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  )
}
import { Navigate, Routes, Route } from 'react-router-dom'
import Savor from './pages/Savor'
import Studio from './pages/Studio'
import Potluck from './pages/Potluck'
import Caper from './pages/Caper'
import Apocaleaf from './pages/Apocaleaf'
import About from './pages/About'
import Faq from './pages/Faq'
import RecipePage from './pages/RecipePage'
import DemoBlog from './pages/DemoBlog'
import BlogIndex from './pages/blog/BlogIndex'
import SaveHandwrittenRecipeCards from './pages/blog/SaveHandwrittenRecipeCards'
import LifeStoryBeforeTheRecipe from './pages/blog/LifeStoryBeforeTheRecipe'
import DeleteAccount from './pages/DeleteAccount'
import DeleteCaperAccount from './pages/DeleteCaperAccount'
import Privacy from './pages/Privacy'
import CaperPrivacy from './pages/CaperPrivacy'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'
import { ThemeProvider } from './context/ThemeProvider'
import Nav from './components/Nav'
import SeoManager from './components/SeoManager'

// Router-agnostic app tree. The Router (BrowserRouter for the client,
// StaticRouter for the prerender build) is supplied by the entry files.
export default function AppRoutes() {
  return (
    <ThemeProvider>
      <SeoManager />
      <Nav />
      <Routes>
        <Route path="/"                         element={<Savor />} />
        <Route path="/potluck"                  element={<Potluck />} />
        <Route path="/caper"                    element={<Caper />} />
        <Route path="/forage"                   element={<Navigate to="/caper/" replace />} />
        <Route path="/apocaleaf"                element={<Apocaleaf />} />
        <Route path="/about"                    element={<About />} />
        <Route path="/faq"                      element={<Faq />} />
        <Route path="/studio"                   element={<Studio />} />
        <Route path="/r/:id"                    element={<RecipePage />} />
        <Route path="/demo"                     element={<DemoBlog />} />
        <Route path="/blog"                     element={<BlogIndex />} />
        <Route path="/blog/save-handwritten-recipe-cards" element={<SaveHandwrittenRecipeCards />} />
        <Route path="/blog/life-story-before-the-recipe" element={<LifeStoryBeforeTheRecipe />} />
        <Route path="/delete-account"           element={<DeleteAccount />} />
        <Route path="/caper/delete-account"     element={<DeleteCaperAccount />} />
        <Route path="/forage/delete-account"    element={<Navigate to="/caper/delete-account/" replace />} />
        <Route path="/privacy"                  element={<Privacy />} />
        <Route path="/caper/privacy"            element={<CaperPrivacy />} />
        <Route path="/forage/privacy"           element={<Navigate to="/caper/privacy/" replace />} />
        <Route path="/terms"                    element={<Terms />} />
        <Route path="*"                         element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  )
}
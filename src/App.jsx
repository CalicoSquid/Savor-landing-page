import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Savor from './pages/Savor'
import Studio from './pages/Studio'
import RecipePage from './pages/RecipePage'
import { ThemeProvider } from './context/ThemeProvider'
import Nav from './components/Nav'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/"       element={<Savor />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/r/:id"  element={<RecipePage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
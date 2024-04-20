import './App.css'
import { Route, Routes } from 'react-router-dom'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Routes>
      <Route index="true" path='/*' element={<Dashboard />} />
      <Route path='/sign-in' element={<SignInPage />} />
      <Route path='/sign-up' element={<SignUpPage />} />
    </Routes>
  )
}

export default App

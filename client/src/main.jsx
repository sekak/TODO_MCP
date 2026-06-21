import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProtectRoute from './components/ProtectRoute.js'
import PublicLayout from './components/PublicLayout.js'
import SignIn from './pages/SignIn.js'
import SignUp from './pages/SignUp.js'

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectRoute/>,
    children: [
      { path: "/", element: <App /> },
    ],
  },
  {
    element: <PublicLayout/>,
    children: [
      { path: "/signin", element: <SignIn /> },
      { path: "/signup", element: <SignUp /> }
    ]
  }

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

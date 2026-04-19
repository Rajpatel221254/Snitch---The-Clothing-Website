import React from 'react'
import './App.css'
import { RouterProvider } from 'react-router'
import { routes } from './app.routes.jsx'
import { Provider } from 'react-redux'

const App = () => {
  return (
    <RouterProvider router={routes} />
  )
}

export default App
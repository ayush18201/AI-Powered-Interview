import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, RouterProvider, Route} from 'react-router-dom'
import {Home, Category, CategoryDetail, LoginPage, CreateAccountPage} from './components/index.js'
import {Provider} from 'react-redux'
import {store} from './components/Store/store.js'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: 'category',
        element: <Category />,
        // children: [
        //   {
        //     path: ':category',
        //     element: <CategoryDetail />
        //   }
        // ]
      },
      {
        path: 'category/:category',
        element: <CategoryDetail />

      },
      {
        path: 'analytics',
        element: <Category />
      },
      {
        path:'login',
        element: <LoginPage />
      },
      {
        path:'createaccount',
        element: <CreateAccountPage />
      }
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}>
    <App />
    </RouterProvider>
    </Provider>
  </StrictMode>,
)

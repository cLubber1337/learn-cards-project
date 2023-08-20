import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouteObject,
  RouterProvider,
} from 'react-router-dom'

import { Layout } from '@/components/Layout'
import { Loader } from '@/components/ui/Loader/Loader.tsx'
import { CardsPage } from '@/pages/CardsPage/CardsPage.tsx'
import { DecksPage } from '@/pages/DecksPage/DecksPage.tsx'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage/ForgotPasswordPage.tsx'
import { LearnPackPage } from '@/pages/LearnPackPage/ui/LearnPackPage.tsx'
import { LoginPage } from '@/pages/LoginPage/LoginPage.tsx'
import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage.tsx'
import { ProfilePage } from '@/pages/ProfilePage/ui/ProfilePage.tsx'
import { RegistrationPage } from '@/pages/RegistrationPage/RegistrationPage.tsx'
import { useMeQuery } from '@/services/auth/authApi.ts'

const publicRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegistrationPage />,
  },
  {
    path: '/recover',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/recover-password',
    element: <ForgotPasswordPage />,
  },
].map(route => ({
  ...route,
  element: <Layout>{route.element}</Layout>,
}))

const privateRoutes: RouteObject[] = [
  {
    path: '/',
    element: <DecksPage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/cards/:deckId',
    element: <CardsPage />,
  },
  {
    path: '/decks/:deckId/learn',
    element: <LearnPackPage />,
  },
]

function PrivateRoutes() {
  const { data, isLoading } = useMeQuery()

  if (isLoading) return <Loader />
  const isAuthenticated = !!data

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}

const router = createBrowserRouter([
  {
    element: (
      <Layout>
        <PrivateRoutes />
      </Layout>
    ),
    children: privateRoutes,
  },
  ...publicRoutes,
  {
    path: '*',
    element: (
      <Layout>
        <NotFoundPage />
      </Layout>
    ),
  },
])

export const Router = () => {
  return <RouterProvider router={router} />
}

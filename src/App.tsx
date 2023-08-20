import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'

import { Router } from '@/router'
import { store } from '@/services/store.ts'
import 'react-toastify/dist/ReactToastify.css'

export function App() {
  return (
    <Provider store={store}>
      <ToastContainer autoClose={5000} theme="dark" position="top-center" closeOnClick={false} />
      <Router />
    </Provider>
  )
}

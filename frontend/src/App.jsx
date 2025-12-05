import {BrowserRouter,Routes,Route} from 'react-router-dom'
import {AddProduct} from './pages/Add_Product'
import {ViewProduct} from './pages/ViewProduct'
import {Login} from './pages/Login'
import {Register} from './pages/Register'
import { Dashboard } from './pages/Dashboard'

import './App.css'

import {Header} from './components/Header'
function App() {
  
  return (
    <BrowserRouter>
    <Routes>

    <Route path='/' element={<Dashboard/>} />
    {/* <Route path ='/dashboard' element = {<Dashboard/>}/> */}
      <Route path='/login' element={<Login />} />
      <Route path='/add-product' element = {<AddProduct/>}/>
      <Route path ='/view-product' element = {<ViewProduct/>} />
      <Route path="/add-product/:id" element={<AddProduct />} />
    </Routes>

    </BrowserRouter>
  )
}

export default App

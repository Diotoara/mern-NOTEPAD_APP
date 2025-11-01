import { useEffect, useState } from "react"
import Navbar from "./components/Navbar"
import { Route, Navigate , Routes } from "react-router-dom"
import Login from "./components/Login"
import Register from "./components/Register"
import Home from "./components/Home"
import axios from "axios"

function App() {
  const [user, setUser] = useState(null)
  const [loading, setloading] = useState(true)

  useEffect(()=>{
    const fetchUser = async()=>{
      try {
        const token = localStorage.getItem("token");
        if(!token) return;
        const {data} = await axios.get("api/users/me",{
          headers : {Authorization : `Bearer ${token}`}
        })
        setUser(data);
      } catch (error) {
        localStorage.removeItem("token")
      } finally{
        setloading(false)
      }
    }
    fetchUser();
  },[])

  if(loading){
    return(
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-white">
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-500">
      <Navbar user={user} setUser={setUser}/>
      <Routes>

        <Route path='/login' element={user ? <Navigate to ="/"/> :
        <Login setUser={setUser}/> } />

        <Route path='/register' element={user ? <Navigate to ="/"/> :
        <Register setUser={setUser}/> } />

        <Route path="/" element={user? <Home/> : <Navigate to="/login"/> } />
        
      </Routes>
    </div>
  )
}

export default App

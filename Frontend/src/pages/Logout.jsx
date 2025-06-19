import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const Logout = () => {
    //const token = localStorage.getItem('token')
    const navigate = useNavigate()

    axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        if (response.status === 200) {
            //localStorage.removeItem('token')
            navigate('/login')
        }
    })
  return (
    <div>
      Logout
        <p>You have been logged out successfully.</p>
    </div>
  )
}

export default Logout

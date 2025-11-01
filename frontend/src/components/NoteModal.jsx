import React, { useState } from 'react'
import axios from 'axios'

const NoteModal = ({setNote, setModal}) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState('')

    const addNew = async(e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if(!token){
                setError("No Authentication token found. Please LogIn")
                return;
            }
            const {data} = await axios.post("/api/notes",{
                title,
                description,
            }, {
                headers:
                {Authorization: `Bearer ${token}`}
             });
            setNote((prevNotes) => [...prevNotes, data])
            setTitle("");
            setDescription("");
            setModal(false)

        } catch (error) {
            setError(error.response?.data?.message || "Server Error" )
        }
    }

  return (
    <div className='fixed inset-0 bg-black/30 flex items-center justify-center z-50'>
        <div className='bg-gray-500 p-6 rounded-lg w-100 gap-5 flex flex-col items-center'>
            <div className='flex items-center'>
            <h2 className=' text-2xl font-semibold text-white'>Create Note</h2>
            <button onClick={()=>{setModal(false)}} className='mb-10 ml-58 bg-amber-50 fixed hover:bg-red-100 '>❌</button>
            </div>
            {error && <p className='text-red-400'>{error}</p>}
            <input 
            type="text"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            placeholder='Title'
            className='w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400'
            />
            <textarea
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
            placeholder='Description'
            className='w-full h-60 pl-1 border rounded-md outline-none focus:ring-2 focus:ring-blue-400'
            />
            <button onClick={addNew} className='w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700'>Add</button>
        </div>
    </div>
  )
}

export default NoteModal
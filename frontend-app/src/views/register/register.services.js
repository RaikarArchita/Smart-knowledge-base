import {useMutation} from "@tanstack/react-query"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export const useRegister = () => {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: async (data) =>   {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/register`,data)
            return response.data
        },
        onSuccess:(data)=>{
            localStorage.setItem('accessToken',data.access_token)
            navigate('/dashboard')
        },
        onError:(error) =>{
            return error
        }
    })
}


import {useMutation} from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance"

export const useLogin = () => {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: async (data) =>   {
            const response = await axiosInstance.post('/user/login',data)
            return response.data
        },
        onSuccess:()=>{
            navigate('/dashboard')
        },
        onError:(error) =>{
            return error
        }
    })
}


import {useMutation} from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance"

export const useLogout = () => {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: async () =>   {
            const response = await axiosInstance.post('/user/logout')
            return response.data
        },
        onSuccess:()=>{
            navigate('/sign-in')
        },
        onError:(error) =>{
            return error
        }
    })
}


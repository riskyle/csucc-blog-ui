import React from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';

export const useAuth = () => {
    const [errors, setErrors] = React.useState([]);
    const [successMsg, setSuccessMsg] = React.useState("");
    
    const navigate = useNavigate();
    const params = useParams();

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const register = async ({ setErrors, ...props } : {setErrors: any}) => {
        await csrf()

        setErrors([])

        axios
            .post('/register', props)
            .then(() => {
                navigate("/login");
            })
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const login = async ({ setErrors, ...props }: {setErrors: any}) => {
        await csrf()

        setErrors([])

        axios
            .post('/login', props)
            .then(() => {
                navigate("/");
            })
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const logout = async () => {
        await axios.post('/logout').then(() => {})

        window.location.pathname = '/login'
    }

    return {
        register,
        login,
        logout,
    }
}
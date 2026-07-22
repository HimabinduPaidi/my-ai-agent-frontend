import React from 'react'
import { useEffect } from 'react'
import api from '../utils/axios'
import { useUserStore } from '../store'

function useCurrentUser() {
    const setUserData = useUserStore((state) => state.setUserData)
    useEffect(() => {
        const get = async () => {
            try {
                const { data } = await api.get("/api/me")
                setUserData(data.user)
            } catch (error) {
                console.log(error)
            }
        }
        get()
    }, [setUserData])
}

export default useCurrentUser


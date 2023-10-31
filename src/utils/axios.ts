import axios from "axios"


export const api = axios.create({
    baseURL: 'https://hammerhead-app-mvicn.ondigitalocean.app'
})

export const socket = axios.create({
    baseURL: 'ws://localhost:3001'
})

export const jsonServer = axios.create({
    baseURL: 'http://localhost:3333'
})

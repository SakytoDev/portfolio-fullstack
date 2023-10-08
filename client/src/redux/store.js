import { configureStore } from '@reduxjs/toolkit'
import authReducer from './accountSlice'

export default configureStore({
    reducer: {
        auth: authReducer
    }
})
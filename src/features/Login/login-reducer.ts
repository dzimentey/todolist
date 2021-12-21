import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from "../../app/app-reducer";
import {Dispatch} from "redux";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {authAPI, LoginParamsType} from "../../api/todolists-api";
import {addTodolistAC} from "../TodolistsList/todolists-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


const initialState: initialLoginType = {
    isLoggedIn: false
}

const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedInAC: (state, action: PayloadAction<{value: boolean}>) => {
             state.isLoggedIn = action.payload.value
        }
    },
})

export const loginReducer = slice.reducer; /*(state: initialLoginType = initialState, action: ActionsType): initialLoginType => {
    switch (action.type) {
        case "LOGIN/SET-IS-LOGGED-IN":
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}*/

// actions
//export const setIsLoggedInAC = (value: boolean) => ({type: 'LOGIN/SET-IS-LOGGED-IN', value} as const)

export const setIsLoggedInAC = slice.actions.setIsLoggedInAC
// thunks
export const loginTC = (data: LoginParamsType) => (dispatch: ThunkDispatch) => {

    dispatch(setAppStatusAC({status:'loading'}))
        authAPI.login(data)
        .then((res) => {
            if (res.data.resultCode === 0) {

                dispatch(setIsLoggedInAC({value: true}))

                dispatch(setAppStatusAC({status:'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch);
            }
            // dispatch(setAppStatusAC('succeeded'))
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}


export const logoutTC = () => (dispatch: ThunkDispatch) => {

    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.logout()
        .then((res) => {
            if (res.data.resultCode === 0) {

                dispatch(setIsLoggedInAC({value: false}))

                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch);
            }
            // dispatch(setAppStatusAC('succeeded'))
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}


type ActionsType = ReturnType<typeof setIsLoggedInAC>

type initialLoginType = {
    isLoggedIn: boolean
}

type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType>

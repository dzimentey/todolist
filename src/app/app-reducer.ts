import {Dispatch} from "redux";
import {authAPI} from "../api/todolists-api";
import {setIsLoggedInAC} from "../features/Login/login-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    initialized: false,
}

const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setAppErrorAC: (state, action:PayloadAction<{error: string | null}>) => {
            state.error = action.payload.error;
        },
        setAppStatusAC: (state, action:PayloadAction<{status: RequestStatusType}>) => {
            state.status = action.payload.status;
        },
        setInitializedAC: (state, action:PayloadAction<{value: boolean}>) => {
            state.initialized = action.payload.value;
        },
    },
});

export const appReducer = slice.reducer;

// export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//     switch (action.type) {
//         case 'APP/SET-STATUS':
//             return {...state, status: action.status}
//         case 'APP/SET-ERROR':
//             return {...state, error: action.error}
//         case "APP/SET-INITIALIZED":
//             return {...state, initialized: action.value}
//         default:
//             return {...state}
//     }
// }

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
    error: string | null
    initialized: boolean //thru when app has initialized
}

export const setAppErrorAC = slice.actions.setAppErrorAC;/*(error: string | null) => ({type: 'APP/SET-ERROR', error} as const)*/
export const setAppStatusAC = slice.actions.setAppStatusAC; /*(status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)*/
export const setInitializedAC = slice.actions.setInitializedAC; /*(value: boolean) => ({type: 'APP/SET-INITIALIZED', value} as const)*/

export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetInitializedActionTypes = ReturnType<typeof setInitializedAC>

type ActionsType =
    | SetAppErrorActionType
    | SetAppStatusActionType
    | SetInitializedActionTypes

// thunk

export const initializeTC = () => (dispatch: Dispatch) => {
    authAPI.me()
        .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(setIsLoggedInAC({value: true}))
                }
                else {
                    handleServerAppError(res.data, dispatch);
                }
            dispatch(setInitializedAC({value: true}))
            dispatch(setAppStatusAC({status: 'failed'}))
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })

}
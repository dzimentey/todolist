import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from "../../app/app-reducer";
import {Dispatch} from "redux";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {authAPI, LoginParamsType} from "../../api/todolists-api";
import {addTodolistAC} from "../TodolistsList/todolists-reducer";


const initialState: initialLoginType = {
    isLoggedIn: false
}

export const loginReducer = (state: initialLoginType = initialState, action: ActionsType): initialLoginType => {
    switch (action.type) {
        case "LOGIN/SET-IS-LOGGED-IN":
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}

// actions
export const setIsLoggedInAC = (value: boolean) => ({type: 'LOGIN/SET-IS-LOGGED-IN', value} as const)

// thunks
export const loginTC = (data: LoginParamsType) => (dispatch: ThunkDispatch) => {

    dispatch(setAppStatusAC('loading'))
        authAPI.login(data)
        .then((res) => {
            if (res.data.resultCode === 0) {

                dispatch(setIsLoggedInAC(true))

                dispatch(setAppStatusAC('succeeded'))
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

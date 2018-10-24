import { 
    SET_SIGNED_IN, 
    SET_USER_PROFILE,
    ADD_CHANNEL,
    SET_CHANNEL
} from "../constants/action-types";

export const setSignedIn = value => ({
    type: SET_SIGNED_IN,
    payload: value
})

export const setUserProfile = value => ({
    type: SET_USER_PROFILE,
    payload: value
})

export const addChannel = value => ({
    type: ADD_CHANNEL,
    payload: value
})

export const setChannel = value => ({
    type: SET_CHANNEL,
    payload: value
})

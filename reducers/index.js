import { 
    SET_SIGNED_IN,
    SET_USER_PROFILE,
    ADD_CHANNEL,
    SET_CHANNEL
} from '../constants/action-types'

export default (state, action) => {
    switch (action.type) {
        case SET_SIGNED_IN:
            return {
                ...state,
                signedIn: action.payload
            }
        
        case SET_USER_PROFILE:
            return {
                ...state,
                profile: action.payload
            }

        case ADD_CHANNEL:
            if (!state.profile.channels) {
                return {
                    ...state,
                    profile: {
                        ...state.profile,
                        channels: [action.payload]
                    }
                }
            }
            if (!state.profile.channels.includes(action.payload)) {
                return {
                    ...state,
                    profile: {
                        ...state.profile,
                        channels: [...Array.from(state.profile.channels), action.payload]
                    }
                }
            }

        case SET_CHANNEL:
            return {
                ...state,
                channel: action.payload
            }
    }

    return state;
};
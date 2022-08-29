import { createContext } from "react";

export const initialState = {};

export const StateContext = createContext(initialState);

export const reducer = (state, action) => {
    switch (action.type) {
        case "ADD_MULTIPLE":
            return {
                ...state,
                [action.context]: action.payload,
            };
        case "ADD_SINGLE":
            const uiio = state[action.context] || [];
            uiio.push(action.payload);
            return {
                ...state,
                [action.context]: uiio,
            };

        case "CLEAR_ENTITY":
            return {
                ...state,
                [action.context]: null,
            };

        case "REMOVE_ONE":
            const repo = state[action.context] || [];
            const idx = repo.indexOf(action.payload);
            if (idx > -1) {
                repo.splice(idx, 1);
            }
            return {
                ...state,
                [action.context]: repo,
            };

        case "UPDATE_ENTRY":
            const existing = state[action.context] || [];
            const i = existing.indexOf(action.prev);
            if (i > -1) {
                existing.splice(i, 1);
                existing.push(action.payload);
            }
            return {
                ...state,
                [action.payload]: existing,
            };

        case "RESET_STATE":
            return {}

        default:
            return {
                ...state,
            };
    }
};
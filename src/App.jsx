import { useReducer } from "react";
import Navigation from "./navigation/AppNavigation";
import { reducer, initialState, StateContext } from "./state/State";

import useAuth from "./components/hooks/useAuth";

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  useAuth(dispatch, state);
  return (
    <StateContext.Provider value={{ ...state, dispatch }}>
      <Navigation />
    </StateContext.Provider>
  );
}

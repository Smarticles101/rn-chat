import { createStore } from "redux";
import initialState from "./state";
import reducer from "../reducers/index";

const store = createStore(reducer, initialState);

export default store;
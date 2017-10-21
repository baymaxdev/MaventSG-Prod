import { Reducer } from 'react-native-router-flux';
export default reducerCreate = params => {
  const defaultReducer = Reducer(params);
  return (state, action) => {
    let newState = {...state, isFocus: false};
    if(action.type === "REACT_NATIVE_ROUTER_FLUX_FOCUS" && action.routeName === '_discovery' ){
      newState = {...state, isFocus: true}
    }
    return defaultReducer(newState, action);
  }
};
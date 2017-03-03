import { combineReducers } from 'redux'
import { createResponsiveStateReducer } from 'redux-responsive'

const rootReducer = combineReducers({
  browser: createResponsiveStateReducer({
    // corresponds to our Sass breakpoint variables
    mini: 480,  // 30em
    sm: 640,    // 40em
    md: 832,    // 52em
    lg: 1024    // 64em
  })
})

export default rootReducer

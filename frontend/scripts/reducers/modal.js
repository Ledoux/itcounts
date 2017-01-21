import assign from 'lodash.assign'

const CLOSE_MODAL = 'CLOSE_MODAL'
const SHOW_MODAL = 'SHOW_MODAL'

const intialState = {
  isActive: false,
  content: null
}

export default function modal (state = intialState, action) {
  switch (action.type) {
    case SHOW_MODAL:
      return assign({}, state, {
        isActive: true,
        content: action.newContent || state.content
      })
    case CLOSE_MODAL:
      return assign({}, state, {
        isActive: false
      })
    default:
      return state
  }
}

export function closeModal () {
  return { type: CLOSE_MODAL }
}

export function showModal (newContent) {
  return {
    type: SHOW_MODAL,
    newContent
  }
}

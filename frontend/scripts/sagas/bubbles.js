import { call, put, select } from 'redux-saga/effects'
import { takeEvery } from 'redux-saga'

export function * getBubblesData (id) {
  try {
    yield put({type: REQUEST_GET_BUBBLES id})
    const data = yield call(apis.getAsyncData, action.request)
    yield put({
      type: SUCCESS_GET_BUBBLES,
      response: normalize(pages, schemas.BUBBLES_ARRAY)
    })
  } catch (error) {
    yield put({type: FAIL_FETCH, error: error.toString()})
  }
}

export function * watchRequestGetBubbles () {
  yield * takeEvery(REQUEST_GET_BUBBLES, getBubblesData)
}

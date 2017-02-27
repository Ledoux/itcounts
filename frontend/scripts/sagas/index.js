import { fork } from 'redux-saga/effects'

function getSagasFromImportObject (importObject) {
  return Object.keys(importObject)
  // filter only the watch function
  .filter(key => /^watch/.test(key))
  .map(key => importObject[key])
  // filter out other keys on import object
  .filter(saga => typeof saga === 'function')
}

export default function * rootSaga () {
  yield [
    // getSagasFromImportObject(bubblesSagas)
  ].map(fork)
}

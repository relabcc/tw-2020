import { all, call, put, takeEvery } from 'redux-saga/effects';
import { actionTypes } from 'redux-resource';

import sendRequest from '../../utils/request';
import { API_BASE } from './config';

function* handleRequest(target, onSuccess, onError) {
  try {
    const res = yield call(sendRequest, target);
    yield put(onSuccess(res));
  } catch (secError) {
    yield put(onError(secError));
  }
}

function* handleRead({ resourceType, resources, request }) {
  const resourceBase = `${API_BASE}/${resourceType}`;
  if (resources) {
    yield all(resources.map(id => call(
      handleRequest,
      // target
      `${resourceBase}/${id}`,
      // onSuccess
      data => ({
        type: actionTypes.READ_RESOURCES_SUCCEEDED,
        resourceType,
        resources: [data],
      }),
      // onError
      () => ({
        type: actionTypes.READ_RESOURCES_FAILED,
        resourceType,
        resources: [id],
      })
    )));
  } else {
    yield call(
      handleRequest,
       // target
      resourceBase,
       // onSuccess
      (data) => ({
        type: actionTypes.READ_RESOURCES_SUCCEEDED,
        resourceType,
        resources: data,
        request,
      }),
      // onError
      () => ({
        type: actionTypes.READ_RESOURCES_FAILED,
        resourceType,
        request,
      })
    );
  }
}

export default function* apiSagas() {
  yield takeEvery(actionTypes.READ_RESOURCES_PENDING, handleRead);
}

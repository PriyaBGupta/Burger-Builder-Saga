import { takeEvery} from 'redux-saga/effects';
import * as actionTypes from '../action/actionTypes';

import {logoutSaga} from './auth'

export function* watchAuth(){
    yield takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, logoutSaga);
}
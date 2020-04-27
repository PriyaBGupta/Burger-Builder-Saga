import { takeEvery } from 'redux-saga/effects';
import * as actionTypes from '../action/actionTypes';

import { logoutSaga, checkAuthTimeoutSaga, authUserSaga, authCheckStateSaga } from './auth';
import { initIngredientSaga } from './burgerBuilder';

export function* watchAuth() {
    yield takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, logoutSaga);
    yield takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, checkAuthTimeoutSaga);
    yield takeEvery(actionTypes.AUTH_USER, authUserSaga);
}
export function* watchBurgerBuilder(){
    yield takeEvery(actionTypes.AUTH_CHECK_STATE, authCheckStateSaga);
    yield takeEvery(actionTypes.INIT_INGREDIENT, initIngredientSaga);
}
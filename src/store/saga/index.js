import { takeEvery, all, takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../action/actionTypes';

import { logoutSaga, checkAuthTimeoutSaga, authUserSaga, authCheckStateSaga } from './auth';
import { initIngredientSaga } from './burgerBuilder';
import { purchaseBurgerSaga, fetchOrderSaga } from './order';

export function* watchAuth() {
    yield all([
        takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, logoutSaga),
        takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, checkAuthTimeoutSaga),
        takeEvery(actionTypes.AUTH_USER, authUserSaga),
        takeEvery(actionTypes.AUTH_CHECK_STATE, authCheckStateSaga)
    ])
    // it will run concurrently for ex two axios call at same time i.e multiple task ,
    // here it is not required since they are different task
}
export function* watchBurgerBuilder(){
    yield takeEvery(actionTypes.INIT_INGREDIENT, initIngredientSaga);
}
export function* watchOrder(){
    yield takeLatest(actionTypes.PURCHASE_BURGER, purchaseBurgerSaga);
    //execute the lastest one and not if someone is hitting that button again and again
    yield takeEvery(actionTypes.FETCH_ORDER, fetchOrderSaga);
}

//Saga provides side effects in different file and in linear way
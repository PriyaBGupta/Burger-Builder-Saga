import delay from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import * as actions from '../action/index';
import axios from 'axios';

export function* logoutSaga(action) {
    //easily testable
    yield call([localStorage, 'removeItem'],'token');
    yield call([localStorage, 'removeItem'],'expirationDate');
    yield call([localStorage, 'removeItem'],'userId');
    yield put(actions.logoutSucceed())
}
export function* checkAuthTimeoutSaga(action) {
    yield delay(action.expirationTime * 1000);
    yield actions.authLogout();
}

export function* authUserSaga(action) {
    yield put(actions.authStart());
    const authData = {
        email: action.email,
        password: action.password,
        returnSecureToken: true
    }
    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBVsC_HzAhC3Vuv-TdFs8ea3KDf44vFpSA';
    if (!action.isSignup) {
        url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBVsC_HzAhC3Vuv-TdFs8ea3KDf44vFpSA';
    }
    try {
        const response = yield axios.post(url, authData);

        //expiresIn is in secs
        yield localStorage.setItem('token', response.data.idToken);
        yield localStorage.setItem('userId', response.data.localId);
        //we also want to store expiration time but we wil store expiration date because 
        //that gives us exact date when this token need to be expired since first login
        const expirationDate = yield new Date(new Date().getTime() + response.data.expiresIn * 1000);
        yield localStorage.setItem('expirationDate', expirationDate);

        yield put(actions.authSucess(response.data.idToken, response.data.localId));
        yield put(actions.checkAuthTimeout(response.data.expiresIn));
    } catch (err) {
        yield put(actions.authFail(err.response.data.error));
    }
}

export function* authCheckStateSaga(action){
    const token = yield localStorage.getItem('token');
        if (!token) {
            // token is null it means you need to logout
            yield put(actions.authLogout());
        } else {

            const expirationDate = yield new Date(localStorage.getItem('expirationDate'));
            if (expirationDate > new Date()) {
                //token is present then again set the expiration time and also run auth success
                const userId = yield localStorage.getItem('userId');
                const expirationTime = yield (expirationDate.getTime() - new Date().getTime()) / 1000;
                yield put(actions.authSucess(token, userId))
                // here arguments for checkExpiration is in secs
                // we need
                yield put(actions.checkAuthTimeout(expirationTime));
            } else {
                //we need to logout
                yield put(actions.authLogout());
            }
        }
}

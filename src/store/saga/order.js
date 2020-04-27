import { put } from 'redux-saga/effects';
import * as actions from '../action/index';
import axios from '../../axios-orders';

export function* purchaseBurgerSaga(action){
    yield put(actions.purchaseBurgerStart());
    const response = yield axios.post('/orders.json?auth=' + action.token, action.orderData)
        try{
            yield put(actions.purchaseBurgerSuccess(response.data.name, action.orderData));
        }
        catch(error){ 
            yield put(actions.purchaseBurgerFail(error));
        };
}

export function* fetchOrderSaga(action){
    yield put(actions.fetchOrderStart());
    const queryParam = '?auth=' + action.token + '&orderBy="userId"&equalTo="' + action.userId + '"';
    try{
    const res = yield axios.get('/orders.json' + queryParam)
            const fetchOrders = [];
            //res.data is object whose first property is unique identifier 
            for (let key in res.data) {
                fetchOrders.push({
                    ...res.data[key],
                    id: key
                });
            }
        yield put(actions.fetchOrderSuccess(fetchOrders));
        }
        catch(err) {
            yield put(actions.fetchOrderFail());
        };
}
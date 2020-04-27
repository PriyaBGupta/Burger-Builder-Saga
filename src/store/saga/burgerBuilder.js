import { put } from 'redux-saga/effects';
import * as actions from '../action/index';
import axios from 'axios';

export function* initIngredientSaga(action) {
    //if we remove .json then url breaks down but since error handling is in parent component and in component did mount thats why it is not being called
    try {
        const response = yield axios.get('https://react-my-burger-d6f2d.firebaseio.com/ingredients.json')
        yield put(actions.setIngredients(response.data));
    }
    catch (error) {
        yield put(actions.fetchIngredientsFailed())
    };
}
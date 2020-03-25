import {combineReducers} from 'redux';

const INITIAL_STATE = {
    regions: [],
};

const dataReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'ADD_REGION':
            const {regions} = state;
            let values = action.region;
            if (Object.keys(values).length !== 5) {
                console.warn('the data is corrupted');
                return state
            }
            regions.push(values);
            return {regions};
        default:
            return state
    }
};

export default combineReducers({
    data: dataReducer,
});

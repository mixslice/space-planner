import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import localForage from 'localforage';
import rootReducer from './reducer';

const persistConfig = {
  key: 'root',
  storage: localForage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  const store = createStore(
    persistedReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
  let persistor = persistStore(store);
  return { store, persistor };
};

import React,{useState} from 'react';
import {Provider} from 'react-redux'
import {combineReducers, createStore, applyMiddleware} from 'redux'
import {AppLoading} from 'expo'
import * as Font from 'expo-font'
import ReduxThunk from 'redux-thunk'

import ShopNavigator from './navigation/ShopNavigator'
import productReducer from './store/reducers/products'
import cartReducer from './store/reducers/cart'
import orderReducer from './store/reducers/orders'
import authReducer from './store/reducers/Auth'

const rootReducer = combineReducers({
  products : productReducer,
  cart: cartReducer,
  order: orderReducer,
  auth : authReducer
})
const store =  createStore(rootReducer, applyMiddleware(ReduxThunk));
const fetchFonts = ()=>{
  return Font.loadAsync({
    'tradeWin': require('./assets/fonts/TradeWinds-Regular.ttf'),
    'openSans' : require('./assets/fonts/OpenSans-Regular.ttf')
  })
}
export default function App() {
  const [loadFont, setLoadFont] =  useState(true);
  if (loadFont) {
    return <AppLoading startAsync={fetchFonts} onFinish={()=>setLoadFont(false)} onError={(e)=>console.log(e)}/>
  }
  return (
    <Provider store={store}>
      <ShopNavigator/>
    </Provider>
  );
}


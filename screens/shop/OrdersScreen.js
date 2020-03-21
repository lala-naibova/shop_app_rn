import React,{useState, useEffect, useCallback} from 'react'
import {FlatList, Text, Platform} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'
import {HeaderButtons, Item} from 'react-navigation-header-buttons'

import HeaderButton from '../../components/UI/HeaderButton'
import OrderItem from '../../components/shop/OrderItem'
import * as orderActins from '../../store/actions/orders'

export default function OrdersScreen(props) {
   const orders = useSelector(state=>state.order.orders);
   const dispatch = useDispatch();
   useEffect(()=>{
    dispatch(orderActins.fetchOrder());
   },[dispatch])
    return (
        <FlatList
        data={orders}
    renderItem={itemData=> <OrderItem 
    key={itemData.item.productId}
    amount={itemData.item.totalAmount}
    date={itemData.item.readableDate}
    items={itemData.item.items}/>}/>
    )
}
OrdersScreen.navigationOptions= navData => {
    return {
        headerLeft: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item title='Menu'
        iconName={Platform.OS==='android'?'md-menu':'ios-menu'}
        onPress={()=>{
            navData.navigation.toggleDrawer();
            }}/>
    </HeaderButtons>,
    headerTitle : 'Your orders'
    }
    
}
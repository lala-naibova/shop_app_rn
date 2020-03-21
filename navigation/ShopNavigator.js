import React from 'react'
import {Platform, SafeAreaView, Button, View} from 'react-native'
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import { createDrawerNavigator, DrawerItems} from 'react-navigation-drawer'
import { Ionicons } from '@expo/vector-icons'
import {useDispatch} from 'react-redux'

import CartScreen from '../screens/shop/CartScreen'
import OrdersScreen from '../screens/shop/OrdersScreen'
import ProductDetailScreen from '../screens/shop/ProductDetailScreen'
import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen'
import EditProductScreen from '../screens/user/EditProductScreen'
import UserProductsScreen from '../screens/user/UserProductsScreen'
import StartUpScreen from '../screens/StartUpScreen'

import AuthScreen from '../screens/user/AuthScreen'
import Colors from '../constants/Colors'

import * as authActions from '../store/actions/Auth'


const defaultOptions = {
    headerStyle:{
        backgroundColor: Platform.OS==='android'? Colors.primary:'',
    },
    headerTitleStyle:{
        fontFamily:'tradeWin'
    },
    headerTintColor : Platform.OS === 'android'? 'white':Colors.primary
}

const ProductNavigator = createStackNavigator({
    ProductOverview : ProductsOverviewScreen,
    ProductDetail : ProductDetailScreen,
    Cart : CartScreen
    },
    {
    defaultNavigationOptions: defaultOptions,
    navigationOptions:{
        drawerIcon: drawerConfig=>(
            <Ionicons
            name={Platform.OS==='android'?'md-cart':'ios-cart'}
            size={23}
            color={drawerConfig.tintColor}/>
        )
    }
}
);
const OrdersNavigator = createStackNavigator({
    Orders : OrdersScreen
},{
    navigationOptions:{
        drawerIcon : drawerConfig=>(
            <Ionicons 
            name={ Platform.OS==='android'? 'md-list':'ios-list'}
            size={23}
            color={drawerConfig.tintColor}/>
        )

    },
    defaultNavigationOptions: defaultOptions
});

const AdminNavigator = createStackNavigator({
    UserProducts : UserProductsScreen,
    EditProduct : EditProductScreen
},{
    navigationOptions:{
        drawerIcon : drawerConfig=>(
            <Ionicons 
            name={ Platform.OS==='android'? 'md-create':'ios-create'}
            size={23}
            color={drawerConfig.tintColor}/>
        )

    },
    defaultNavigationOptions: defaultOptions
});

const ShopNavigator = createDrawerNavigator({
    Products :ProductNavigator,
    Orders: OrdersNavigator,
    Admin: AdminNavigator
},{
    contentOptions: {
        activeTintColor: Colors.primary
    },
    contentComponent : props=>{
        const dispatch = useDispatch()
        return <View style={{flex:1, padding:20, marginTop:20}}>
            <SafeAreaView forceInset={{top:'always', horizontal:'never'}}>
                <DrawerItems {...props}/>
                <Button title='Logout'
                color={Colors.primary}
                onPress={()=>{
                    dispatch(authActions.logout());
                    props.navigation.navigate('Auth')
                    }}/>
            </SafeAreaView>
        </View>
    }
});

const AuthNavigator =  createStackNavigator({
    AuthScn : AuthScreen
},
{defaultNavigationOptions: defaultOptions});

const MainNavigator = createSwitchNavigator({
    StartUp :StartUpScreen,
    Auth : AuthNavigator,
    Shop : ShopNavigator
})

export default createAppContainer(MainNavigator)
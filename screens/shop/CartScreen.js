import React,{useState} from 'react'
import {View, Text, Button, StyleSheet, FlatList, ActivityIndicator, ActivityIndicatorBase} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'

import Colors from '../../constants/Colors'
import CartItem from '../../components/shop/CartItem'
import * as CartActions from '../../store/actions/cart'
import * as OrderActions from '../../store/actions/orders'

export default function CartScreen(props) {
    const [isLoading, setIsLoading] = useState(false);
    const totalAmount = useSelector(state=>state.cart.totalAmount);
    const dispatch = useDispatch();
    const selectedProducts = useSelector(state=>{
        const transformedCartItems =[];
        for (const key in state.cart.items) {
            transformedCartItems.push({
                productId : key,
                quantity: state.cart.items[key].quantity,
                productTitle : state.cart.items[key].productTitle,
                productPrice : state.cart.items[key].productPrice,
                sum : state.cart.items[key].sum
            })
        }
        return transformedCartItems.sort((a,b)=>{return a.productId > b.productId});
    })
    const sendOrderHandler = async ()=> {
       setIsLoading(true);
       await dispatch(OrderActions.addOrder(selectedProducts, totalAmount));
       //setIsLoading(false);
    }
    if (isLoading) {
        <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary}/>
        </View>
    }
    return (
        <View style={styles.screen}>
            <View style={styles.summary}>
                <Text style={styles.summaryText}>Total:{' '} $
                <Text style={styles.amount}>{Math.round(totalAmount.toFixed(2)*100)/100}</Text></Text>
                <Button 
                color={Colors.accent} 
                title='Order now'
                disabled ={selectedProducts.length===0}
                onPress={sendOrderHandler}/>
            </View>
            <FlatList
            data={selectedProducts}
            renderItem={(itemData)=><CartItem 
            deletable={true}
            key = {itemData.item.id}
            quantity={itemData.item.quantity}
            title = {itemData.item.productTitle}
            sum={itemData.item.sum}
            onRemove={()=>{dispatch(CartActions.removeFromCart(itemData.item.productId))}}/>}/>
        </View>
    )
}
CartScreen.navigationOptions={
    headerTitle : 'Your Cart'
}

const styles= StyleSheet.create({
screen:{
    margin:20
},
summary:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:"space-between",
    marginBottom:20,
    padding :10,
    shadowColor:'black',
    shadowOpacity:0.26,
    shadowRadius:8,
    shadowOffset:{width:0, height:2},
    elevation:8,
    backgroundColor:'white',
    borderRadius:10,
},
summaryText:{
    fontFamily:'openSans',
    fontSize:18
},
amount:{
    color:Colors.amount
},
centered:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
}
})
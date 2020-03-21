import React from 'react'
import {Image, View, Text, Button, StyleSheet, ScrollView} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'

import Colors from '../../constants/Colors'
import * as CartActions from '../../store/actions/cart'

export default function ProductDetailScreen(props) {
    const id = props.navigation.getParam('id')
    const currProduct = useSelector(state=>
        state.products.availableProducts.find (prod => prod.id === id));
    const dispatch = useDispatch()
    return (
        <ScrollView>
            <Image style={styles.image} source={{uri:currProduct.imageUrl}}/>
            <View style={styles.actions}>
                <Button 
                color={Colors.primary} 
                title='add to cart' 
                onPress={()=> {
                    dispatch(CartActions.addToCart(currProduct))
                }} />
            </View>
            <View style={styles.details}>
                <Text style={styles.price}>${currProduct.price.toFixed(2)}</Text>
                <Text style={styles.description}>{currProduct.description}</Text>
            </View>
        </ScrollView>
    )
}
ProductDetailScreen.navigationOptions = navData =>{
    return {
        headerTitle : navData.navigation.getParam('title')
    }
}
const styles= StyleSheet.create({
image:{
    width:'100%',
    height:300
},
actions:{
    marginVertical:20,
    alignItems:'center'
},
price:{
    fontSize:20,
    color:'#888',
    textAlign:'center',
    marginVertical:5
},
description:{
    fontSize:16,
    textAlign:'center',
    marginHorizontal:4
}
})

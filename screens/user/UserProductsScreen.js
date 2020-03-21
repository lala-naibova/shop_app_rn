import React,{useState} from 'react'
import {FlatList, Button, Alert, Platform, View, Text} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'
import {HeaderButtons, Item} from 'react-navigation-header-buttons'

import HeaderButton from '../../components/UI/HeaderButton'
import ProductItem from '../../components/shop/ProductItem'
import Colors from '../../constants/Colors'
import * as productActions from '../../store/actions/products'

export default function UserProductsScreen(props) {
    const userProducts = useSelector(state=>state.products.userProducts);
    const dispatch = useDispatch();
    const selectHandler = (id) =>{
        props.navigation.navigate('EditProduct',{productId:id})
    };
    const deleteHandler = (id)=>{
        Alert.alert('Are you sure?','Do you really wanna delete this item?',
        [{text:'No', style:'default'},
        {text:'Yes',style:'destructive', onPress:()=>{dispatch(productActions.deleteProduct(id))} }])
    }
    if (userProducts.length === 0) {
        return <View style={{flex:1,justifyContent:'center', alignItems:'center'}}>
            <Text>No products found. Maybe creating some??</Text>
        </View>
    }
    return (
        <FlatList
        data={userProducts}
        renderItem={itemData=><ProductItem
        key={itemData.item.id}
        image={itemData.item.imageUrl}
        title={itemData.item.title}
        price={itemData.item.price}
        onSelect={()=>{selectHandler(itemData.item.id)}}>
            <Button
                    color={Colors.primary}
                    title='edit'
                    onPress={()=>{selectHandler(itemData.item.id)}}/>
                    <Button
                    color={Colors.primary}
                    title='delete'
                    onPress={()=>deleteHandler(itemData.item.id)}/>
        </ProductItem>}/>
    )
}
UserProductsScreen.navigationOptions= navData => {
    return {
        headerLeft: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item title='Menu'
        iconName={Platform.OS==='android'?'md-menu':'ios-menu'}
        onPress={()=>{
            navData.navigation.toggleDrawer();
            }}/>
    </HeaderButtons>,
    headerTitle : 'Your products',
    headerRight : ()=> <HeaderButtons HeaderButtonComponent={HeaderButton}>
    <Item title='add'
    iconName={Platform.OS==='android'?'md-create':'ios-create'}
    onPress={()=>{navData.navigation.navigate('EditProduct')}}/>
</HeaderButtons>
    }
    
}
import React,{useEffect, useState, useCallback} from 'react';
import {FlatList, StyleSheet, Platform, Button, View, ActivityIndicator} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'
import {HeaderButtons, Item} from 'react-navigation-header-buttons'

import HeaderButton from '../../components/UI/HeaderButton'
import ProductItem from '../../components/shop/ProductItem'
import * as CartActions from '../../store/actions/cart'
import * as productActions from '../../store/actions/products'
import Colors from '../../constants/Colors'


const ProductsOverviewScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState()
    const products =  useSelector(state =>{return state.products.availableProducts})
    const dispatch = useDispatch();
    const selectItemHandler =(id, title)=>{
            props.navigation.navigate('ProductDetail',
            {id:id, title:title})
    };
    const loadProduct = useCallback (async ()=>{
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(productActions.fetchProducts());
        } catch (error) {
            setError(error.message)
        }
        setIsRefreshing(false);
    },[dispatch, setIsLoading, setError]);
    useEffect(()=>{
        const willFocusSub = props.navigation.addListener('willFocus', loadProduct);
        return ()=>{
            willFocusSub.remove();
        }
    },[loadProduct])
    
    useEffect(() => {
        setIsLoading(true)
        loadProduct().then(()=>{
            setIsLoading(false)
        });
    },[dispatch, loadProduct]);

    if (error) {
        <View style={styles.centered}>
                    <Text>An error ocurred!</Text>
                    <Text>{error}</Text>
                    <Button title='try again' onPress={loadProduct} color={Colors.primary}/>
              </View>
    }
    if (isLoading) {
        return ( <View style={styles.centered}>
                    <ActivityIndicator 
                      size='large'
                      color={Colors.primary}/>
                </View>)
    }
    if (isLoading && products.length === 0) {
       return <View style={styles.centered}>
                    <Text>No products found. Maybe start to adding some!</Text>
              </View>
    }
    return (
        <FlatList
        keyExtractor={item=>item.id}
        onRefresh={loadProduct}
        refreshing={isRefreshing}
        data={products}
        renderItem={itemData=><ProductItem
            title={itemData.item.title}
            price={itemData.item.price}
            image={itemData.item.imageUrl}
            onSelect={()=>{
                selectItemHandler(itemData.item.id,itemData.item.title)
            }}>
                    <Button
                    color={Colors.primary}
                    title='view details'
                    onPress={()=>{selectItemHandler(itemData.item.id,itemData.item.title)}}/>
                    <Button
                    color={Colors.primary}
                    title='to cart'
                    onPress={()=>{ dispatch(CartActions.addToCart(itemData.item)) }}/>
            </ProductItem>
                }/>
    );
}
ProductsOverviewScreen.navigationOptions= navData => {
    return {
    headerTitle : 'All products',
    headerLeft: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
    <Item title='Menu'
    iconName={Platform.OS==='android'?'md-menu':'ios-menu'}
    onPress={()=>{
        navData.navigation.toggleDrawer();
        }}/>
</HeaderButtons>,
    headerRight : ()=> <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item title='cart'
        iconName={Platform.OS==='android'?'md-cart':'ios-cart'}
        onPress={()=>{navData.navigation.navigate('Cart')}}/>
    </HeaderButtons>
}
}

const styles=  StyleSheet.create({
    centered:{flex:1, justifyContent:'center', alignItems:'center'}
})
export default ProductsOverviewScreen;

import React,{ useEffect,useState, useCallback, useReducer} from 'react'
import {View, StyleSheet, ScrollView,Platform, Alert, KeyboardAvoidingView} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'
import {HeaderButtons, Item} from 'react-navigation-header-buttons'

import HeaderButton from '../../components/UI/HeaderButton'
import * as productActions from '../../store/actions/products'
import Input from '../../components/UI/Input'

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE'
const formReducer = (state, action)=>{
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues ={
            ...state.inputValues,
            [action.input] : action.value
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]:action.isValid
        }
        let updatedFormIsValid =  true;
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }
        return{
            formIsValid: updatedFormIsValid,
            inputValues: updatedValues,
            inputValidities: updatedValidities
        }
    }
    return state;
}

export default function EditProductScreen(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    
    const id = props.navigation.getParam('productId');
    const editedProducts =  useSelector(state=>
        state.products.userProducts.find(prod=>prod.id===id))
    
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer,{
        inputValues:{
            title : editedProducts? editedProducts.title :'',
            imageUrl : editedProducts? editedProducts.imageUrl :'',
            description : editedProducts? editedProducts.description :'',
            price : ''
        },
        inputValidities:{
            title : editedProducts? true: false,
            imageUrl : editedProducts? true: false,
            description : editedProducts? true: false,
            price : editedProducts? true: false,
        },
        formIsValid: editedProducts? true: false,
    })
    useEffect(() => {
        if (error) {
          Alert.alert('An error occurred!', error, [{ text: 'Okay' }]);
        }
      }, [error]);

    const inputChangeHandler= useCallback(
        (inputIdentifier, inputValue, inputValidity)=>{
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input : inputIdentifier})
    },[dispatchFormState]);

   const submitHandler = useCallback( async ()=>{
       if (!formState.formIsValid) {
           Alert.alert('Wrong input!','Please check the errors in the form',[{text:'Okay'}]);
           return;
       }
       setError(null);
        setIsLoading(true);
        try{
            if (editedProducts) {
               await dispatch(
                productActions.updateProduct(
                 id, 
                 formState.inputValues.title,
                 formState.inputValues.description,
                 formState.inputValues.imageUrl, 
                 ));
            }
            else{
                await dispatch(
                productActions.createProduct(
                 formState.inputValues.title, 
                 formState.inputValues.description,
                 formState.inputValues.imageUrl, 
                 +formState.inputValues.price, 
                 ));
            }
            props.navigation.goBack();
        } catch (err) {
            setError(err.message);
          }
      
          setIsLoading(false);
   },[dispatch, id, formState]);
   
   useEffect(()=>{
       props.navigation.setParams({submit:submitHandler});
   },[submitHandler]);

    return (
        <KeyboardAvoidingView 
        style={{flex:1}}
        behavior='padding'
        keyboardVerticalOffset={100} >
        <ScrollView>
            <View style={styles.form}>
               <Input label='Title'
               id='title'
               keyboardType='default'
               autoCapitalize='sentences'
               errorText ='Please enter a valid title!'
               onInputChange={inputChangeHandler}
               initialValue ={editedProducts? editedProducts.title : ''}
               initiallyValid ={!!editedProducts}
               required
               />
               <Input label='Image URL'
               id='imageUrl'
               keyboardType='default'
               errorText ='Please enter a valid imageUrl!'
               onInputChange={inputChangeHandler}
               initialValue ={editedProducts? editedProducts.imageUrl : ''}
               initiallyValid ={!!editedProducts}
               required
               />
             {editedProducts? null : (
                <Input label='Price'
                id='price'
                keyboardType='decimal-pad'
                errorText ='Please enter a valid price!'
                onInputChange={inputChangeHandler}
                required
                min={0.1}
                />)
            }
                <Input label='Description'
                id='description'
               keyboardType='default'
               autoCapitalize='sentences'
               errorText ='Please enter a valid description!'
               numberOfLines={5}
               onInputChange={inputChangeHandler}
               initialValue ={editedProducts? editedProducts.description : ''}
               initiallyValid ={!!editedProducts}
               required
               />
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
    )
}
EditProductScreen.navigationOptions = navData=>{
    const submitFn = navData.navigation.getParam('submit')
   return {
    headerTitle: navData.navigation.getParam('productId')
    ?'Edit Product'
    :'Add Product',
    headerRight : ()=> <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item 
        title='save'
        iconName={Platform.OS==='android'?'md-checkmark':'ios-checkmark'}
        onPress={submitFn}/>
                        </HeaderButtons>
   }
}
const styles= StyleSheet.create({
form:{
    margin:20,
},
formContainer:{
width:'100%'
},
label:{
    fontFamily:'tradeWin',
    marginVertical:8,
    fontSize:16
},
input:{
    paddingHorizontal:2,
    paddingVertical:5,
    borderColor:'#ccc',
    borderBottomWidth:1
},
})

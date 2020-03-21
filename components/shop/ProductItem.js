import React from 'react'
import {View, Text, StyleSheet, Image, TouchableOpacity, TouchableNativeFeedback, Platform} from 'react-native'

import Colors from '../../constants/Colors'

export default function ProductItem(props) {
    let TouchableCurr = TouchableOpacity;
    if (Platform.OS==='android' && Platform.Version >= 21) {
        TouchableCurr = TouchableNativeFeedback;
    }
  
    return (

            <View style={styles.product}>
                <TouchableCurr onPress={props.onSelect} useForeground>
                <View >
                    <Image style={styles.image} source={{uri:props.image}}/>
                    <View style={styles.details}>
                        <Text style={styles.title}>{props.title}</Text>
                        <Text style={styles.price}>${props.price.toFixed(2)}</Text>
                    </View>
                <View style={styles.actions}>
                   {props.children}
                </View>
                </View>
                </TouchableCurr>
        </View>

    )
}

const styles = StyleSheet.create({
touchablePlace:{
borderRadius:10,
overflow:'hidden'
    },
product:{
    height:300,
    margin:20,
    shadowColor:'black',
    shadowOpacity:0.26,
    shadowRadius:8,
    shadowOffset:{width:0, height:2},
    elevation:8,
    backgroundColor:'white',
    borderRadius:10,
    overflow:'hidden'
},
image:{
    width:'100%',
    height:'60%'
},
details:{
    alignItems:'center',
    height:'15%'
},
title:{
    fontSize:18,
    marginVertical:2,
    fontFamily:'tradeWin'
},
price:{
    fontSize:14,
    color: '#888',
    marginVertical:4,
},
actions:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    height:'25%',
    paddingHorizontal:20
}
})
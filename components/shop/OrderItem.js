import React,{useState} from 'react'
import {View,Text,Button,StyleSheet} from 'react-native'

import CartItem from './CartItem'
import Colors from '../../constants/Colors'

export default function OrderItem(props) {
    const [showDetail, setShowDetail] = useState(false)
    return (
        <View style={styles.orderItem}>
                <View style={styles.summary}>
                    <Text style={styles.totalAmount}>${props.amount.toFixed(2)}</Text>
                    <Text style={styles.date}>{props.date}</Text>
                </View>
                <View style={styles.action}>
                <Button 
                color={Colors.primary} 
                title={showDetail? 'hide details' :'show details'} 
                onPress={()=>{
                    setShowDetail(prevState => !prevState)
                }}/>
                </View>
        {showDetail && <View style={styles.detailItem}>
            {props.items.map((cartItem,indx)=><CartItem 
            key={indx}
            deletable={false}
            quantity={cartItem.quantity}
            title={cartItem.productTitle}
            sum={cartItem.sum}/>)
            }
            </View>}
        </View>
    )
}
const styles= StyleSheet.create({
    orderItem : {
    shadowColor:'black',
    shadowOpacity:0.26,
    shadowRadius:8,
    shadowOffset:{width:0, height:2},
    elevation:8,
    backgroundColor:'white',
    borderRadius:10,
    overflow:'hidden',
    margin:20,
    padding:10
    },
    summary:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    totalAmount:{
        fontWeight:'bold',
        fontSize:16
    },
    date:{
        fontSize:16,
        color:'#888'
    },
    action:{
        marginVertical:10,
        alignItems:'center',
    },
    detailItem:{
width:'100%'
    }
})
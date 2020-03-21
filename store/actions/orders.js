import Order from '../../models/order'
export const ADD_ORDER = 'ADD_ORDER'
export const SET_ORDERS = 'SET_ORDERS'

export const fetchOrder = ()=>{
    return async (dispatch, getState)=>{
        const userId = getState().auth.userId;
        const response = await fetch(`https://shopapp112233.firebaseio.com/orders/${userId}.json`);
        const resData = await response.json();
        const loadedData = [];
        for (const key in resData) {
            loadedData.push(new Order(
                key,
                resData[key].cartItems,
                resData[key].totalAmount,
                new Date(resData[key].date)
                )
            );
        }
        dispatch({type: SET_ORDERS, orders: loadedData})

    }

}

export const addOrder = (cartItems, totalAmount)=>{
        return async (dispatch,getState) =>{
                const token = getState().auth.token;
                const userId = getState().auth.userId;
                const date = new Date();
        const response = await fetch(`https://shopapp112233.firebaseio.com/orders/${userId}.json?auth=${token}`,{
                method: 'POST',
                headers:{
                        'Content-Type' :'application/json'
                },
                body:JSON.stringify({
                        cartItems,
                        totalAmount,
                        date: date.toISOString()
                })});
                const resData = await response.json();

                dispatch({ type:ADD_ORDER,
                        orderData:{
                           id: resData.name,
                           items: cartItems,
                           amount: totalAmount,
                           date: date
                   }})
        }
}
import {ADD_TO_CART, REMOVE_FROM_CART} from '../actions/cart'
import CartItem from '../../models/cart_item'
import {ADD_ORDER} from '../actions/orders'
import { DELETE_PRODUCT } from '../actions/products'

const initialSate = {
    items :{},
    totalAmount:0
}

export default (state=initialSate, action)=>{
    switch (action.type) {
        case ADD_TO_CART:
            const addedProduct = action.product;
            const id = addedProduct.id;
            const title =  addedProduct.title;
            const price = addedProduct.price;
            let updatedOrNewItem;
            if (state.items[id]) {
                updatedOrNewItem = new CartItem(
                    state.items[id].quantity + 1,
                    price,
                    title,
                    state.items[id].sum + price
                    );
            }
            else{
               updatedOrNewItem = new CartItem( 1, price, title , price);
            }
            return {
                ...state,
                items : {...state.items, [id] : updatedOrNewItem},
                totalAmount : state.totalAmount + price
            }
        case REMOVE_FROM_CART:
            const currItem= state.items[action.pid];
            const currQuantity = currItem.quantity;
            let updateCartItems;
            if (currQuantity > 1) {
                const updatedItem = new CartItem(
                    currItem.quantity-1,
                    currItem.productPrice,
                    currItem.productTitle,
                    currItem.sum - currItem.productPrice
                );
                updateCartItems = {...state.items, [action.pid]: updatedItem}
            }
            else{
                updateCartItems = {...state.items};
                delete updateCartItems[action.pid]
            }
            return{
                ...state,
                items:updateCartItems,
                totalAmount : state.totalAmount - currItem.productPrice
            }
        case ADD_ORDER:
            return initialSate
        case DELETE_PRODUCT:
            if (!state.items[action.pid]) {
                return state;
            }
            const updatedItems = {...state.items};
            const itemsSum  = updatedItems[action.pid].sum
            delete updatedItems[action.pid]
            return {
                ...state,
                items: updatedItems,
                totalAmount: state.totalAmount - itemsSum
            }
    }
    return state
}
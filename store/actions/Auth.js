import {AsyncStorage} from 'react-native'

// export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT'

export const authenticate = (userId,token)=>{
    return {type:AUTHENTICATE, userId:userId, token: token }
}

export const login = (email, password)=>{
    return async dispatch =>{
        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDai7yOvch2-l577kzPhWel7h9oiAHY3yI',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                email: email,
                password:password,
                returnSecureToken: true
            })
        });
        if (!response.ok) {
            throw new Error('Something went wrong');
        }
        const resData =  await response.json();
        console.log(resData);
        
        dispatch(authenticate(resData.localId, resData.idToken));
        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn)*1000).toISOString();
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    }
}
export const signup = (email, password)=>{
    return async dispatch =>{
        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDai7yOvch2-l577kzPhWel7h9oiAHY3yI',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                email: email,
                password:password,
                returnSecureToken: true
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            const erMessage = errorData.error.message;
            let message = 'Something went wrong';
            if (erMessage === 'EMAIL_EXISTS') {
                message = 'This email exists already!'
            }
            throw new Error(message);
        }
        const resData =  await response.json();
        console.log(resData);
        
        dispatch(authenticate(resData.localId, resData.idToken));
        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn)*1000).toISOString();
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    }
}
const saveDataToStorage =(token, userId, expirationDate)=>{
    AsyncStorage.setItem('userData', JSON.stringify({
        token:token,
        userId: userId,
        expiryDate : expirationDate
    }))
}

export const logout = ()=>{
    return{ type: LOGOUT }
}
import {useEffect, useCallback, useState} from 'react';
let logoutTimer;
export const useAuth = () =>{
 const [token, setToken] = useState();
  const [userId, setUserId] = useState()
  const [tokenExpireTime, setTokenExpireTime]=useState()
  
  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid)
    let expireIn =expirationDate || new Date(new Date.getTime() + 1000*60*60)
    setTokenExpireTime(expireIn)
    localStorage.setItem('userData', JSON.stringify({userId: uid, token : token, expireTime : tokenExpireTime.toISOString()} ))
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpireTime(null)
    setUserId(null)
    localStorage.removeItem('userData')
  }, []);

  useEffect(()=>{
   if(token && tokenExpireTime){
     const remainingTime = tokenExpireTime.getTime()- new Date().getTime();
     logoutTimer = setTimeout(logout, remainingTime);
   }else{
     clearTimeout(logoutTimer)
   }
 },[logout, token, tokenExpireTime]);

  useEffect(()=>{
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if(storedData && storedData.token && new Date(storedData.expireTime)> new Date()){
      login(storedData.userId, storedData.token, new Date(storedData.expireTime));
    }
  }, [login])

  return ({login , logout, token, userId})
}
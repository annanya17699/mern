import React, { useEffect, useState } from 'react';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import UsersList from '../components/UsersList';
import { useHttpClient } from '../../shared/hooks/http-hook';
const Users = () => {
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const [user, setUser] = useState()
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest('http://localhost:5000/api/users')
        setUser(responseData.users)
      } catch (err) { }
    }
    fetchUser()
  }, [sendRequest])

  return (
  <>
  <ErrorModal error={error} onClear={clearError} />
  {isLoading &&
  <div className='center'>
    <LoadingSpinner asOverlay />
  </div> }
  {!isLoading && user && <UsersList items={user} /> }
  </>)
  ;
};

export default Users;

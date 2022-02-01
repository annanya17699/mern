import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import PlaceList from '../components/PlaceList';

const UserPlaces = () => {
  const auth = useContext(AuthContext)
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;
  const [place, setPlace] = useState()
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`, 'DELETE', null , {'Authorization':`Bearer ${auth.token}`})
        setPlace(responseData.place)
      } catch (err) { }
    }
    fetchPlaces()
  }, [sendRequest, userId])
  const placeDeletedHandler = (deletedPlaceId) =>{
    setPlace(prev =>{
      prev.filter(p=> p.id!== deletedPlaceId)
    })
  }
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <div className='center'> <LoadingSpinner/></div>}
      {!isLoading && place && <PlaceList items={place} onDeletePlace={placeDeletedHandler}/>}
    </>
  );
};

export default UserPlaces;

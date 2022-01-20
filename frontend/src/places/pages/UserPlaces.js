import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import PlaceList from '../components/PlaceList';

const UserPlaces = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;
  const [place, setPlace] = useState()
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(`http://localhost:5000/api/places/user/${userId}`)
        setPlace(responseData.place)
      } catch (err) { }
    }
    fetchPlaces()
  }, [sendRequest, userId])
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <div className='center'> <LoadingSpinner/></div>}
      {!isLoading && place && <PlaceList items={place} />}
    </>
  );
};

export default UserPlaces;

// hooks
import axios from 'axios';
import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
// utils
import createAvatar from '../utils/createAvatar';
//
import Avatar from './Avatar';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }) {
  const { user } = useAuth();
  console.log("MYUSER", user);
  const [userData, setUserData ] = useState({imageLink:""})

  useEffect(() =>{

    axios.get(`https://tomasbacigalupo.com.ar:9094/slash/api/users/${user}`).then(r => {
      setUserData(r.data);
    });

  },[user])

  return (
    <Avatar
      src={userData?.imageLink}
      alt={userData?.name}
      color={user?.photoURL ? 'default' : createAvatar(user?.displayName).color}
      {...other}
    >
      {createAvatar(userData?.name).name}
    </Avatar>
  );
}

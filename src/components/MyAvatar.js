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


  return (
    <Avatar
      src={user?.imageLink}
      alt={user?.name}
      color={user?.photoURL ? 'default' : createAvatar(user?.displayName).color}
      {...other}
    >
      {createAvatar(userData?.name).name}
    </Avatar>
  );
}

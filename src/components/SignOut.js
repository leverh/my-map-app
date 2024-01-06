import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';

const SignOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const signOutUser = async () => {
      try {
        await auth.signOut();
        navigate('/signin');
      } catch (error) {
        console.error('Error signing out: ', error);
      }
    };

    signOutUser();
  }, [navigate]);

  return null;
};

export default SignOut;

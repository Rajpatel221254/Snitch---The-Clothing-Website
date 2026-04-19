import { setUser, setLoading, setError } from "../state/auth.slice.js";
import { register, login } from "../services/auth.api.js";
import { useDispatch } from "react-redux";

export const useAuth = () => {
  const dispatch = useDispatch();

  const handleRegister = async ({
    email,
    contact,
    password,
    fullname,
    isSeller,
  }) => {
    try {
      dispatch(setLoading(true));
      const response = await register({ email, contact, password, fullname, isSeller });
      dispatch(setUser(response.user));
    } catch (error) {
        dispatch(setError(error));
    }finally{
        dispatch(setLoading(false));
    }
};

const handleLogin = async ({email, password}) => {
    try {
        dispatch(setLoading(true));
        const response = await login({email, password});
        dispatch(setUser(response.user));
    } catch (error) {
        dispatch(setError(error.response.data.message));
    }finally{
        dispatch(setLoading(false));
    }
};

return {handleRegister, handleLogin};
};

import { setUser, setLoading, setError } from "../state/auth.slice.js";
import { register, login, getMe } from "../services/auth.api.js";
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
      const data = await register({ email, contact, password, fullname, isSeller });
      dispatch(setUser(data.user));
      return data.user
    } catch (error) {
        dispatch(setError(error));
    }finally{
        dispatch(setLoading(false));
    }
};

const handleLogin = async ({email, password}) => {
    try {
        dispatch(setLoading(true));
        const data = await login({email, password});
        dispatch(setUser(data.user));
        return data.user
    } catch (error) {
        dispatch(setError(error));
    }finally{
        dispatch(setLoading(false));
    }
};

const handleGetMe = async () => {
    try {
        dispatch(setLoading(true));
        const data = await getMe();
        dispatch(setUser(data.user));
    } catch (error) {
        console.log(error);
    }finally{
        dispatch(setLoading(false));
    }
};

return {handleRegister, handleLogin, handleGetMe};
};

import { handleRegister,handleLogin } from "../Database/Supabase-client";

export const handleAuthSubmit = async ({ type, data, navigate, setSuccess ,setError, timeRef }) => {
  try {
    setError(null);
    setSuccess(null);

    let user;

    if (type === "register") {
      user = await handleRegister(data);
    } else if (type === "login") {
      user = await handleLogin(data);
    }

    if (!user?.id) {
      throw new Error("Authentication did not return a user.");
    }

    if(type === "register") {
        setSuccess("Account created successfully")
    }else{
        setSuccess("Login successfully")
    }

    timeRef.current = setTimeout(() => {
      navigate("/library/all-notes");
    }, 3000);

  } catch (error) {
    setError(error?.message || `${type} failed. Try again later.`);
  }
};

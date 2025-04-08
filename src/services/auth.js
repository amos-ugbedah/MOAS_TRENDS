import { supabase } from "../libs/supabase";
import axiosInstance from "./axiosInstance";

const signUpAPi = async (values) => {
  //   const res = await axiosInstance.post("/auth/v1/signup", {
  //     email: values?.email,
  //     password: values?.password,
  //   });
  //   return res;

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email: values?.email,
    password: values?.password,
  });

  if (error) throw new Error(error);

  if (user && user?.id) {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert([{
        email: values?.email,
        password: values?.password,
        fullName: values?.fullName
      }])
      .select()
      .single();
    if (userError) throw new Error(userError);

    return userData;
  }
};
const signInAPi = async (values) => {
  const res = await axiosInstance.post("/auth/v1/token?grant_type=password", {
    email: values?.email,
    password: values?.password,
  });
  return res;
};

export { signInAPi, signUpAPi };

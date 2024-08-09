"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiFillGithub,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { styles } from "../../../app/styles/style";

type Props = {
  setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required").min(6),
});

const Login: React.FC<Props> = ({ setRoute }) => {
  const [show, setShow] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      console.log(email, password);
    },
  });

  const { errors, touched, handleChange, handleSubmit, values, getFieldProps } =
    formik;

  return (
    <div className="w-full">
      <h1 className={`${styles.title}`}>Login with BeReady</h1>
      <form onSubmit={handleSubmit}>
        <label className={`${styles.label}`}>Enter Your Email</label>
        <input
          type="email"
          name=""
          value={values.email}
          onChange={handleChange}
          id="email"
          placeholder="login@gmail.com"
          className={`${errors.email && touched.email && "border-red-500"} ${
            styles.input
          }`}
        />
        {errors.email && touched.email && (
          <span className="text-red-500 pt-2 block">{errors.email}</span>
        )}
        <div className="w-full mt-5 relative mb-1">
          <label className={`${styles.label}`}>Enter Your Password</label>
          <input
            type={show ? "text" : "password"}
            name="password"
            value={values.password}
            onChange={handleChange}
            id="password"
            placeholder="password"
            className={`${
              errors.password && touched.password && "border-red-500"
            } ${styles.input}`}
          />
          {show ? (
            <AiOutlineEye
              className="absolute right-2 bottom-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(!show)}
            />
          ) : (
            <AiOutlineEyeInvisible
              className="absolute right-2 bottom-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(!show)}
            />
          )}
        </div>
        {errors.password && touched.password && (
          <span className="text-red-500 pt-2 block">{errors.password}</span>
        )}
        <div className="w-full mt-5">
          <input type="submit" value="Login" className={`${styles.button}`} />
        </div>
        <br />
        <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white ">
          Or join with
        </h5>
        <div className="flex items-center justify-center my-3">
          <FcGoogle size={30} className="mr-2 cursor-pointer" />
          <AiFillGithub size={30} className="mr-2 cursor-pointer" />
        </div>
        <h5 className="text-center font-Poppins pt-4 text-[14px]">
          Not have an account?{" "}
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setRoute("Signup")}
          >
            Sign Up
          </span>
        </h5>
      </form>
      <br />
    </div>
  );
};

export default Login;

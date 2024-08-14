"use client";
import { styles } from "@/app/styles/style";
import { useUpdatePasswordMutation } from "@/redux/features/user/userApi";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {};

const ChangePassword = (props: Props) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatePassword, { isSuccess, error }] = useUpdatePasswordMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Password changed successfully");
    }

    if (error) {
      const err = error as any;
      toast.error(err.data.message);
    }
  }, [isSuccess, error]);

  const passwordChangeHandler = (e: any) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      updatePassword({ oldPassword, newPassword });
    }
  };

  return (
    <div className="w-full pl-7 px-2 800px:pl-0">
      <h1 className="block text-[25px] 800px:text-[30px] font-Poppins text-center font-[500] text-black dark:text-[#fff] pb-2">
        Change Password
      </h1>
      <div className="w-full">
        <form
          onSubmit={passwordChangeHandler}
          className="flex flex-col items-center"
        >
          <div className="w-full 800px:w-[60%] mt-5">
            <label className="block pb-2 font-Poppins dark:text-[#fff] text-black">
              Enter your old password
            </label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="w-full 800px:w-[60%] mt-5">
            <label className="block pb-2 font-Poppins dark:text-[#fff] text-black">
              Enter your new password
            </label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="w-full 800px:w-[60%] mt-5">
            <label className="block pb-2 font-Poppins dark:text-[#fff] text-black">
              Enter your confirm password
            </label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <input
              className={`w-[95%] h-[40px] font-Poppins border border-[#37a39a] text-center dark:text-[#fff] text-black rounded-[3px] mt-8 cursor-pointer`}
              required
              type="submit"
              value={"Update"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;

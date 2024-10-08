"use client";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import NavItems from "../utils/NavItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import CustomModel from "../utils/CustomModel";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Verification from "./auth/Verification";
import { useSelector } from "react-redux";
import Image from "next/image";
import avatar from "../../public/assets/user.png";
import { useSession } from "next-auth/react";
import {
  useLogoutQuery,
  useSocialAuthMutation,
} from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ route, open, setOpen, activeItem, setRoute }) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [logout, setLogout] = useState(false);
  const { data: user, isLoading, refetch } = useLoadUserQuery(undefined, {});
  const { data } = useSession();
  const {} = useLogoutQuery(undefined, { skip: !logout ? true : false });

  const [socialAuth, { isSuccess, error }] = useSocialAuthMutation();

  useEffect(() => {
    if (!user) {
      if (data) {
        socialAuth({
          email: data.user?.email,
          name: data.user?.name,
          avatar: data.user?.image,
        });
        refetch();
      }
      if (data === null && isSuccess) {
        toast.success("Login Successful");
      }
      if (data === null && !isLoading && !user) {
        setLogout(true);
      }
    }
  }, [data, user, isSuccess, error, setLogout, socialAuth]);

  useEffect(() => {
    if (!open && route === "Verification") {
      setRoute("Login");
    }
  }, [open, setRoute, route]);

  const handleClose = (e: any) => {
    if (e.target.id === "screen") {
      setOpenSidebar(false);
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setActive(true);
      } else {
        setActive(false);
      }
    });
  }

  return (
    <div className="w-full relative">
      <div
        className={`${
          active
            ? "dark:bg-opacity-50 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:broder-[#ffffff1c] shadow-xl transition duration-500"
            : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow"
        }`}
      >
        <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            <div>
              <Link
                href={"/"}
                className="text-[25px] font-Poppins font-[500] text-black dark:text-white"
              >
                BeReady
              </Link>
            </div>
            <div className="flex items-center">
              <NavItems activeItem={activeItem} isMobile={false} />
              <ThemeSwitcher />
              <div className="800px:hidden">
                <HiOutlineMenuAlt3
                  size={25}
                  className="cursor-pointer dark:text-white text-black"
                  onClick={() => setOpenSidebar(true)}
                />
              </div>
              {user ? (
                <>
                  <Link href="/profile">
                    <Image
                      src={user.user.avatar ? user.user.avatar.url : avatar}
                      alt="avatar"
                      width={30}
                      height={30}
                      className="w-[30px] h-[30px] hidden 800px:block rounded-full cursor-pointer"
                      style={{
                        border: activeItem === 5 ? "2px solid #37a39a" : "none",
                      }}
                    />
                  </Link>
                </>
              ) : (
                <HiOutlineUserCircle
                  size={25}
                  className="hidden 800px:block cursor-pointer dark:text-white text-black"
                  onClick={() => setOpen(true)}
                  style={{
                    border: activeItem === 5 ? "2px solid #37a39a" : "none",
                  }}
                />
              )}
            </div>
          </div>
        </div>
        {/* Mobile Sidebar */}
        {openSidebar && (
          <div
            className="fixed w-full h-screen top-0 left-0 z-[999] dark:bg-[unset] bg-[#00000024]"
            onClick={handleClose}
            id="screen"
          >
            <div className="w-[70%] fixed z-[999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
              <NavItems activeItem={activeItem} isMobile={true} />
              {user ? (
                <>
                  <Link href="/profile">
                    <Image
                      src={user.user.avatar ? user.user.avatar.url : avatar}
                      alt="avatar"
                      width={50}
                      height={50}
                      className="ml-5 my-2 w-[50px] h-[50px] rounded-full cursor-pointer"
                    />
                  </Link>
                </>
              ) : (
                <HiOutlineUserCircle
                  size={25}
                  className="ml-5 my-2 cursor-pointer dark:text-white text-black"
                  onClick={() => setOpen(true)}
                />
              )}
              <br />
              <br />
              <p className="text-[16px] px-2 pl-5 text-black dark:text-white">
                Copyright © 2024 BeReady
              </p>
            </div>
          </div>
        )}
      </div>
      {route === "Login" && open && (
        <CustomModel
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          Component={Login}
          refetch={refetch}
          activeItem={activeItem}
        />
      )}
      {route === "Signup" && open && (
        <CustomModel
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          Component={Signup}
          activeItem={activeItem}
        />
      )}
      {route === "Verification" && open && (
        <CustomModel
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          Component={Verification}
          activeItem={activeItem}
        />
      )}
    </div>
  );
};

export default Header;

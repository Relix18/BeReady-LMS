"use client";
import React, { FC, useEffect, useState } from "react";
import SideBarProfile from "./SideBarProfile";
import { useLogoutQuery } from "@/redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import CourseCard from "../Course/CourseCard";
import { useGetUserAllCoursesQuery } from "@/redux/features/course/courseAPI";

type Props = {
  user: any;
};

const Profile: FC<Props> = ({ user }) => {
  const [scroll, setScroll] = useState(false);
  const [active, setActive] = useState(1);
  const [avatar, setAvatar] = useState(null);
  const [logout, setLogout] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const {} = useLogoutQuery(undefined, { skip: !logout ? true : false });
  const { data, isLoading } = useGetUserAllCoursesQuery(undefined, {});

  useEffect(() => {
    if (data) {
      const filteredCourses = user.courses.map((item: any) => item._id);
      // .filter((course: any) => course !== undefined);

      setCourses(filteredCourses);
    }
  }, [data, user]);

  console.log(user.courses);

  const logoutHandler = async () => {
    setLogout(true);
    await signOut();
    redirect("/");
  };

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    });
  }

  return (
    <div className="w-[85%] flex mx-auto">
      <div
        className={`w-[60px] 800px:w-[310px] h-[450px] dark:bg-slate-900 bg-opacity-90 border bg-white dark:border-[#ffffff1d] border-[#00000017] rounded-[5px] shadow-sm mt-[80px] mb-[80px] sticky
        ${scroll ? "top-[120px]" : "top-[30px]"}
    `}
      >
        <SideBarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logoutHandler={logoutHandler}
        />
      </div>
      {active === 1 && (
        <div className="w-full h-full bg-transparent mt-[80px]">
          <ProfileInfo user={user} avatar={avatar} />
        </div>
      )}
      {active === 2 && (
        <div className="w-full h-full bg-transparent mt-[80px]">
          <ChangePassword />
        </div>
      )}
      {active === 3 && (
        <div>
          <div>
            {courses.map((item: any, index: number) => (
              <CourseCard course={item} key={index} isProfile={true} />
            ))}
          </div>
          {courses.length === 0 && (
            <p className="text-center text-[18px] font-Poppins">
              You don't have any courses
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;

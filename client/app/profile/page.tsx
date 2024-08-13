"use client";
import React, { FC, useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import Protected from "../hooks/useProtected";
import Profile from "../components/Profile/Profile";
import { useSelector } from "react-redux";

type Props = {};

const page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const [activeItem, setActiveItem] = useState(5);
  const { user } = useSelector((state: any) => state.auth);

  console.log(user);
  return (
    <div>
      <Protected>
        <Heading
          title={`${user?.name} Profile`}
          description="BeReady is a learning platform for students"
          keywords="Promming, MERN, Redux"
        />
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />
        <Profile user={user} />
      </Protected>
    </div>
  );
};

export default page;

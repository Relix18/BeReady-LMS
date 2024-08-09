"use client";
import React, { FC, useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";

interface Props {}

const Page: FC<Props> = () => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const [activeItem, setActiveItem] = useState(0);

  return (
    <div>
      <Heading
        title="BeReady"
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
      <Hero />
    </div>
  );
};

export default Page;

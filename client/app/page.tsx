"use client";
import React, { FC, useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";

interface Props {}

const Page: FC<Props> = ({ props }) => {
  const [open, setOpen] = useState(false);

  const [activeItem, setActiveItem] = useState(0);

  return (
    <div>
      <Heading
        title="BeReady"
        description="BeReady is a learning platform for students"
        keywords="Promming, MERN, Redux"
      />
      <Header open={open} setOpen={setOpen} activeItem={activeItem} />
      <Hero />
    </div>
  );
};

export default Page;
"use client";
import React, { FC, useEffect, useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";
import Courses from "./components/Route/Courses";
import Reviews from "./components/Route/Reviews";
import FAQ from "./components/Route/FAQ";
import Footer from "./components/Footer";

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
      <Courses />
      <Reviews />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Page;

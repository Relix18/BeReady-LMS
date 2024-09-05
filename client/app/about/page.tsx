"use client";
import React, { useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import About from "./About";
import Footer from "../components/Footer";

type Props = {};

const Page = (props: Props) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Heading
        title="About - BeReady"
        description="BeReady is a learning platform for students"
        keywords="Promming, MERN, Redux"
      />
      <Header
        route={route}
        open={open}
        setOpen={setOpen}
        setRoute={setRoute}
        activeItem={2}
      />
      <About />
      <Footer />
    </div>
  );
};

export default Page;

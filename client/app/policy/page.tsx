"use client";
import React, { useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Policy from "./Policy";

type Props = {};

const Page = (props: Props) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Heading
        title="Policy - BeReady"
        description="BeReady is a learning platform for students"
        keywords="Promming, MERN, Redux"
      />
      <Header
        route={route}
        open={open}
        setOpen={setOpen}
        setRoute={setRoute}
        activeItem={3}
      />
      <Policy />
      <Footer />
    </div>
  );
};

export default Page;

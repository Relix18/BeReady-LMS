"use client";
import React from "react";
import DashboardHero from "@/app/components/Admin/DashboardHero";
import AdminProtected from "@/app/hooks/adminProtected";
import Heading from "@/app/utils/Heading";
import AdminSidebar from "@/app/components/Admin/sidebar/AdminSidebar";
import EditCategory from "@/app/components/Admin/Customization/EditCategory";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title="Categories - Admin"
          description="BeReady is a learning platform for students"
          keywords="Promming, MERN, Redux"
        />
        <div className="flex min-h-screen">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%]">
            <DashboardHero />
            <EditCategory />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;

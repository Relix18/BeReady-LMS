"use client";

import AdminProtected from "../../../../app/hooks/adminProtected";
import Heading from "../../../../app/utils/Heading";
import React from "react";
import AdminSidebar from "../../../components/Admin/sidebar/AdminSidebar";
import EditCourse from "../../../../app/components/Admin/Course/EditCourse";
import DashboardHeader from "../../../../app/components/Admin/DashboardHeader";

type Props = {};

const page = ({ params }: any) => {
  const { id } = params;
  return (
    <div>
      <AdminProtected>
        <Heading
          title="Edit Course - Admin"
          description="BeReady is a learning platform for students"
          keywords="Promming, MERN, Redux"
        />
        <div className="flex">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%]">
            <DashboardHeader />
            <EditCourse id={id} />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;

"use client";
import CourseDetailsPage from "@/app/components/Course/CourseDetailsPage";
import React, { FC } from "react";

type Props = {};

const page: FC<Props> = ({ params }: any) => {
  return (
    <div>
      <CourseDetailsPage id={params.id} />
    </div>
  );
};

export default page;

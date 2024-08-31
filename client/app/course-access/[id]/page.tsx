"use client";

import CourseContent from "@/app/components/Course/CourseContent";
import Loader from "@/app/components/Loader/Loader";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

type Props = {
  params: any;
};

const Page = ({ params }: Props) => {
  const id = params.id;

  const { isLoading, data, error } = useLoadUserQuery(undefined, {});

  useEffect(() => {
    if (data) {
      const isPurchased = data.user?.courses.find(
        (item: any) => item.courseId === id
      );
      if (!isPurchased) {
        redirect("/");
      }
      if (error) {
        redirect("/");
      }
    }
  }, [data, error, id]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <CourseContent courseId={id} />
        </div>
      )}
    </>
  );
};

export default Page;

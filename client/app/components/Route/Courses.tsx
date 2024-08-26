import { useGetUserAllCoursesQuery } from "@/redux/features/course/courseAPI";
import React, { useEffect, useState } from "react";
import CourseCard from "../Course/CourseCard";

type Props = {};

const Courses = (props: Props) => {
  const { data } = useGetUserAllCoursesQuery({});
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    setCourses(data?.courses);
  }, [data]);

  return (
    <div className="w-[90%] 800px:w-[80%] mx-auto">
      <h1 className="text-center font-Poppins text-[25px] leading-[35px] 800px:text-3xl 1100px:text-4xl dark:text-white 800px:!leading-[60px] text-black font-[700] tracking-tight">
        Expand Your Career <span className=" text-gradient">Opportunity</span>
        <br />
        Opportunity With Our Courses
      </h1>
      <div className="grid grid-cols-1 gap-[20px] 800px:grid-cols-2 md:gap-[25px] 1100px:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35] border-0 mb-12">
        {courses?.map((course: any, index: number) => (
          <>
            <CourseCard key={index} course={course} />
          </>
        ))}
      </div>
    </div>
  );
};

export default Courses;

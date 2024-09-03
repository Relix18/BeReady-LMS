"use client";
import { useGetAllCoursesQuery } from "@/redux/features/course/courseAPI";
import { useGetLayoutQuery } from "@/redux/features/layout/layoutAPI";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import { styles } from "../styles/style";
import CourseCard from "../components/Course/CourseCard";

type Props = {};

const Page = (props: Props) => {
  const searchParams = useSearchParams();
  const search = searchParams?.get("title");
  const { data, isLoading } = useGetAllCoursesQuery(undefined, {});
  const { data: categoriesData } = useGetLayoutQuery("Categories");
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    if (category === "All") {
      setCourses(data?.courses);
    }
    if (category !== "All") {
      setCourses(
        data?.courses.filter(
          (course: any) =>
            course.category.toLowerCase() === category.toLocaleLowerCase()
        )
      );
    }
    if (search) {
      setCourses(
        data?.courses.filter((course: any) =>
          course.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [data, category, search]);

  const categories = categoriesData?.layout.categories;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header
            route={route}
            open={open}
            setOpen={setOpen}
            setRoute={setRoute}
            activeItem={1}
          />
          <div className="w-[95%] 800px:w-[85%] m-auto min-h-[90vh]">
            <Heading
              title="All Courses - BeReady"
              description="BeReady is a learning platform for students"
              keywords="Programming, MERN, Redux"
            />
            <br />
            <div className="w-full flex items-center flex-wrap">
              <div
                className={`h-[35px] ${
                  category === "All" ? "bg-[crimson]" : "bg-[#5050cb]"
                } m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer`}
                onClick={() => setCategory("All")}
              >
                All
              </div>
              {categories &&
                categories.map((item: any, index: number) => (
                  <div key={index}>
                    <div
                      className={`h-[35px] ${
                        category === item.title
                          ? "bg-[crimson]"
                          : "bg-[#5050cb]"
                      } m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer`}
                      onClick={() => setCategory(item.title)}
                    >
                      {item.title}
                    </div>
                  </div>
                ))}
            </div>
            {courses && courses.length === 0 && (
              <p
                className={`${styles.label} justify-center min-h-[50vh] flex items-center`}
              >
                {search
                  ? "No courses found"
                  : "No courses found in this category. Please try another one!"}
              </p>
            )}
            <br />
            <br />
            <div className="grid grid-cols-1 gap-[20px] 800px:grid-cols-2 800px:gap-[25px] 1100px:grid-cols-3 1100px:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35] border-0 mb-12">
              {courses?.map((course: any, index: number) => (
                <>
                  <CourseCard key={index} course={course} />
                </>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;

import { useGetCourseContentQuery } from "@/redux/features/course/courseAPI";
import React, { useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
import CourseContentMedia from "./CourseContentMedia";
import Header from "../Header";
import CourseContentList from "./CourseContentList";

type Props = {
  courseId: string;
  user: any;
};

const CourseContent = ({ courseId, user }: Props) => {
  const { data: courseData, isLoading } = useGetCourseContentQuery(courseId);
  const data = courseData?.courses.courseData;
  const [activeVideo, setActiveVideo] = useState(0);
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Heading
            title={data?.[activeVideo]?.title}
            description=" Lorem ipsum dolor sit amet consectetur adipisicing elit."
            keywords={data?.[activeVideo]?.tags}
          />
          <Header
            activeItem={1}
            open={open}
            setOpen={setOpen}
            setRoute={setRoute}
            route={route}
          />
          <div className="w-full grid 800px:grid-cols-10">
            <div className="col-span-7">
              <CourseContentMedia
                data={data}
                id={courseId}
                activeVideo={activeVideo}
                setActiveVideo={setActiveVideo}
                user={user.user}
              />
            </div>
            <div className="hidden 800px:block 800px:col-span-3">
              <CourseContentList
                setActiveVideo={setActiveVideo}
                data={data}
                activeVideo={activeVideo}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CourseContent;

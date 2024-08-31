import { useGetCourseContentQuery } from "@/redux/features/course/courseAPI";
import React from "react";
import Loader from "../Loader/Loader";

type Props = {
  courseId: string;
};

const CourseContent = ({ courseId }: Props) => {
  const { data, isLoading } = useGetCourseContentQuery(courseId);

  return <>{isLoading ? <Loader /> : <div></div>}</>;
};

export default CourseContent;

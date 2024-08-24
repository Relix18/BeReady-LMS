"use client";

import { title } from "process";
import React, { useEffect, useState } from "react";
import CourseInformation from "./CourseInformation";
import CourseOptions from "./CourseOptions";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import { useCreateCourseMutation } from "@/redux/features/course/courseAPI";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import Loader from "../../Loader/Loader";

type Props = {};

const CreateCourse = (props: Props) => {
  const [CreateCourse, { isLoading, isSuccess, error }] =
    useCreateCourseMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Course created successfully");
      redirect("/admin/courses");
    }
    if (error) {
      const err = error as any;
      toast.error(err.data.message);
    }
  }, [isLoading, isSuccess, error]);

  const [active, setActive] = useState(0);
  const [courseInfo, setCourseInfo] = useState({
    name: "",
    description: "",
    price: "",
    estimatedPrice: "",
    thumbnail: "",
    tags: "",
    level: "",
    category: "",
    demoUrl: "",
  });
  const [benefits, setBenefits] = useState([{ title: "" }]);
  const [prerequisites, setPrerequisites] = useState([{ title: "" }]);
  const [courseContentData, setCourseContentData] = useState([
    {
      title: "",
      videoUrl: "",
      description: "",
      videoLength: "",
      videoSection: "Untitled Section",
      links: [{ title: "", url: "" }],
      suggestion: "",
    },
  ]);
  const [courseData, setCourseData] = useState({});

  const handleSubmit = async () => {
    const formattedBenefits = benefits.map((benefit) => ({
      title: benefit.title,
    }));
    const formattedPrerequisites = prerequisites.map((prerequisite) => ({
      title: prerequisite.title,
    }));

    const formattedCourseContentData = courseContentData.map(
      (courseContent) => ({
        title: courseContent.title,
        videoUrl: courseContent.videoUrl,
        videoLength: courseContent.videoLength,
        description: courseContent.description,
        videoSection: courseContent.videoSection,
        links: courseContent.links.map((link) => ({
          title: link.title,
          url: link.url,
        })),
        suggestion: courseContent.suggestion,
      })
    );

    const data = {
      name: courseInfo.name,
      description: courseInfo.description,
      price: courseInfo.price,
      estimatedPrice: courseInfo.estimatedPrice,
      thumbnail: courseInfo.thumbnail,
      tags: courseInfo.tags,
      level: courseInfo.level,
      demoUrl: courseInfo.demoUrl,
      totalVideos: courseContentData.length,
      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites,
      courseData: formattedCourseContentData,
    };

    setCourseData(data);
  };

  console.log(courseData);

  const handleCourseCreate = async () => {
    const data = courseData;
    await CreateCourse(data);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full flex min-h-screen">
          <div className="w-[80%]">
            {active === 0 && (
              <CourseInformation
                active={active}
                setActive={setActive}
                courseInfo={courseInfo}
                setCourseInfo={setCourseInfo}
              />
            )}
            {active === 1 && (
              <CourseData
                active={active}
                setActive={setActive}
                benefits={benefits}
                setBenefits={setBenefits}
                prerequisites={prerequisites}
                setPrerequisites={setPrerequisites}
              />
            )}
            {active === 2 && (
              <CourseContent
                active={active}
                setActive={setActive}
                courseContentData={courseContentData}
                setCourseContentData={setCourseContentData}
                handleSubmit={handleSubmit}
              />
            )}
            {active === 3 && (
              <CoursePreview
                active={active}
                setActive={setActive}
                courseData={courseData}
                handleCourseCreate={handleCourseCreate}
              />
            )}
          </div>
          <div className="w-[20%] mt-[100px] h-screen fixed z-[-1] top-18 right-0">
            <CourseOptions active={active} setActive={setActive} />
          </div>
        </div>
      )}
    </>
  );
};

export default CreateCourse;

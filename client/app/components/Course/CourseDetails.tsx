import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import Ratings from "@/app/utils/Ratings";
import Link from "next/link";
import React, { FC, useState } from "react";
import { IoCheckmarkDoneOutline, IoCloseOutline } from "react-icons/io5";
import { format } from "timeago.js";
import CourseContentList from "./CourseContentList";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../Payment/CheckoutForm";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Image from "next/image";
import profile from "@/public/assets/user.png";
import { MdVerified } from "react-icons/md";

type Props = {
  course: any;
  clientSecret: string;
  stripePromise: any;
};

const CourseDetails: FC<Props> = ({ course, clientSecret, stripePromise }) => {
  const { data: userData } = useLoadUserQuery(undefined, {});
  const user = userData?.user;
  const [open, setOpen] = useState(false);

  const discountPercent =
    ((course?.estimatedPrice - course.price) / course.estimatedPrice) * 100;

  const discountPrice = discountPercent.toFixed(0);

  const isPurchased =
    user && user.courses.find((item: any) => item.courseId === course._id);

  const buyNowHandler = () => {
    setOpen(true);
  };

  return (
    <div>
      <div className="w-[90%] 800px:w-[90%] m-auto py-5">
        <div className="w-full flex flex-col-reverse 800px:flex-row">
          <div className="w-full 800px:w-[65%] 800px:pr-5">
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              {course.name}
            </h1>
            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center">
                <Ratings rating={course.ratings} />
                <h5 className="text-black dark:text-white">
                  {course.reviews?.length} Reviews
                </h5>
              </div>
              <h5 className="text-black dark:text-white">
                {course.purchased} Students
              </h5>
            </div>
            <br />
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              What you will learn from this course?
            </h1>
            <div>
              {course.benefits?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="w-full flex 800px:items-center py-2"
                >
                  <div className="w-[15px] mr-1">
                    <IoCheckmarkDoneOutline
                      size={20}
                      className="text-black dark:text-white"
                    />
                  </div>
                  <p className="pl-2 text-black dark:text-white">
                    {item.title}
                  </p>
                </div>
              ))}
              <br />
              <br />
            </div>
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              What are the prerequisites for this course?
            </h1>
            {course.prerequisites?.map((item: any, index: number) => (
              <div key={index} className="w-full flex 800px:items-center py-2">
                <div className="w-[15px] mr-1">
                  <IoCheckmarkDoneOutline
                    size={20}
                    className="text-black dark:text-white"
                  />
                </div>
                <p className="pl-2 text-black dark:text-white">{item.title}</p>
              </div>
            ))}
            <br />
            <br />
            <div>
              <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                Course Overview
              </h1>
              <CourseContentList data={course.courseData} isDemo={true} />
            </div>
            <br />
            <br />
            <div className="w-full">
              <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                Course Details
              </h1>
              <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden text-black dark:text-white">
                {course.description}
              </p>
            </div>
            <br />
            <br />
            <div className="w-full">
              <div className="800px:flex items-center">
                <Ratings rating={course.ratings} />
                <div className="mb-2 800px:mb-[unset]" />
                <h5 className="text-[25px] font-Poppins text-black dark:text-white">
                  {Number.isInteger(course.ratings)
                    ? course.ratings.toFixed(1)
                    : course.ratings.toFixed(2)}{" "}
                  Course Rating • {course.reviews?.length} Reviews
                </h5>
              </div>
              <br />
              {console.log(course)}
              {course.reviews &&
                [...course.reviews]
                  .reverse()
                  .map((item: any, index: number) => (
                    <div key={index} className="w-full pb-4">
                      <div className="flex">
                        <div>
                          <Image
                            src={
                              item.user.avatar ? item.user.avatar.url : profile
                            }
                            alt="avatar"
                            width={50}
                            height={50}
                            className="w-[50px] h-[50px] rounded-full object-cover"
                          />
                        </div>
                        <div className="hidden 800px:block pl-2">
                          <div className="flex items-center">
                            <h5 className="text-[18px] pr-2 text-black dark:text-white">
                              {item.user.name}
                            </h5>
                            <Ratings rating={item.rating} />
                          </div>
                          <p className="text-black dark:text-white">
                            {item.comment}
                          </p>
                          <small className="text-[#000000d1] dark:text-[#ffffff83]">
                            {format(item.createdAt)} •
                          </small>
                        </div>
                        <div className="pl-2 flex 800px:hidden items-center">
                          <h5 className="text-[18px] pr-2 text-black dark:text-white">
                            {item.user.name}
                          </h5>
                        </div>
                      </div>
                      {item.commentReplies.map((reply: any, index: number) => (
                        <div
                          className="w-full flex 800px:ml-16 my-5 text-black dark:text-white"
                          key={index}
                        >
                          <div>
                            <Image
                              src={
                                reply.user.avatar
                                  ? reply.user.avatar.url
                                  : profile
                              }
                              alt="avatar"
                              width={50}
                              height={50}
                              className="w-[50px] h-[50px] rounded-full object-cover"
                            />
                          </div>
                          <div className="pl-2">
                            <div className="flex items-center">
                              <h5 className="text-[20px]">
                                {reply?.user.name}
                              </h5>
                              {reply.user.role === "admin" && (
                                <MdVerified
                                  size={20}
                                  className="text-[#0d6efd] ml-2"
                                />
                              )}
                            </div>
                            <p>{reply.reply}</p>
                            <small className="text-[#000000a2] dark:text-[#ffffff83]">
                              {format(reply?.createdAt)} •
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
            </div>
          </div>
          <div className="w-full 800px:w-[35%] relative">
            <div className="sticky top-[100px] left-0 z-50 w-full">
              <CoursePlayer title={course.title} videoUrl={course.demoUrl} />
              <div className="flex items-center">
                <h1 className="pt-5 text-[25px] text-black dark:text-white">
                  {course.price === 0 ? "Free" : `$${course.price}`}
                </h1>
                <h5 className="pl-3 text-[20px] mt-2 line-through opacity-80 text-black dark:text-white">
                  ${course.estimatedPrice}
                </h5>

                <h4 className="pl-5 pt-4 text-[22px] text-black dark:text-white">
                  {discountPrice}% OFF
                </h4>
              </div>
              <div className="flex items-center">
                {isPurchased ? (
                  <Link
                    className={`${styles.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-[crimson] `}
                    href={`/course-access/${course._id}`}
                  >
                    Enter to Course
                  </Link>
                ) : (
                  <div
                    className={`${styles.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-[crimson] `}
                    onClick={() => buyNowHandler()}
                  >
                    Buy Now ${course.price}
                  </div>
                )}
              </div>
              <br />
              <p className="pb-1 text-black dark:text-white">
                • Source code included
              </p>
              <p className="pb-1 text-black dark:text-white">
                • Life time access
              </p>
              <p className="pb-1 text-black dark:text-white">
                • Certificate on Completion
              </p>
              <p className="pb-3 800px:pb-1 text-black dark:text-white">
                • Premium support
              </p>
            </div>
          </div>
        </div>
      </div>
      <>
        {open && (
          <div className="w-full h-screen bg-[#00000036] fixed top-0 left-0 z-50 flex items-center justify-center">
            <div className="w-[500px] min-h-[500px] bg-white rounded-xl shadow p-3">
              <div className="w-full flex justify-end">
                <IoCloseOutline
                  size={40}
                  className="text-black  cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              </div>
              <div className="w-full">
                {stripePromise && clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm setOpen={setOpen} data={course} />
                  </Elements>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default CourseDetails;

import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  AiFillStar,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineStar,
} from "react-icons/ai";
import profile from "@/public/assets/user.png";
import toast from "react-hot-toast";
import {
  useAddAnswerMutation,
  useAddQuestionMutation,
  useAddReviewCourseMutation,
  useAddReviewReplyMutation,
} from "@/redux/features/course/courseAPI";
import { format } from "timeago.js";
import { BiMessage } from "react-icons/bi";
import { MdVerified } from "react-icons/md";
import Ratings from "@/app/utils/Ratings";
import socketIO from "socket.io-client";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  id: string;
  data: any;
  activeVideo: number;
  setActiveVideo: (activeVideo: number) => void;
  user: any;
};

const CourseContentMedia = ({
  id,
  data,
  activeVideo,
  setActiveVideo,
  user,
}: Props) => {
  const [activeBar, setActiveBar] = useState(0);
  const [rating, setRating] = useState<number>(0);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [review, setReview] = useState("");
  const [isReviewReply, setIsReviewReply] = useState(false);
  const [reviewReply, setReviewReply] = useState("");
  const [reviewId, setReviewId] = useState("");

  const [addQuestion, { isSuccess, error, isLoading: isQuestionLoading }] =
    useAddQuestionMutation();
  const [
    addAnswer,
    {
      isSuccess: isAnswerSuccess,
      error: answerError,
      isLoading: isAnswerLoading,
    },
  ] = useAddAnswerMutation();
  const [
    addReview,
    {
      isSuccess: isReviewSuccess,
      error: reviewError,
      isLoading: isReviewLoading,
    },
  ] = useAddReviewCourseMutation();

  const [
    addReviewReply,
    {
      isSuccess: isReviewReplySuccess,
      error: reviewReplyError,
      isLoading: isReviewReplyLoading,
    },
  ] = useAddReviewReplyMutation();

  const isReviewExists = data?.reviews?.find(
    (item: any) => item.user._id === user?._id
  );

  const handleQuestion = () => {
    if (question.length === 0) {
      toast.error("Please enter your question");
    } else {
      addQuestion({
        courseId: id,
        question,
        contentId: data.courseData[activeVideo]?._id,
      });
    }
  };

  const handleAnswerSubmit = () => {
    addAnswer({
      answer,
      courseId: id,
      contentId: data.courseData[activeVideo]?._id,
      questionId,
    });
  };

  const handleReviewSubmit = () => {
    if (review.length === 0) {
      toast.error("Please enter your review");
    } else {
      addReview({
        id,
        review,
        rating,
      });
    }
  };

  const handleReviewReplySubmit = () => {
    if (reviewReply.length === 0) {
      toast.error("Please enter your review");
    } else {
      addReviewReply({
        courseId: id,
        reviewId,
        reply: reviewReply,
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setQuestion("");
      socketId.emit("notification", {
        title: "New Question",
        message: `You have a new question in ${data.courseData[activeVideo]?.title}`,
        userId: user?._id,
      });
      toast.success("Question added successfully");
    }
    if (error) {
      const err = error as any;
      toast.error(err.data.message);
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (isAnswerSuccess) {
      setAnswer("");
      setQuestionId("");
      toast.success("Answer added successfully");
      if (user.role !== "admin") {
        socketId.emit("notification", {
          title: "New Reply Received",
          message: `You have a new question reply in ${data.courseData[activeVideo]?.title}`,
          userId: user?._id,
        });
      }
    }
    if (answerError) {
      const err = answerError as any;
      toast.error(err.data.message);
    }
  }, [isAnswerSuccess, answerError]);

  useEffect(() => {
    if (isReviewSuccess) {
      setReview("");
      setRating(0);
      socketId.emit("notification", {
        title: " New Review",
        message: `You have a new review in ${data.name}`,
        userId: user?._id,
      });
      toast.success("Review added successfully");
    }
    if (reviewError) {
      const err = reviewError as any;
      toast.error(err.data.message);
    }
  }, [isReviewSuccess, reviewError]);

  useEffect(() => {
    if (isReviewReplySuccess) {
      setReviewReply("");
      setReviewId("");
      toast.success("Reply added successfully");
    }
    if (reviewReplyError) {
      const err = reviewReplyError as any;
      toast.error(err.data.message);
    }
  }, [isReviewReplySuccess, reviewReplyError]);

  return (
    <div className="w-[95%] 800px:w-[86%] py-4 m-auto">
      <CoursePlayer
        videoUrl={data.courseData[activeVideo]?.videoUrl}
        title={data.courseData[activeVideo]?.title}
      />
      <div className="w-full flex items-center justify-between my-3">
        <div
          className={`${styles.button} !w-[unset] !min-h-[40px] !py-[unset] ${
            activeVideo === 0 && "!cursor-no-drop opacity-[.8]"
          }`}
          onClick={() =>
            setActiveVideo(activeVideo === 0 ? 0 : activeVideo - 1)
          }
        >
          <AiOutlineArrowLeft className="mr-2" />
          Prev Lesson
        </div>
        <div
          className={`${styles.button} !w-[unset] !min-h-[40px] !py-[unset] ${
            data.courseData.length - 1 === activeVideo &&
            "!cursor-no-drop opacity-[.8]"
          }`}
          onClick={() =>
            setActiveVideo(
              data?.courseData.length - 1 === activeVideo ? 0 : activeVideo + 1
            )
          }
        >
          Next Lesson
          <AiOutlineArrowRight className="ml-2" />
        </div>
      </div>
      <h1 className="pt-2 text-[25px] font-[600]">
        {data.courseData[activeVideo]?.title}
      </h1>
      <br />
      <div className="w-full p-4 flex items-center justify-between bg-slate-500 bg-opacity-20 backdrop-blur shadow-[bg-slate-700] rounded shadow-inner">
        {["Overview", "Resources", "Q&A", "Reviews"].map((item, index) => (
          <h5
            key={index}
            className={`800px:text-[20px] text-black dark:text-white cursor-pointer ${
              activeBar === index && "!text-red-500"
            }`}
            onClick={() => setActiveBar(index)}
          >
            {item}
          </h5>
        ))}
      </div>
      <br />
      {activeBar === 0 && (
        <p className="text-black dark:text-white font-Poppins">
          {data.courseData[activeVideo]?.description}
        </p>
      )}
      {activeBar === 1 && (
        <div>
          {data.courseData[activeVideo]?.links.map(
            (item: any, index: number) => (
              <div className="m-5" key={index}>
                <h2 className="800px:text-[20px] 800px:inline-block text-black dark:text-white">
                  {item.title && item.title + " :"}
                </h2>
                <a
                  className="inline-block text-[#4395c4] 800px:text-[20px] 800px:pl-2"
                  href={item.url}
                >
                  {item.url}
                </a>
              </div>
            )
          )}
        </div>
      )}
      {activeBar === 2 && (
        <>
          <div className="flex w-full">
            <Image
              src={user.avatar ? user.avatar.url : profile}
              alt="avatar"
              width={50}
              height={50}
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
            <textarea
              name=""
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              id=""
              cols={40}
              rows={5}
              placeholder="Write a question"
              className="outline-none text-black dark:text-white resize-none bg-transparent ml-3 border border-[#00000028] dark:border-[#ffffff57] 800px:w-full p-2 rounded w-[90%] 800px:text-[18px] font-Poppins"
            ></textarea>
          </div>
          <div className="w-full flex justify-end">
            <div
              className={`${
                styles.button
              } !w-[120px] !h-[40px] text-[18px] mt-5 ${
                isQuestionLoading && "!cursor-no-allowed opacity-[.8]"
              }`}
              onClick={isQuestionLoading ? () => {} : handleQuestion}
            >
              Submit
            </div>
          </div>
          <br />
          <br />
          <div className="w-full h-[1px] bg-[#ffffff3b]"></div>
          <div>
            <CommentReply
              data={data.courseData}
              activeVideo={activeVideo}
              answer={answer}
              setAnswer={setAnswer}
              handleAnswerSubmit={handleAnswerSubmit}
              user={user}
              setQuestionId={setQuestionId}
              isAnswerLoading={isAnswerLoading}
            />
          </div>
        </>
      )}
      {activeBar === 3 && (
        <>
          <div className="w-full">
            {!isReviewExists && (
              <>
                <div className="flex w-full">
                  <Image
                    src={user.avatar ? user.avatar.url : profile}
                    alt="avatar"
                    width={50}
                    height={50}
                    className="w-[50px] h-[50px] rounded-full object-cover"
                  />

                  <div className="w-full">
                    <h5 className="pl-3 text-[20px] font-[500] dark:text-white text-black">
                      Give a Rating <span className="text-red-500">*</span>
                    </h5>
                    <div className="flex w-full ml-2 pb-3">
                      {[1, 2, 3, 4, 5].map((i: number) =>
                        rating >= i ? (
                          <AiFillStar
                            key={i}
                            size={25}
                            className="mr-1 cursor-pointer"
                            color="rgb(246,186,0)"
                            onClick={() => setRating(i)}
                          />
                        ) : (
                          <AiOutlineStar
                            key={i}
                            size={25}
                            className="mr-1 cursor-pointer"
                            color="rgb(246,186,0)"
                            onClick={() => setRating(i)}
                          />
                        )
                      )}
                    </div>
                    <textarea
                      name=""
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      id=""
                      cols={40}
                      rows={5}
                      placeholder="Write a review"
                      className="outline-none border-[#00000028] dark:border-[#ffffff57] text-black dark:text-white resize-none bg-transparent ml-3 border  800px:w-full p-2 rounded w-[90%] 800px:text-[18px] font-Poppins"
                    ></textarea>
                  </div>
                </div>
                <div className="w-full flex justify-end">
                  <div
                    className={`${styles.button} !w-[120px] !h-[40px] text-[18px] mt-2 800px:mr-0 mr-2`}
                    onClick={isReviewLoading ? () => {} : handleReviewSubmit}
                  >
                    Submit
                  </div>
                </div>
              </>
            )}
          </div>
          <br />
          <div className="w-full h-[1px] bg-[#ffffff3b]"></div>
          <div className="w-full">
            {(data?.reviews && [...data.reviews].reverse()).map(
              (item: any, index: number) => (
                <div
                  className="w-full my-5 text-white dark:text-white"
                  key={index}
                >
                  <div className="w-full flex">
                    <div>
                      <Image
                        src={item.user.avatar ? item.user.avatar.url : profile}
                        alt="avatar"
                        width={50}
                        height={50}
                        className="w-[50px] h-[50px] rounded-full object-cover"
                      />
                    </div>
                    <div className="pl-3 text-black dark:text-white">
                      <h5 className="text-[20px]">{item?.user.name}</h5>
                      <Ratings rating={item?.rating} />
                      <p>{item?.comment}</p>
                      <small className="text-[#000000a2] dark:text-[#ffffff83]">
                        {format(item?.createdAt)} •
                      </small>
                    </div>
                  </div>
                  {user.role === "admin" && (
                    <span
                      className={`${styles.label} !ml-10 cursor-pointer`}
                      onClick={() => {
                        setIsReviewReply(!isReviewReply);
                        setReviewId(item._id);
                      }}
                    >
                      Add Reply
                    </span>
                  )}
                  {isReviewReply && (
                    <div className="w-full flex relative text-black dark:text-white">
                      <input
                        type="text"
                        placeholder="Add a reply..."
                        value={reviewReply}
                        onChange={(e) => setReviewReply(e.target.value)}
                        className="block 800px:ml-12 mt-2 outline-none bg-transparent border-b border-[#00000027] dark:border-[#fff] dark:text-white text-black p-[5px] w-[95%]"
                      />
                      <button
                        type="submit"
                        className={"absolute right-0 bottom-1 font-[500]"}
                        onClick={handleReviewReplySubmit}
                        disabled={reviewReply == "" || isReviewReplyLoading}
                      >
                        Submit
                      </button>
                    </div>
                  )}
                  {item.commentReplies.map((reply: any, index: number) => (
                    <div
                      className="w-full flex 800px:ml-16 my-5 text-black dark:text-white"
                      key={index}
                    >
                      <div>
                        <Image
                          src={
                            reply.user.avatar ? reply.user.avatar.url : profile
                          }
                          alt="avatar"
                          width={50}
                          height={50}
                          className="w-[50px] h-[50px] rounded-full object-cover"
                        />
                      </div>
                      <div className="pl-2">
                        <div className="flex items-center">
                          <h5 className="text-[20px]">{reply?.user.name}</h5>
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
              )
            )}
          </div>
          <br />
        </>
      )}
    </div>
  );
};

const CommentReply = ({
  data,
  activeVideo,
  answer,
  setAnswer,
  handleAnswerSubmit,
  user,
  setQuestionId,
  isAnswerLoading,
}: any) => {
  return (
    <>
      <div className="w-full my-3">
        {data[activeVideo].questions.map((item: any, index: number) => (
          <CommentItem
            key={index}
            data={data}
            item={item}
            setAnswer={setAnswer}
            setQuestionId={setQuestionId}
            answer={answer}
            handleAnswerSubmit={handleAnswerSubmit}
            isAnswerLoading={isAnswerLoading}
          />
        ))}
      </div>
    </>
  );
};

const CommentItem = ({
  data,
  item,
  setAnswer,
  setQuestionId,
  answer,
  handleAnswerSubmit,
  isAnswerLoading,
}: any) => {
  const [replyActive, setReplyActive] = useState(false);
  return (
    <>
      <div className="my-4">
        <div className="flex mb-2">
          <div className="w-[50px] h-[50px]">
            <div>
              <Image
                src={item.user.avatar ? item.user.avatar.url : profile}
                alt="avatar"
                width={50}
                height={50}
                className="w-[50px] h-[50px] rounded-full object-cover"
              />
            </div>
          </div>
          <div className="pl-3 text-black dark:text-white">
            <h5 className="text-[20px]">{item?.user.name}</h5>
            <p>{item?.question}</p>
            <small className="text-[#000000a2] dark:text-[#ffffff83]">
              {format(item?.createdAt)} •
            </small>
          </div>
        </div>
        <div className="w-full flex items-center">
          <span
            className="800px:pl-16 text-[#000000a2] dark:text-[#ffffff83] cursor-pointer mr-2"
            onClick={() => {
              setReplyActive(!replyActive);
              setQuestionId(item._id);
            }}
          >
            {!replyActive
              ? item.questionReplies.length !== 0
                ? "All Replies"
                : "Add Reply"
              : "Hide Replies"}
          </span>
          <BiMessage
            size={20}
            className="cursor-pointer text-[#000000a2] dark:text-[#ffffff83]"
          />
          <span className="pl-1 mt-[-4px] cursor-pointer text-[#000000a2] dark:text-[#ffffff83]">
            {item.questionReplies.length}
          </span>
        </div>
        {replyActive && (
          <>
            {item.questionReplies.map((item: any, index: number) => (
              <div
                className="w-full flex 800px:ml-16 my-5 text-black dark:text-white"
                key={index}
              >
                <div>
                  <Image
                    src={item.user.avatar ? item.user.avatar.url : profile}
                    alt="avatar"
                    width={50}
                    height={50}
                    className="w-[50px] h-[50px] rounded-full object-cover"
                  />
                </div>
                <div className="pl-2">
                  <div className="flex items-center">
                    <h5 className="text-[20px]">{item?.user.name}</h5>
                    {item.user.role === "admin" && (
                      <MdVerified size={20} className="text-[#0d6efd] ml-2" />
                    )}
                  </div>
                  <p>{item.answer}</p>
                  <small className="text-[#000000a2] dark:text-[#ffffff83]">
                    {format(item?.createdAt)}
                  </small>
                </div>
              </div>
            ))}
            <>
              <div className="w-full flex relative text-black dark:text-white">
                <input
                  type="text"
                  placeholder="Enter your answer..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="block 800px:ml-12 mt-2 outline-none bg-transparent border-b border-[#00000027] dark:border-[#fff] dark:text-white text-black p-[5px] w-[95%]"
                />
                <button
                  type="submit"
                  className={"absolute right-0 bottom-1 font-[500]"}
                  onClick={handleAnswerSubmit}
                  disabled={answer == "" || isAnswerLoading}
                >
                  Submit
                </button>
              </div>
            </>
          </>
        )}
      </div>
    </>
  );
};

export default CourseContentMedia;

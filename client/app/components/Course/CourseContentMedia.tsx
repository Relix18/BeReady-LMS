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
} from "@/redux/features/course/courseAPI";
import { format } from "timeago.js";
import { BiMessage } from "react-icons/bi";
import { MdVerified } from "react-icons/md";

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
        contentId: data[activeVideo]?._id,
      });
    }
  };

  const handleAnswerSubmit = () => {
    addAnswer({
      answer,
      courseId: id,
      contentId: data[activeVideo]?._id,
      questionId,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setQuestion("");
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
    }
    if (answerError) {
      const err = answerError as any;
      toast.error(err.data.message);
    }
  }, [isAnswerSuccess, answerError]);

  return (
    <div className="w-[95%] 800px:w-[86%] py-4 m-auto">
      <CoursePlayer
        videoUrl={data[activeVideo]?.videoUrl}
        title={data[activeVideo]?.title}
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
            data.length - 1 === activeVideo && "!cursor-no-drop opacity-[.8]"
          }`}
          onClick={() =>
            setActiveVideo(
              data?.length - 1 === activeVideo ? 0 : activeVideo + 1
            )
          }
        >
          Next Lesson
          <AiOutlineArrowRight className="ml-2" />
        </div>
      </div>
      <h1 className="pt-2 text-[25px] font-[600]">
        {data[activeVideo]?.title}
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
          {data[activeVideo]?.description}
        </p>
      )}
      {activeBar === 1 && (
        <div>
          {data[activeVideo]?.links.map((item: any, index: number) => (
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
          ))}
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
              data={data}
              activeVideo={activeVideo}
              answer={answer}
              setAnswer={setAnswer}
              handleAnswerSubmit={handleAnswerSubmit}
              user={user}
              setQuestionId={setQuestionId}
            />
          </div>
        </>
      )}
      {activeBar === 3 && (
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
                    className="outline-none resize-none bg-transparent ml-3 border border-[#ffffff57] 800px:w-full p-2 rounded w-[90%] 800px:text-[18px] font-Poppins"
                  ></textarea>
                </div>
              </div>
              <div className="w-full flex justify-end">
                <div
                  className={`${styles.button} !w-[120px] !h-[40px] text-[18px] mt-2 800px:mr-0 mr-2`}
                >
                  Submit
                </div>
              </div>
            </>
          )}
        </div>
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
                  disabled={answer == ""}
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

import React from "react";
import { styles } from "../styles/style";

type Props = {};

const About = (props: Props) => {
  return (
    <div className="text-black dark:text-white">
      <br />
      <h1 className={`${styles.title} 800px:!text-[45px]`}>
        What is <span className="text-gradient">BeReady</span>
      </h1>
      <br />
      <div className="w-[95%] 800px:w-[85%] m-auto">
        <p className="font-Poppins text-[18px]">
          Our Mission: BeReady is committed to empowering students through
          accessible online learning. We aim to provide high-quality education
          that caters to a diverse range of learners, enabling personal and
          professional growth.
          <br />
          <br />
          Expert-Led Courses: Our courses are crafted by industry experts who
          bring real-world experience and knowledge. We ensure students gain
          relevant skills that prepare them for career success in various
          industries.
          <br />
          <br />
          Flexible Learning Environment: BeReady offers flexible learning
          options, allowing students to learn at their own pace and on their own
          schedule. With 24/7 access to courses, students can balance education
          with other commitments easily.
          <br />
          <br />
          Wide Range of Subjects: BeReady offers a diverse selection of courses
          across multiple disciplines, ensuring that students can explore their
          interests or specialize in their chosen field. From tech and business
          to creative arts, we cover a broad spectrum of topics.
          <br />
          <br />
          Community and Support: We foster a supportive online community where
          students can collaborate, share ideas, and grow together. Our
          dedicated team provides continuous guidance and resources, ensuring
          that learners stay motivated and achieve their educational goals.
        </p>
        <br />
        <h1 className={` text-[22px] `}>Relix</h1>
        <h1 className={` text-[18px] font-Poppins`}>Founder and CEO</h1>
        <br />
        <br />
      </div>
    </div>
  );
};

export default About;

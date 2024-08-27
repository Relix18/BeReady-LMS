import Image from "next/image";
import React from "react";
import buisiness from "../../../public/assets/buisiness.png";
import { styles } from "@/app/styles/style";
import ReviewCard from "../Review/ReviewCard";

type Props = {};

const Reviews = (props: Props) => {
  const data = [
    {
      name: "John Doe",
      avatar:
        " https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      profession: "Software Engineer",
      rating: 5,
      comment: "Lorem ipsum dolor sit amet, ",
    },
    {
      name: "John Doe",
      avatar:
        " https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      profession: "Software Engineer",
      rating: 4.5,
      comment:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      name: "John Doe",
      avatar:
        " https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      profession: "Software Engineer",
      rating: 4.5,
      comment:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      name: "John Doe",
      avatar:
        " https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      profession: "Software Engineer",
      rating: 4.5,
      comment:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
  ];

  return (
    <div className="w-[90%] 800px:w-[85%] m-auto">
      <div className="w-full 800px:flex items-center">
        <div className="800px:w-[50%] w-full">
          <Image width={500} height={500} src={buisiness} alt="" />
        </div>
        <div className="800px:w-[50%] w-full">
          <h3 className={`${styles.title} 800px:!text-[40px]`}>
            Our Students Are <span className="text-gradient">Our Strength</span>{" "}
            <br /> See What They Say About Us
          </h3>
          <br />
          <p className={styles.label}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <br />
        <br />
      </div>
      <div className="grid grid-cols-1 gap-[25px] 800px:grid-cols-2 800px:gap-[25px] 1100px:grid-cols-2 1100px:gap-[25px] 1500px:grid-cols-2 1500px:gap-[35px] mb-12 border-0 800px:[&>*:nth-child(6)]:!mt-[-40px]">
        {data.map((item: any, index: number) => (
          <ReviewCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Reviews;

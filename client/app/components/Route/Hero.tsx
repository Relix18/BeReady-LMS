import Image from "next/image";
import Link from "next/link";
import React, { FC, useState } from "react";
import { BiSearch } from "react-icons/bi";
import client1 from "@/public/assets/client2.png";
import client2 from "@/public/assets/client1.png";
import client3 from "@/public/assets/client3.png";
import { useGetLayoutQuery } from "@/redux/features/layout/layoutAPI";
import Loader from "../Loader/Loader";
import { useRouter } from "next/navigation";

type props = {};

const Hero: FC<props> = () => {
  const { data, isLoading } = useGetLayoutQuery("banner");
  const [search, setSearch] = useState<string>("");
  const router = useRouter();

  const handleSearch = () => {
    if (search !== "") {
      router.push(`/courses?title=${search}`);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full 1000px:flex items-center ">
          <div className="relative 1000px:w-[40%] flex 1000px:min-h-screen items-center justify-end pt-[70px] 1000px:pt[0] z-10 ">
            <div className="absolute top-[100px] left-[0] 1000px:top-[unset] 1500px:h-[700px] 1500px:w-[700px] 1100px:w-[500px] 1100px:h-[500px] h-[50vh] w-[50vh] hero_animation rounded-full 1100px:left-[2rem] 1500px:left-[21rem]" />
            <Image
              src={data?.layout.banner?.image.url}
              alt=""
              width={400}
              height={400}
              className="object-contain 1100px:max-w-[90%] w-[90%] 1500px:max-w-[85%] h-[auto] z-[10]"
            />
          </div>
          <div className="1000px:w-[60%] flex flex-col items-center 1000px:mt-[0px] text-center 1000px:text-left mt-[150px]">
            <h2 className="dark:text-white text-[#000000c7] text-[30px] px-3 w-full 1000px:text-[70px] font-[600] font-Josefin py-2 1000px:leading-[75px] 1500px:w-[60%] 1100px:w-[82%]">
              {data?.layout.banner?.title}
            </h2>
            <br />
            <p className="dark:text-[#edfff4] text-[#000000c7] font-Josefin font-[600] text-[18px] 1500px:!w-[55%] 1100px:!w-[78%]">
              {data?.layout.banner?.subtitle}
            </p>
            <br />
            <br />
            <div className="1500px:w-[55%] 1100px:w-[78%] w-[90%] h-[50px] bg-transparent relative">
              <input
                type="text"
                placeholder="Search Courses"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border dark:border-none dark:bg-[#575757] dark:placeholder:text-[#ffffffdd] rounded-[5px] p-2 w-full h-full outline-none text-[#0000004e] dark:text-[#ffffffe6] text-[20px] font-[500] font-Josefin"
              />
              <div
                className="absolute flex items-center justify-center w-[50px] cursor-pointer h-[50px] right-0 top-0 bg-[#39c1f3] rounded-r-[5px]"
                onClick={handleSearch}
              >
                <BiSearch className="text-white w-[30px] h-[30px]" />
              </div>
            </div>
            <br />
            <br />
            <div className="1500px:w-[55%] 1100px:w-[78%] w-[90%] flex items-center">
              <Image src={client1} alt="" className="rounded-full w-10" />
              <Image
                src={client2}
                alt=""
                className="rounded-full w-10 ml-[-20px]"
              />
              <Image
                src={client3}
                alt=""
                className="rounded-full w-10 ml-[-20px]"
              />
              <p className="font-Josefin dark:text-[#edfff4] text-[#000000b3] 1000px:pl-3 text-[18px] font-[600]">
                500K+ People already trusted us.{" "}
                <Link
                  href={"/courses"}
                  className="dark:text-[#37a39a] text-[crimson]"
                >
                  View Courses
                </Link>
              </p>
            </div>
            <br />
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;

import { styles } from "@/app/styles/style";
import {
  useEditLayoutMutation,
  useGetLayoutQuery,
} from "@/redux/features/layout/layoutAPI";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineCamera } from "react-icons/ai";

type Props = {};

const EditHero = (props: Props) => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const { data } = useGetLayoutQuery("banner");
  const [editLayout, { isLoading, isSuccess, error }] = useEditLayoutMutation();

  useEffect(() => {
    if (data) {
      setTitle(data.layout?.banner.title);
      setSubTitle(data.layout?.banner.subtitle);
      setImage(data.layout?.banner.image.url);
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Layout Updated");
    }
    if (error) {
      const err = error as any;
      toast.error(err.data.message);
    }
  }, [isSuccess, error]);

  const imageHandler = (e: any) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();
    if (file) {
      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          setImage(e.target.result as string);
        }
      };

      reader.readAsDataURL(file);
    }
  };
  const handleEdit = async () => {
    await editLayout({ type: "banner", title, subtitle: subTitle, image });
  };

  return (
    <>
      <div className="w-full 1000px:flex items-center">
        <div className="absolute top-[100px] 1000px:top-[unset] 1500px:h-[700px] 1500px:w-[700px] 1100px:w-[450px] 1100px:h-[450px] h-[50vh] w-[50vh] hero_animation rounded-full 1100px:left-[18rem] 1500px:left-[21rem]"></div>
        <div className="1000px:w-[40%] flex 1000px:min-h-screen items-center justify-end pt-[70px] 1000px:pt[0] z-10 ">
          <div className="relative flex items-center justify-center">
            <img
              src={image}
              alt=""
              className="object-contain 1100px:max-w-[90%] w-[90%] 1500px:max-w-[85%] h-[auto] z-[10]"
            />
            <input
              type="file"
              id="banner"
              accept="image/*"
              className="hidden"
              onChange={(e) => imageHandler(e)}
            />
            <label htmlFor="banner" className="absolute bottom-0 right-0 z-20">
              <AiOutlineCamera className="dark:text-white text-black text-[18px] cursor-pointer" />
            </label>
          </div>
        </div>
        <div className="1000px:w-[60%] flex flex-col items-center 1000px:mt-[0px] text-center 1000px:text-left mt-[150px]">
          <textarea
            className="dark:text-white text-[#000000c7] text-[30px] px-3 w-full 1000px:text-[60px] resize-none font-[600] font-Josefin py-2 1000px:leading-[70px] 1500px:w-[60%] 1100px:w-[82%] bg-transparent"
            placeholder="Improve Your Online Learning Experience Better Instantly"
            value={title}
            rows={4}
            onChange={(e) => setTitle(e.target.value)}
          />
          <br />
          <textarea
            className="dark:text-[#edfff4] text-[#000000c7] font-Josefin font-[600] text-[18px] 1500px:!w-[55%] 1100px:!w-[78%] bg-transparent resize-none"
            value={subTitle}
            onChange={(e) => setSubTitle(e.target.value)}
            placeholder="We have 40k+ online courses & 100k+ online registered users. Find your desired course and start learning."
          />
          <br />
          <br />
          <br />
          <div
            className={`${
              styles.button
            } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34] ${
              data?.layout?.banner?.title !== title ||
              data?.layout?.banner?.subtitle !== subTitle ||
              data?.layout?.banner?.image?.url !== image
                ? "!cursor-pointer bg-[#063564]"
                : "!cursor-not-allowed bg-[crimson]"
            } !rounded absolute bottom-12 right-12`}
            onClick={
              data?.layout?.banner?.title !== title ||
              data?.layout?.banner?.subtitle !== subTitle ||
              data?.layout?.banner?.image?.url !== image
                ? handleEdit
                : () => null
            }
          >
            Save
          </div>
        </div>
      </div>
    </>
  );
};

export default EditHero;

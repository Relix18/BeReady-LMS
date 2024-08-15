import { styles } from "@/app/styles/style";
import Image from "next/image";
import React, { FC, useState } from "react";
import { BiCloudUpload } from "react-icons/bi";
import { IoCloudUploadOutline } from "react-icons/io5";

type Props = {
  courseInfo: any;
  setCourseInfo: (courseInfo: any) => void;
  active: number;
  setActive: (active: number) => void;
};

const CourseInformation: FC<Props> = ({
  courseInfo,
  setCourseInfo,
  active,
  setActive,
}) => {
  const [dragging, setDragging] = useState(false);

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setCourseInfo({ ...courseInfo, thumbnail: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragEnd = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setCourseInfo({ ...courseInfo, thumbnail: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setActive(active + 1);
  };

  return (
    <div className="w-[80%] m-auto mt-24">
      <form onSubmit={handleSubmit} className={`${styles.label}`}>
        <div>
          <label htmlFor="">Course Name</label>
          <input
            type="name"
            name=""
            required
            id="name"
            className={`${styles.input}`}
            value={courseInfo.name}
            onChange={(e) =>
              setCourseInfo({ ...courseInfo, name: e.target.value })
            }
          />
        </div>
        <br />
        <div>
          <label htmlFor="">Course Description</label>
          <textarea
            rows={8}
            cols={30}
            name=""
            id="description"
            required
            className={`${styles.input} !h-min !py-2`}
            value={courseInfo.description}
            onChange={(e) =>
              setCourseInfo({ ...courseInfo, description: e.target.value })
            }
          ></textarea>
        </div>
        <br />
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label htmlFor="">Price</label>
            <input
              type="number"
              name=""
              required
              id="price"
              className={`${styles.input}`}
              value={courseInfo.price}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, price: e.target.value })
              }
            />
          </div>
          <div className="w-[45%]">
            <label htmlFor="">Estimated Price (Optional)</label>
            <input
              type="number"
              name=""
              required
              id="estimatedPrice"
              className={`${styles.input}`}
              value={courseInfo.estimatedPrice}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, estimatedPrice: e.target.value })
              }
            />
          </div>
        </div>
        <br />
        <div>
          <label className={`${styles.label}`}>Course Tags</label>
          <input
            type="text"
            name=""
            required
            id="tags"
            className={`${styles.input}`}
            value={courseInfo.tags}
            onChange={(e) =>
              setCourseInfo({ ...courseInfo, tags: e.target.value })
            }
          />
        </div>
        <br />
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label htmlFor="">Course Level</label>
            <input
              type="text"
              name=""
              required
              id="level"
              className={`${styles.input}`}
              value={courseInfo.level}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, level: e.target.value })
              }
            />
          </div>
          <div className="w-[45%]">
            <label htmlFor="">Demo Url</label>
            <input
              type="text"
              name=""
              required
              id="demoUrl"
              className={`${styles.input}`}
              value={courseInfo.demoUrl}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, demoUrl: e.target.value })
              }
            />
          </div>
        </div>
        <br />
        <div className="w-full">
          <input
            type="file"
            name=""
            accept="image/*"
            id="file"
            className={"hidden"}
            onChange={handleFileChange}
          />
          <label
            htmlFor="file"
            className={`${styles.label} w-full flex justify-center items-center cursor-pointer`}
            onDragEnter={handleDrag}
            onDragLeave={handleDragEnd}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div
              className={`${
                dragging ? "bg-blue-500" : "bg-transparent"
              } w-full min-h-[10vh] dark:border-white border-[#00000026] p-3 border flex items-center justify-center`}
            >
              {courseInfo.thumbnail ? (
                <img
                  src={courseInfo.thumbnail}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex">
                  <IoCloudUploadOutline size={30} />
                  <span className="text-black dark:text-white pl-2">
                    Drag and drop your thumbnail here or click to browse
                  </span>
                </div>
              )}
            </div>
          </label>
        </div>
        <br />
        <div>
          <input
            type="submit"
            value="Next"
            className="w-full 800px:w-[180px] h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
          />
        </div>
        <br />
        <br />
      </form>
    </div>
  );
};

export default CourseInformation;

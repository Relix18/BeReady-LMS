import {
  useEditLayoutMutation,
  useGetLayoutQuery,
} from "@/redux/features/layout/layoutAPI";
import React, { useEffect, useState } from "react";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";

type Props = {};

const EditCategory = (props: Props) => {
  const { data } = useGetLayoutQuery("Categories");
  const [editLayout, { isLoading, isSuccess, error }] = useEditLayoutMutation();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setCategories(data?.layout.categories);
    }
  }, [data]);

  console.log(data);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Layout updated successfully");
    }

    if (error) {
      const err = error as any;
      toast.error(err.data.message);
    }
  }, [isSuccess, error]);

  const handleCategories = async (id: string, title: string) => {
    setCategories(
      categories?.map((item: any) =>
        item._id === id
          ? {
              ...item,
              title,
            }
          : item
      )
    );
  };

  const newCategoriesHanlder = async () => {
    if (categories[categories.length - 1].title === "") {
      toast.error("Please fill all the fields");
    } else {
      setCategories((prev: any) => [...prev, { title: "" }]);
    }
  };

  const areCategoriesUnchanged = (
    originalCategories: any[],
    newCategories: any[]
  ) => {
    return JSON.stringify(originalCategories) === JSON.stringify(newCategories);
  };

  const isAnyCategoryEmpty = (categories: any[]) => {
    return categories.some((category: any) => category.title === "");
  };

  const editHanlder = async () => {
    if (
      !areCategoriesUnchanged(data?.layout.categories, categories) &&
      !isAnyCategoryEmpty(categories)
    ) {
      await editLayout({ type: "Categories", categories });
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-[120px] text-center">
          <h1 className={`${styles.title}`}>All Categories</h1>
          {categories?.map((item: any, index: number) => (
            <div key={index} className="p-3">
              <div className="flex items-center w-full justify-center">
                <input
                  className={`${styles.input} !w-[unset] !border-none !text-[20px]`}
                  value={item.title}
                  onChange={(e) => handleCategories(item._id, e.target.value)}
                  placeholder="Enter category title"
                />
                <AiOutlineDelete
                  className="dark:text-white text-black text-[18px] cursor-pointer"
                  onClick={() => {
                    setCategories((prev: any) =>
                      prev.filter((category: any) => category._id !== item._id)
                    );
                  }}
                />
              </div>
            </div>
          ))}
          <br />
          <br />
          <div className="w-full flex justify-center">
            <IoMdAddCircleOutline
              className="dark:text-white text-black text-[25px] cursor-pointer"
              onClick={newCategoriesHanlder}
            />
          </div>
          <div
            className={`${
              styles.button
            } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34]
     ${
       areCategoriesUnchanged(data?.layout.categories, categories) ||
       isAnyCategoryEmpty(categories)
         ? "!cursor-not-allowed"
         : "!cursor-pointer !bg-[#42d383]"
     }
     !rounded absolute bottom-12 right-12`}
            onClick={
              areCategoriesUnchanged(data?.layout.categories, categories) ||
              isAnyCategoryEmpty(categories)
                ? () => null
                : editHanlder
            }
          >
            Save
          </div>
        </div>
      )}
    </>
  );
};

export default EditCategory;

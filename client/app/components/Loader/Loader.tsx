import React from "react";

type Props = {};

const Loader = (props: Props) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="loader border-[4px] border-solid border-[#19cec6] border-t-[4px] border-t-[#1f2937] rounded-full w-[48px] h-[48px] animate-spin"></div>
    </div>
  );
};

export default Loader;

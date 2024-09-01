import React, { FC, useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { MdOutlineOndemandVideo } from "react-icons/md";

type Props = {
  data: any;
  activeVideo?: number;
  setActiveVideo?: any;
  isDemo?: boolean;
};

const CourseContentList: FC<Props> = ({
  isDemo,
  data,
  activeVideo,
  setActiveVideo,
}) => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set<string>()
  );

  const videoSections: string[] = [
    ...new Set<string>(data.map((section: any) => section.videoSection)),
  ];

  let totalCount: number = 0;

  const toggleSection = (section: string) => {
    const newVisibleSections = new Set(visibleSections);
    if (visibleSections.has(section)) {
      newVisibleSections.delete(section);
    } else {
      newVisibleSections.add(section);
    }

    setVisibleSections(newVisibleSections);
  };

  console.log(data);

  return (
    <div
      className={`mt-[15px] w-full ${
        !isDemo && "ml-[-30px] min-h-screen sticky top-24 left-0 z-30"
      }`}
    >
      {videoSections.map((section: string, index: number) => {
        const isSectionVisible = visibleSections.has(section);

        const sectionVideos: any[] = data.filter(
          (video: any) => video.videoSection === section
        );

        const sectionVideoCount: number = sectionVideos.length;
        const sectionVideoLength: number = sectionVideos.reduce(
          (totalLength: number, item: any) => totalLength + item.videoLength,
          0
        );

        const sectionStartIndex: number = totalCount;
        totalCount += sectionVideoCount;

        const sectionContentHours: number = sectionVideoLength / 60;

        return (
          <div
            className={`${!isDemo && "border-b border-[#ffffff8e] pb-2"}`}
            key={section}
          >
            <div className="w-full flex">
              <div className="w-full flex justify-between items-center">
                <h2 className="text-[22px] text-black dark:text-white">
                  {section}
                </h2>
                <button
                  className="mr-4 cursor-pointer text-black dark:text-white"
                  onClick={() => toggleSection(section)}
                >
                  {isSectionVisible ? (
                    <BsChevronUp size={20} />
                  ) : (
                    <BsChevronDown size={20} />
                  )}
                </button>
              </div>
            </div>
            <h5 className="text-black dark:text-white">
              {sectionVideoCount} Lessons •{" "}
              {sectionVideoLength < 60
                ? sectionVideoLength
                : sectionContentHours.toFixed(2)}{" "}
              {sectionVideoLength < 60 ? "Minutes" : "Hours"}
            </h5>
            <br />
            {isSectionVisible && (
              <div className="w-full">
                {sectionVideos.map((video: any, index: number) => {
                  const videoIndex: number = sectionStartIndex + index;
                  const contentLength: number = video.videoLength / 60;
                  return (
                    <div
                      className={`w-full ${
                        videoIndex === activeVideo ? "bg-slate-800" : ""
                      } cursor-pointer transition-all p-2`}
                      key={video._id}
                      onClick={() =>
                        isDemo ? null : setActiveVideo(videoIndex)
                      }
                    >
                      <div className="flex items-start">
                        <div>
                          <MdOutlineOndemandVideo
                            size={25}
                            className="mr-2"
                            color="#1cdada"
                          />
                        </div>
                        <h1 className="text-[18px] inline-block break-words text-black dark:text-white">
                          {video.title}
                        </h1>
                      </div>
                      <h5 className="pl-8 text-black dark:text-white">
                        {video.videoLength > 60
                          ? contentLength.toFixed(2)
                          : video.videoLength}{" "}
                        {video.videoLength > 60 ? "Hours" : "Minutes"}
                      </h5>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CourseContentList;

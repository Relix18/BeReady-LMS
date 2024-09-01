import axios from "axios";
import React, { FC, useEffect, useState } from "react";

type Props = {
  videoUrl: string;
  title: string;
};

const CoursePlayer: FC<Props> = ({ videoUrl, title }) => {
  const [videoData, setVideoData] = useState({
    otp: "",
    playbackInfo: "",
  });

  useEffect(() => {
    axios
      .post(`http://localhost:4000/api/v1/getVdoCipherOTP`, {
        videoId: videoUrl,
      })
      .then((res: any) => {
        setVideoData(res.data);
      });
  }, [videoUrl]);

  return (
    <div
      style={{
        paddingTop: "56.25%%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {videoData?.otp && videoData?.playbackInfo !== "" && (
        <iframe
          src={`https://player.vdocipher.com/v2/?otp=${videoData?.otp}&playbackInfo=${videoData.playbackInfo}&player=7Y5fhI7cKzz6Jysy`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
          allow="encrypted-media"
          allowFullScreen={true}
        />
      )}
    </div>
  );
};

export default CoursePlayer;

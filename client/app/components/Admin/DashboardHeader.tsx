"use client";
import { ThemeSwitcher } from "@/app/utils/ThemeSwitcher";
import {
  useGetAllNotificationsQuery,
  useUpdateNotificationMutation,
} from "@/redux/features/notification/notificationAPI";
import React, { FC, useEffect, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DashboardHeader: FC<Props> = ({ open, setOpen }) => {
  const { data, refetch } = useGetAllNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updateNotification, { isSuccess }] = useUpdateNotificationMutation();
  const [notification, setNotification] = useState([]);
  const [audio] = useState(
    new Audio(
      "https://res.cloudinary.com/dkjnrcbib/video/upload/v1725433931/s8yuf6khqmr6jsaxy1vw.mp3"
    )
  );

  const playAudio = () => {
    audio.play();
  };

  useEffect(() => {
    if (data) {
      setNotification(
        data.notifications.filter((item: any) => item.status === "unread")
      );
    }
    if (isSuccess) {
      refetch();
    }
    audio.load();
  }, [data, isSuccess, audio]);

  useEffect(() => {
    socketId.on("newNotification", (data: any) => {
      refetch();
      playAudio();
    });
  }, []);

  const updateNotificationHandler = async (id: string) => {
    await updateNotification(id);
  };

  return (
    <div className="w-full flex items-center justify-end p-6 fixed top-5 right-0 z-[9999999999]">
      <ThemeSwitcher />
      <div
        className="relative cursor-pointer m-2"
        onClick={() => setOpen(!open)}
      >
        <IoMdNotificationsOutline className="text-2xl cursor-pointer dark:text-white text-black" />
        <span className="absolute -top-0 -right-2 bg-[#3ccba0] rounded-full w-[20px] h-[20px] text-[12px] flex items-center justify-center text-white">
          {notification.length}
        </span>
      </div>
      {open && (
        <div className="w-[350px] h-[50vh] dark:bg-[#111c43] bg-white shadow-xl absolute top-16 z-10 rounded overflow-y-auto">
          <h5 className="text-center text-[20px] font-Poppins text-black dark:text-white p-3">
            Notifications
          </h5>
          {notification?.map((item: any, index: number) => (
            <div
              key={index}
              className="dark:bg-[#2d3a4ea1] bg-[#00000013] font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#0000000f]"
            >
              <div className="w-full flex items-center justify-between p-2">
                <p className="text-black dark:text-white">{item.title}</p>
                <p
                  className="text-black dark:text-white cursor-pointer"
                  onClick={() => updateNotificationHandler(item._id)}
                >
                  Mark as read
                </p>
              </div>
              <p className="px-2 text-black dark:text-white">{item.message}</p>
              <p className="px-2 text-black dark:text-white text-[14px]">
                {format(item.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;

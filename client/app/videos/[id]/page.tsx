/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { API_BASE_URL, GET_A_VIDEO_API, VIDEO_LIST_API } from "@/common";
import axios from "axios";
import { useEffect, useState } from "react";

type VideoListType = {
  id: number;
  videoUrl: string;
  size: number;
  isHovered: boolean;
};

export default function page({ params }) {
  const [currentVideoId, setCurrentVideoId] = useState(params.id);
  const [loading, setLoading] = useState(false);
  const [videoList, setVideoList] = useState<VideoListType[]>([]);

  const getAllVideos = async () => {
    setLoading(true);
    const { data } = await axios.get(VIDEO_LIST_API);
    setTimeout(() => {
      setVideoList(data);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    getAllVideos();
  }, []);

  return (
    <div className="flex">
      {/* sidebar */}
      <div></div>
      {/* video player */}
      <div className="px-40 py-10">
        <video
          className="bg-black w-[1000px] h-[500px] rounded-2xl"
          src={`${GET_A_VIDEO_API}${currentVideoId}.mp4`}
          controls
          autoPlay
          muted
        ></video>
        <p className="text-lg mt-4">Vide id: {currentVideoId}</p>
      </div>
      <div className="pt-4 space-y-4">
        {loading ? (
          <p>Loading</p>
        ) : (
          videoList.length &&
          videoList.map((video) => (
            <div
              onClick={() => setCurrentVideoId(video.id)}
              key={video.id}
              className="flex cursor-pointer"
            >
              <video
                className="w-[200px] rounded-xl"
                src={`${GET_A_VIDEO_API}${video.id}.mp4`}
              ></video>
              <p className="p-2">Video id is: {video.id}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

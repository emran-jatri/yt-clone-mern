"use client";
import { VIDEO_LIST_API, VIDEO_UPLOAD_API } from "@/common";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";

type VideoListType = {
  id: number;
  videoUrl: string;
  size: number;
  isHovered: boolean;
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [videoList, setVideoList] = useState<VideoListType[]>([]);
  const [file, setFile] = useState<File>();
  const [isHovered, setIsHovered] = useState(0);

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

  console.log("videoList =========>", videoList);

  const fileUpload = (file) => {
    const url = VIDEO_UPLOAD_API;
    const formData = new FormData();
    formData.append("file", file);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    return axios.post(url, formData, config);
  };

  const handleUploadFile = async (files: FileList | null) => {
    if (files && files.length) {
      setFile(files[0]);
    }
  };

  const handleVideoUploadSubmit = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    // console.log('--------->', 'handleVideoUploadSubmit', e);
    if (file) {
      await fileUpload(file);
    }
  };

  return (
    <main>
      <div className="flex justify-center items-center mt-24">
        <form onSubmit={handleVideoUploadSubmit}>
          <label>Upload Videos:</label>
          <input
            type="file"
            onChange={(e) => handleUploadFile(e.target.files)}
            id="img"
            name="img"
            accept="video/*"
          />
          <input className="bg-gray-300 px-6 py-1 rounded-md" type="submit" />
        </form>
      </div>

      <div className="p-10 bg-gray-200 flex justify-between items-center mt-24 rounded-xl">
        {loading ? (
          <div>
            <p>Loading</p>
          </div>
        ) : (
          videoList.map((video) => (
            <div key={video.id} className="w-[22%] rounded-xl overflow-hidden">
              <video
                onMouseOver={(event) => {
                  // setVideoList(videoList.map(item => item.id === video.id ? {...item, isHovered: true} : item))
                  event.target.muted = true;
                  event.target.controls = true;
                  event.target.play();
                }}
                onMouseOut={(event) => {
                  // setVideoList(videoList.map(item => item.id === video.id ? {...item, isHovered: false} : item))
                  event.target.muted = false;
                  event.target.controls = false;
                  event.target.pause();
                }}
                // controls={video.isHovered}
                // autoPlay={video.isHovered}
                // muted={video.isHovered}
              >
                <source src={video.videoUrl} type="video/mp4" />
              </video>
              <div className="bg-white p-4">
                <p className="text-lg">Beautiful Video Name</p>
                {/* <p>==============={String(video.isHovered)}</p> */}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

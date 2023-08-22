"use client";
import { VIDEO_LIST_API, VIDEO_UPLOAD_API } from "@/common";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

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
      <div className="flex justify-center items-center bg-red-200 py-12">
        <form onSubmit={handleVideoUploadSubmit}>
          <label>Upload Videos: </label>
          <input
            type="file"
            onChange={(e) => handleUploadFile(e.target.files)}
            id="img"
            name="img"
            accept="video/*"
          />
          <input className="bg-red-500 text-white px-6 py-1 rounded-md" type="submit" />
        </form>
      </div>

        
      <p className="p-10 text-4xl font-bold">All Videos</p>
      <div className="px-10 pb-10  grid md:grid-cols-3 lg:grid-cols-4 gap-10 rounded-xl">
        {loading ? (
          <div>
            <p>Loading</p>
          </div>
        ) : (
          videoList.map((video) => (
            <div key={video.id} className="rounded-xl overflow-hidden bg-white shadow-md">
              <video
              // className="overflow-hidden"
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
              <div className="p-4">
                <Link href={`videos/${video.id}`} className="text-lg">Beautiful Video Name</Link>
                {/* <p>==============={String(video.isHovered)}</p> */}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

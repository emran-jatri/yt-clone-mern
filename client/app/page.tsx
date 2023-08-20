"use client";
import { VIDEO_LIST_API, VIDEO_UPLOAD_API } from "@/common";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [videoList, setVideoList] = useState([]);
  const [file, setFile] = useState<File>();

  const getAllVideos = async () => {
    const { data } = await axios.get(VIDEO_LIST_API);
    setVideoList(data);
  };

  useEffect(() => {
    getAllVideos();
  }, []);

  console.log("videoList =========>", videoList);
  

  const fileUpload = (file) =>{
    const url = VIDEO_UPLOAD_API;
    const formData = new FormData();
    formData.append('file',file)
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    return  axios.post(url, formData,config)
  }

  const handleUploadFile = async (files: FileList | null) => {
    if (files && files.length) {
      setFile(files[0]);
    }
  }

  const handleVideoUploadSubmit = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    // console.log('--------->', 'handleVideoUploadSubmit', e);
    if(file){
      await fileUpload(file)
    }
  }

  return (
    <main>
      <div className="flex justify-center items-center mt-24">
        <form onSubmit={handleVideoUploadSubmit}>
          <label>Upload Videos:</label>
          <input type="file" onChange={e => handleUploadFile(e.target.files)} id="img" name="img" accept="video/*"/>
          <input className="bg-gray-300 px-6 py-1 rounded-md" type="submit"/>
        </form>
      </div>

      <div className="p-10 bg-gray-200 grid grid-flow-col gap-10 mt-24 rounded-xl">
        {videoList.length ? (
          videoList.map((video) => (
            <div key={Math.random()} className="rounded-xl overflow-hidden">
              <video controls>
                <source src={video.videoUrl} type="video/mp4" />
              </video>
              <div className="bg-white p-4">
                <p className="text-lg">Beautiful Video Name</p>
              </div>
            </div>
          ))
        ) : (
          <p>Loading</p>
        )}
      </div>
    </main>
  );
}

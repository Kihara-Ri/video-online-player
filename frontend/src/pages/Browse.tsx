import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface Video {
  name: string
  path: string
}

const Browse: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  // 获取所有视频
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get<Video[]>("/api/videos");
        setVideos(response.data);
      } catch (error) {
        console.error("获取视频失败: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if(loading) {
    return <div>正在加载视频列表...</div>
  }

  return (
    <div>
      <h1>视频列表</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {videos.length > 0 ? (
          videos.map((video, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              <a href={video.path} target="_blank" rel="noopener noreferrer">
                {video.name}
              </a>
            </li>
          ))
        ) : (
          <p>没有找到视频</p>
        )}
      </ul>
    </div>
  );
}

export default Browse;
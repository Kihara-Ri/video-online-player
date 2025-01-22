import { useSearchParams } from "react-router-dom";
const Player: React.FC = () => {
  const [searchParams] = useSearchParams();
  const filePath = searchParams.get("file");

  return (
    <div>
      <h1>视频播放</h1>
      <video controls autoPlay>
        <source src={`/videos/${encodeURIComponent(filePath || '')}`} type="video/mp4" />
      </video>
    </div>
  );
};

export default Player;
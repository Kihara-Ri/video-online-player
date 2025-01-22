import { useSearchParams } from "react-router-dom";
import '../styles/player.css';
const Player: React.FC = () => {
  const [searchParams] = useSearchParams();
  const filePath = searchParams.get("file");
  let videoName = "";
  console.log("正在播放的视频: ", filePath);
  if (filePath) {
    const parts = filePath.split('/');
    videoName = parts[parts.length - 1].split('.')[0];
    console.log("视频名称: ", videoName)
  }

  return (
    <div className="player-container">
      <h1 className="player-title">
        {videoName}
      </h1>
      <video controls autoPlay>
        <source src={`/videos/${encodeURIComponent(filePath || '')}`} type="video/mp4" />
      </video>
    </div>
  );
};

export default Player;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

const Browse: React.FC = () => {
  const [dirType, setDirType] = useState<string>("bangumi");
  const [currentDir, setCurrentDir] = useState<string>("");
  const [items, setItems] = useState<{ name: string; path: string; type: string; }[]>([]);
  const navigate = useNavigate();
  
  console.log("组件加载 currentDir: ", currentDir);

  useEffect(() => {
    // 初始状态下, 列出三大目录
    if (!currentDir) {
      setItems([
        { name: 'bangumi', path: 'bangumi', type: 'directory'},
        { name: 'shows', path: 'shows', type: 'directory'},
        { name: 'downloads', path: 'downloads', type: 'directory'},
      ]);
      return;
    }

    console.log("发送请求: ", `/api/${dirType}?dir=${encodeURIComponent(currentDir)}`);
    // 拉取目录内容
    fetch(`/api/${dirType}?dir=${encodeURIComponent(currentDir)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setItems(data);
        console.log("拉取视频目录成功: ", data);
      })
      .catch((error) => console.error("拉取视频目录失败: ", error));
  }, [currentDir, dirType]);

  // 处理点击事件
  const handleClick = (item: { name: string; path: string; type: string }) => {
    console.log('handleClick', item);
    if (item.type === 'directory') {
      // 更新 DirType, currentDir
      setDirType(item.path.split('/')[0]);
      setCurrentDir(item.path);
      console.log("更新 dirType: ", item.path.split('/')[0])
      console.log("更新 currentDir: ", item.path)
      // 导航到新的目录
      console.log("Navigate to: ", `/browse/${item.path}`)
      navigate(`/browse/${item.path}`);
    } else if (item.type === 'video') {
      window.location.href = `/player?file=${encodeURIComponent(item.path)}&dirType=${dirType}`;
    }
  };

  return (
    <div>
      <h1>视频列表</h1>
      <ul>
        {items.map((item) => (
          <li key={item.path} onClick={() => handleClick(item)}>
            {item.type === 'directory' ? 
            `📁 ${item.name}` :
            `🎬 ${item.name}`
          }
          </li>
        ))}
      </ul>
      {currentDir && (
        <button onClick={() => navigate(`/browse/${dirType}/${currentDir.substring(0, currentDir.lastIndexOf('/'))}`)}>
          返回上一级
        </button>
      )}
    </div>
  );
};

export default Browse;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

const Browse: React.FC = () => {
  const [dirType, setDirType] = useState<string>("");
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
      console.log("点击视频 ", item.name)
      window.location.href = `/player?file=${encodeURIComponent(item.path)}`;
    }
  };

  // 处理返回事件
  const handleBack = () => {
    const lastDir = currentDir.substring(0, currentDir.lastIndexOf('/')) || ""; // *含义还没查
    console.log("点击返回事件, 返回至: ", lastDir)

    // 更新状态以触发重新渲染
    setCurrentDir(lastDir);
    navigate(`/browse/${lastDir}`, { replace: true});
    // replace 将不会在浏览器历史记录中创建新条目, 防止跳转历史堆栈中留下不必要的记录
    // *尚不清楚浏览器自带的前后操作为什么失效(有可能是没渲染)
  }

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
        <button onClick={handleBack}>
          返回上一级
        </button>
      )}
    </div>
  );
};

export default Browse;

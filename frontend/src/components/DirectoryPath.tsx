// 用于将路径分隔符改为使用 箭头图标 渲染

import React from 'react';
import DoubleRightArrow from '../assets/icons/double-right-arrow.svg';

interface DirectoryPathProps {
  currentDir: string;
}

const DirectoryPath: React.FC<DirectoryPathProps> = ({ currentDir }) => {
  const parts = currentDir ? currentDir.split('/') : ['根目录'];
  return (
    <div className="directory-path">
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          <span className="directory-part">{part}</span>
          {index < parts.length - 1 && (
            <img src={DoubleRightArrow} alt="double-right-arrow" className='icon' />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default DirectoryPath;
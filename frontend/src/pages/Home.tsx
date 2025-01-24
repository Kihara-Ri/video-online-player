import React from 'react';
import '../styles/home.css';
import { IsTextExists } from '../hooks/IsTextExists'; // 引入输入框文字存在判断钩子
import HomeIcon from '../assets/icons/home.svg';
import BrowseIcon from '../assets/icons/browse.svg';
import SearchIcon from '../assets/icons/search.svg';
import CloudIcon from '../assets/icons/cloud.svg';
import DownloadIcon from '../assets/icons/download.svg';

function Home() {
  // 解构钩子成员
  const { isExpanded, searchValue, handleFocus, handleBlur, handleInputChange } = IsTextExists();

  return (
    <div className="home-container">
      {/* 导航栏内容 */}
      <nav className="home-nav-bar">
        <a href="/" id="home-button" className="button">
          <img src={HomeIcon} alt="home-icon" className="icon" />
        Home</a>

        {/* 搜索框 */}
        <div className={`search-bar-container ${isExpanded ? 'expanded' : ''}`}>
          <input type="text" name="query" placeholder="Search" id="search-input"
            value={searchValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleInputChange}
          />
          <div id="search-button">
            <img src={SearchIcon} alt="search-icon" className="icon" />
          </div>
        </div>

        <div id="options-container">
          <a href="/" className="button">
            <img src={DownloadIcon} alt="download-icon" className="icon" />
          </a>
          <a href="/" className="button">
            <img src={CloudIcon} alt="cloud-icon" className="icon" />
          </a>
          <a href="/browse" id="browse-button" className="button">
          <img src={BrowseIcon} alt="browse-icon" className="icon" />
          Browse</a>
        </div>
      </nav>

      <div className="home-content">
        <div className="new-added-container">
          <h2>新入库的</h2>
          <div className="carousel-container">
            轮播图
          </div>
        </div>
      </div>
      
    </div>
  )

}

export default Home
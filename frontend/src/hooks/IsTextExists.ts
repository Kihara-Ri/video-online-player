import { useState } from 'react';

/**
 * 自定义 Hook: 用于处理搜索框的展开和收缩逻辑
 * 默认初始状态搜索框为收缩状态
 * 当搜索框内有内容时, 即使失去焦点, 搜索框依然保持展开状态
 */

export function IsTextExists() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // 处理输入框获取焦点
  const handleFocus = () => {
    setIsExpanded(true);
  };

  // 处理输入框失去焦点时, 若无内容则收回
  const handleBlur = () => {
    if (searchValue.trim() === '') {
      setIsExpanded(false);
    }
  };

  // 处理输入框内容变更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    console.log("搜索框内容变更: ", e.target.value);
  };

  return {
    isExpanded,
    searchValue,
    handleFocus,
    handleBlur,
    handleInputChange,
  };
}
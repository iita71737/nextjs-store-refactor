'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // 替代 withRouter
import { toast } from 'react-toastify';

// 定義組件屬性類型
interface ToolBoxProps {
  search: (value: string) => void;
  cartNum: number;
  isLogin: boolean;
}

const ToolBox: React.FC<ToolBoxProps> = ({ search, cartNum, isLogin }) => {
  const [searchText, setSearchText] = useState<string>('');
  const router = useRouter();

  // 處理搜索框輸入
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchText(value);
      search(value);
    },
    [search]
  );

  // 清除搜索框
  const clearSearchText = useCallback(() => {
    setSearchText('');
    search('');
  }, [search]);

  // 跳轉到購物車
  const goCart = useCallback(() => {
    if (!isLogin) {
      router.push('/login');
      toast.info('Please Login First');
      return;
    }
    router.push('/cart');
  }, [isLogin, router]);

  return (
    <div className="tool-box">
      <div className="logo-text">Store</div>
      <div className="search-box">
        <div className="field has-addons">
          <div className="control">
            <input
              type="text"
              className="input search-input"
              placeholder="Search Product"
              value={searchText}
              onChange={handleChange}
            />
          </div>
          <div className="control">
            <button className="button" onClick={clearSearchText}>
              X
            </button>
          </div>
        </div>
      </div>
      <div className="cart-box" onClick={goCart}>
        <i className="fas fa-shopping-cart"></i>
        <span className="cart-num">{cartNum}</span>
      </div>
    </div>
  );
};

export default ToolBox;

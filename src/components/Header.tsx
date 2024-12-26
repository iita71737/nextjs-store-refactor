'use client'; // 明確標記為客戶端組件

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Next.js 的路由 API
import Panel from '@/components/Panel';
import UserProfile from '@/components/UserProfile';

const Header = ({ user }: { user: { nickname?: string } }) => {
  const router = useRouter();

  const toProfile = () => {
    Panel.open({
      component: UserProfile,
      props: {
        user: user,
      },
      callback: (data: string) => {
        if (data === 'logout') {
          router.refresh(); // 刷新當前頁面，代替 props.history.go(0)
        }
      },
    });
  };

  return (
    <div className="header">
      <div className="grid">
        <div className="start">
          <Link href="/">Home</Link>
        </div>
        <div className="end">
          {user?.nickname ? (
            <span className="nickname" onClick={toProfile}>
              <i className="far fa-user"></i>
              {user.nickname}
            </span>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;

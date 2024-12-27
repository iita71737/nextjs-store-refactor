'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Panel from '@/components/Panel';
import UserProfile from '@/components/UserProfile';

interface HeaderProps {
  user: {
    nickname?: string;
  };
}

const Header: React.FC<HeaderProps> = ({ user }) => {

  const [showPanel, setShowPanel] = useState(false);

  return (
    <div className="header">
      <div className="grid">
        <div className="start">
          <Link href="/">Home</Link>
        </div>
        <div className="end">
          {user?.nickname ? (
            <>
              <span className="nickname"
                onClick={() => setShowPanel(!showPanel)}
              >
                <i className="far fa-user"></i>
                {user.nickname}
                {showPanel ? 'Hide Panel' : 'Show Panel'}
              </span>
              {showPanel &&
                <Panel
                  onClose={() => setShowPanel(false)}
                >
                  <UserProfile
                    user={user}
                    onClose={() => setShowPanel(false)}
                  ></UserProfile>
                </Panel>
              }
            </>
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

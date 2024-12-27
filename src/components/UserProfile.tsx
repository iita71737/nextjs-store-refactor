'use client';

import React from 'react';
import { auth } from '@/commons/auth';
import { useRouter } from 'next/navigation';

interface User {
  nickname: string;
  email: string;
  type: number;
}

interface UserProfileProps {
  user: User;
  onClose: (action?: string) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onClose }) => {
  const router = useRouter();

  const logout = () => {
    if (auth?.logout) {
      auth.logout();
    }
    onClose()
    router.refresh();
  };

  return (
    <div className="user-profile">
      <p className="title has-text-centered">Profile</p>
      <fieldset disabled>
        <div className="field">
          <div className="control">
            <label className="label">Nickname</label>
            <input
              className="input"
              type="text"
              defaultValue={user.nickname}
              readOnly
            />
          </div>
        </div>
        <div className="field">
          <div className="control">
            <label className="label">Email</label>
            <input
              className="input"
              type="text"
              defaultValue={user.email}
              readOnly
            />
          </div>
        </div>
        <div className="field">
          <div className="control">
            <label className="label">Type</label>
            <input
              className="input"
              type="text"
              defaultValue={user.type === 1 ? 'Manager' : 'General User'}
              readOnly
            />
          </div>
        </div>
      </fieldset>

      <br />
      <br />
      <div className="field is-grouped is-grouped-centered">
        <div className="control">
          <button className="button is-danger" type="button" onClick={logout}>
            Logout
          </button>
        </div>
        <div className="control">
          <button
            className="button"
            type="button"
            onClick={() => {
              close();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

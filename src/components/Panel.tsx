'use client'; // 明確標記為客戶端組件

import React, { useState, ReactNode, useCallback } from 'react';

interface PanelProps {
  isOpen: boolean;
  onClose: (data?: any) => void;
  children?: ReactNode;
}

const Panel: React.FC<PanelProps> = ({ isOpen, onClose, children }) => {
  const closePanel = useCallback(() => {
    onClose();
  }, [onClose]);

  const panelClass = isOpen ? 'panel-wrapper active' : 'panel-wrapper';

  return (
    <div className={panelClass}>
      <div className="over-layer" onClick={closePanel}></div>
      <div className="panel">
        <div className="head">
          <span className="close" onClick={closePanel}>
            ×
          </span>
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
};

export default Panel;

'use client';

import React, { useState } from 'react';
import ReactDOM from 'react-dom';

interface PanelProps {
    children: React.ReactNode;
    onClose?: () => void;
}

const Panel: React.FC<PanelProps> = ({ children, onClose }) => {
    return ReactDOM.createPortal(
        <div className="panel-wrapper active">
            <div
                className="over-layer"
                onClick={() => onClose && onClose()} // 點擊背景關閉
            ></div>
            <div className="panel">
                <div className="head">
                    <span className="close" onClick={() => onClose && onClose()}>
                        ×
                    </span>
                </div>
                <div className="content">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Panel;

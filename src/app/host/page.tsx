'use client';

import HostIdle from '@src/components/host/HostIdle';
import { useHostStore } from '@/store/zustand/HostStore';

import React from 'react';
import HostCreateRoom from '@/src/components/host/HostCreateRoom';
import HostLobby from '@/src/components/host/HostLobby';

const renderSwitch = (param: string) => {
  switch (param) {
    case 'idle':
      return <HostIdle />;
    case 'create':
      return <HostCreateRoom />;
    case 'lobby':
      return <HostLobby />;
    case 'start':
      return <HostLobby />;
    default:
      return <HostIdle />;
  }
};

export default function HostPage() {
  const { game } = useHostStore();
  return (
    <div className='min-h-screen'>
      <title>Host page</title>
      {renderSwitch(game)}
    </div>
  );
}

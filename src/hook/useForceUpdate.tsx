import { useState } from 'react';

export function useForceUpdate() {
  const [, forceUpdate] = useState<any>();
  return { forceUpdate };
}

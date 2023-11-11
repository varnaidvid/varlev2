import type { FC } from 'react';
import { memo, useContext } from 'react';

import { Box } from './Box';
import { Dustbin } from './Dustbin';
import { VezerloContext } from '@/app/vezerlopult/layout';

export const Container: FC = memo(function Container() {
  const { draggableItems } = useContext(VezerloContext);

  return (
    <div>
      <div style={{ overflow: 'hidden', clear: 'both' }}>
        <Dustbin />
      </div>
      <div style={{ overflow: 'hidden', clear: 'both' }}>
        {draggableItems?.map((item, index) => (
          <Box name={item} key={index} />
        ))}
      </div>
    </div>
  );
});

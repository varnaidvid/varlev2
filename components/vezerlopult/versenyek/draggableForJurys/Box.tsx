import { useContext, type CSSProperties, type FC, useEffect } from 'react';
import { useDrag } from 'react-dnd';

import { VezerloContext } from '@/app/vezerlopult/layout';
import { Card } from '../../../ui/card';
import { Avatar, AvatarFallback } from '../../../ui/avatar';

export interface BoxProps {
  name: string;
  index: number;
}

interface DropResult {
  name: string;
}

export const Box: FC<BoxProps> = function Box({ name, index }) {
  const {
    juryDraggableItems,
    setJuryDraggableItems,
    juryDroppedItems,
    setJuryDroppedItems,
    setIsJuryDragging,
  } = useContext(VezerloContext);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'BOX',
      item: { name },
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult<DropResult>();

        if (item && dropResult) {
          setJuryDraggableItems((prev) => {
            const newItems = Array.from(prev || []);
            newItems.splice(index, 1);
            return newItems;
          });
          setJuryDroppedItems((prev) => {
            const newItems = Array.from(prev || []);
            newItems.splice(index, 0, item.name);
            return newItems;
          });
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        handlerId: monitor.getHandlerId(),
      }),
    }),
    [name, juryDraggableItems, juryDroppedItems]
  );

  useEffect(() => {
    setIsJuryDragging(isDragging);
  }, [isDragging]);

  const opacity = isDragging ? 0.4 : 1;
  return (
    <Card
      ref={drag}
      className="p-2 border-dashed hover:cursor-pointer hover:bg-accent hover:shadow-sm"
    >
      <span>{name}</span>
    </Card>
  );
};

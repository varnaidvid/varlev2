import { useContext, type CSSProperties, type FC, useEffect } from 'react';
import { useDrop } from 'react-dnd';

import { VezerloContext } from '@/app/vezerlopult/layout';
import { Card } from '../../../ui/card';
import { Avatar, AvatarFallback } from '../../../ui/avatar';
import { Button } from '../../../ui/button';
import { Trash, UsersThree } from '@phosphor-icons/react';
import { Skeleton } from '@/components/ui/skeleton';

export const Dustbin: FC = () => {
  const {
    droppedItems,
    setDroppedItems,
    draggableItems,
    setDraggableItems,
    isDragging,
    isTeamLoading,
  } = useContext(VezerloContext);

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: 'BOX',
      drop: () => ({ name: 'Dustbin' }),
      canDrop: (item: any) => {
        return droppedItems?.length != 3;
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [droppedItems]
  );

  const isActive = canDrop && isOver;
  const isText = droppedItems?.length == 0 || !droppedItems;

  return (
    <Card
      ref={drop}
      className={`h-[200px] w-full border-dashed transition-all ${
        isActive ? 'bg-accent' : ''
      } ${
        isText
          ? 'border-2 border-gray-300 flex justify-center items-center'
          : ''
      } ${
        isDragging && canDrop ? 'animate-pulse border-2 border-gray-300' : ''
      }`}
    >
      {isTeamLoading
        ? Array.from(Array(3).keys()).map((item, index) => (
            <div>
              <Skeleton key={index} className="h-12 w-full" />
            </div>
          ))
        : droppedItems?.map((item, index) => (
            <Card className="flex items-center w-full justify-between p-3 border-dashed">
              <div className="flex items-center">
                <Avatar>
                  <AvatarFallback className="text-sm h-9 w-9 border-gray-300 border-dotted border-2 bg-black text-white">
                    {item[0] + item[item.indexOf('-') + 1]}
                  </AvatarFallback>
                </Avatar>
                <span className="ml-1">{item}</span>
              </div>

              <div>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setDroppedItems((prevItems) =>
                      prevItems
                        ? prevItems.filter((prevItem) => prevItem !== item)
                        : []
                    );

                    setDraggableItems([...draggableItems!, item]);
                  }}
                >
                  <Trash className="w-6 h-6 mr-1" />
                  Törlés
                </Button>
              </div>
            </Card>
          ))}

      <span className={isDragging ? 'animate-pulse' : ''}>
        {isTeamLoading &&
          Array.from(Array(3).keys()).map((item, index) => (
            <div>
              <Skeleton key={index} className="h-12 w-full" />
            </div>
          ))}
        {isText && !isTeamLoading && (
          <div className="flex flex-col items-center gap-2">
            <UsersThree className="h-10 w-10" weight="bold" />
            <p>Húzzon ide egy tanulót</p>
          </div>
        )}
      </span>
    </Card>
  );
};

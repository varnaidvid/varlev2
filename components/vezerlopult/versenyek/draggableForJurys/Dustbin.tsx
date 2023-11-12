import { useContext, type CSSProperties, type FC, useEffect } from 'react';
import { useDrop } from 'react-dnd';

import { VezerloContext } from '@/app/vezerlopult/layout';
import { Card } from '../../../ui/card';
import { Avatar, AvatarFallback } from '../../../ui/avatar';
import { Button } from '../../../ui/button';
import { PencilLine, Trash, UsersThree } from '@phosphor-icons/react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

export const Dustbin: FC = () => {
  const {
    juryDroppedItems,
    setJuryDroppedItems,
    setJuryDraggableItems,
    juryDraggableItems,
    isJuryDragging,
    setIsJuryDragging,
    isJuryLoading,
  } = useContext(VezerloContext);

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: 'BOX',
      drop: () => ({ name: 'Dustbin' }),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [juryDroppedItems, juryDraggableItems]
  );

  const isActive = canDrop && isOver;
  const isText = juryDroppedItems?.length == 0 || !juryDroppedItems;

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
        isJuryDragging && canDrop
          ? 'animate-pulse border-2 border-gray-300'
          : ''
      }`}
    >
      <ScrollArea className="h-full">
        {isJuryLoading
          ? Array.from(Array(3).keys()).map((item, index) => (
              <div>
                <Skeleton key={index} className="h-12 w-full" />
              </div>
            ))
          : juryDroppedItems?.map((item, index) => (
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
                      setJuryDroppedItems((prevItems) =>
                        prevItems
                          ? prevItems.filter((prevItem) => prevItem !== item)
                          : []
                      );

                      setJuryDraggableItems((prevItems) =>
                        prevItems ? [...prevItems, item] : [item]
                      );
                    }}
                  >
                    <Trash className="w-6 h-6 mr-1" />
                    Törlés
                  </Button>
                </div>
              </Card>
            ))}
      </ScrollArea>
      <span className={isJuryDragging ? 'animate-pulse' : ''}>
        {isJuryLoading &&
          Array.from(Array(3).keys()).map((item, index) => (
            <div>
              <Skeleton key={index} className="h-12 w-full" />
            </div>
          ))}
        {isText && !isJuryLoading && (
          <div className="flex flex-col items-center gap-2">
            <PencilLine className="h-10 w-10" weight="bold" />
            <p>Húzza ide a kívánt zsűriket</p>
          </div>
        )}
      </span>
    </Card>
  );
};

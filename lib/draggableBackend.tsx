import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { DndProvider } from 'react-dnd';

export default function DraggableBackend({ children }: { children: any }) {
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  const Backend = isMobile ? TouchBackend : HTML5Backend;

  return <DndProvider backend={Backend}>{children}</DndProvider>;
}

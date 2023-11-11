import { render } from 'react-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Container } from './container';
import { useState } from 'react';

const Draggable = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Container />
    </DndProvider>
  );
};
export default Draggable;

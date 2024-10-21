import React from 'react';
import { useDrop } from 'react-dnd';

const DropZone = ({ onDrop }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'item',
        drop: (item) => onDrop(item),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));

    return (
        <div ref={drop} className={`drop-zone ${isOver ? 'hover' : ''}`}>
            <p>Drop here</p>
        </div>
    );
};

export default DropZone;

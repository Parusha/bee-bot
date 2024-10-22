import React from 'react';
import { useDrag } from 'react-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';

const DragItem = ({ name }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'item',
        item: { name },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    return (
        <div ref={drag} className={`drag-item ${isDragging ? 'dragging' : ''}`}>
            <FontAwesomeIcon icon={faGripVertical} className="drag-icon" /> {/* Drag icon */}
            <span className="drag-text">{name}</span> {/* Drag item content */}
        </div>
    );
};

export default DragItem;

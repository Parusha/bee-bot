import React from 'react';
import { useDrop } from 'react-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const DropZone = ({ onDrop, droppedItems, onRemove }) => {
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
            {droppedItems.map((item, index) => (
                <div className="dropped-item" key={index}>
                    <p>{item.name}</p>
                    <button onClick={() => onRemove(index)} className="delete-button">
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default DropZone;

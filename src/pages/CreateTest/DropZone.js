import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const DropZone = ({ onDrop, droppedItems, onRemove, dropData, onInputChange }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'item',
        drop: (item) => handleDrop(item),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));

    const handleDrop = (item) => {
        const dropItem = dropData.find((data) => data.drag === item.name);
        if (dropItem) {
            onDrop(dropItem);
        }
    };

    return (
        <div ref={drop} className={`drop-zone ${isOver ? 'hover' : ''}`}>
            <p>Drop here</p>
            {droppedItems.map((item, index) => (
                <div className="dropped-item" key={index}>
                    <p>{item.drop || "Dropped Item"}</p>
                    <input
                        type="text"
                        value={item.inputs['placeholder'] || ''}
                        onChange={(event) => onInputChange(index, 'placeholder', event.target.value)}
                        placeholder={item.placeholder || "Enter text"}
                    />
                    {item.placeholder2 && (
                        <input
                            type="text"
                            value={item.inputs['placeholder2'] || ''}
                            onChange={(event) => onInputChange(index, 'placeholder2', event.target.value)}
                            placeholder={item.placeholder2 || "Enter additional text"}
                        />
                    )}
                    <button onClick={() => onRemove(index)} className="delete-button">
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            ))}
        </div>
    );
};


export default DropZone;

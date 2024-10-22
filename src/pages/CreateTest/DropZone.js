import React, { useState } from 'react';
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

    // Create a state to store the inputs for each dropped item
    const [inputValues, setInputValues] = useState({});

    // Handle input changes for each dropped item
    const handleInputChange = (index, event) => {
        const updatedValues = { ...inputValues, [index]: event.target.value };
        setInputValues(updatedValues);
    };

    return (
        <div ref={drop} className={`drop-zone ${isOver ? 'hover' : ''}`}>
            <p>Drop here</p>
            {droppedItems.map((item, index) => (
                <div className="dropped-item" key={index}>
                    <p>{item.name}</p>
                    {/* Input box to allow user input */}
                    <input
                        type="text"
                        value={inputValues[index] || ''}
                        onChange={(event) => handleInputChange(index, event)}
                        placeholder="Enter text"
                    />
                    <button onClick={() => onRemove(index)} className="delete-button">
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default DropZone;

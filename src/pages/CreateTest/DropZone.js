import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const DropZone = ({ onDrop, droppedItems, onRemove, dropData }) => {
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

    const [inputValues, setInputValues] = useState({});
    const [inputValues2, setInputValues2] = useState({});


    const handleInputChange = (index, event) => {
        const updatedValues = { ...inputValues, [index]: event.target.value };
        setInputValues(updatedValues);
    };

    const handleInputChange2 = (index, event) => {
        const updatedValues2 = { ...inputValues2, [index]: event.target.value };
        setInputValues2(updatedValues2);
    };

    return (
        <div ref={drop} className={`drop-zone ${isOver ? 'hover' : ''}`}>
            <p>Drop here</p>
            {droppedItems.map((item, index) => (
                <div className="dropped-item" key={index}>
                    <p>{item.drop || "Dropped Item"}</p>

                    <input
                        type="text"
                        value={inputValues[index] || ''}
                        onChange={(event) => handleInputChange(index, event)}
                        placeholder={item.placeholder || "Enter text"}
                    />

                    {item.placeholder2 && (
                        <input
                            type="text"
                            value={inputValues2[index] || ''}
                            onChange={(event) => handleInputChange2(index, event)}
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

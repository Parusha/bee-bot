import React from 'react';
import { useDrop } from 'react-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const DropZone = ({ onDrop, droppedItems, onRemove, dropData, onInputChange }) => {
    const handleDrop = (item) => {
        const dropItem = dropData.find((data) => data.drag === item.name);
        if (dropItem) {
            onDrop(dropItem);
        }
    };

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'item',
        drop: handleDrop,
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));

    return (
        <div ref={drop} className={`drop-zone ${isOver ? 'hover' : ''}`}>
            <p>Drop here</p>
            {droppedItems.map((item, index) => {
                const { drop, inputs = {}, placeholder, placeholder2 } = item;

                return (
                    <div className="dropped-item" key={drop ? drop.id : index}>
                        <p>{drop || "Custom Code Block"}</p> {/* Displays "Custom Code Block" if drop is not defined */}
                        
                        {/* Conditional rendering of input boxes based on placeholders */}
                        {placeholder && !placeholder2 && (
                            <input
                                type="text"
                                value={inputs['placeholder'] || ''}
                                onChange={(event) => onInputChange(index, 'placeholder', event.target.value)}
                                placeholder={placeholder || "Enter text"}
                            />
                        )}

                        {placeholder && placeholder2 && (
                            <>
                                <input
                                    type="text"
                                    value={inputs['placeholder'] || ''}
                                    onChange={(event) => onInputChange(index, 'placeholder', event.target.value)}
                                    placeholder={placeholder || "Enter text"}
                                />
                                <input
                                    type="text"
                                    value={inputs['placeholder2'] || ''}
                                    onChange={(event) => onInputChange(index, 'placeholder2', event.target.value)}
                                    placeholder={placeholder2 || "Enter additional text"}
                                />
                            </>
                        )}

                        {/* Display "Custom Code" when only placeholder2 is available and no input box is displayed */}
                        {!placeholder && placeholder2 && (
                            <></>
                        )}

                        <button 
                            onClick={() => onRemove(index)} 
                            className="delete-button" 
                            aria-label="Remove item"
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default DropZone;

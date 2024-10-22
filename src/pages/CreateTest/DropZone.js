import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const DropZone = ({ onDrop, dropData }) => {
    // State to track dropped items
    const [droppedItems, setDroppedItems] = useState([]);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'item',
        drop: (item) => handleDrop(item),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));

    // Handle the drop event
    const handleDrop = (item) => {
        // Match the dragged item's name to find the corresponding drop data
        const dropItem = dropData.find(data => data.drag === item.name); // Use item.name instead of item.drag
        if (dropItem) {
            setDroppedItems((prev) => [...prev, dropItem]); // Add the drop item to droppedItems state
            onDrop(dropItem); // Call the onDrop function passed as prop
        }
    };

    // Create a state to store the inputs for each dropped item
    const [inputValues, setInputValues] = useState({});
    const [inputValues2, setInputValues2] = useState({}); // State for the second input

    // Handle input changes for each dropped item
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
                    <p>{item.drop || "Dropped Item"}</p> {/* Display drop text */}
                    
                    <input
                        type="text"
                        value={inputValues[index] || ''}
                        onChange={(event) => handleInputChange(index, event)}
                        placeholder={item.placeholder || "Enter text"}
                    />
                    
                    {/* Conditionally render the second input box if placeholder2 exists */}
                    {item.placeholder2 && (
                        <input
                            type="text"
                            value={inputValues2[index] || ''}
                            onChange={(event) => handleInputChange2(index, event)}
                            placeholder={item.placeholder2 || "Enter additional text"} // Using placeholder2
                        />
                    )}
                    
                    <button onClick={() => setDroppedItems(prev => prev.filter((_, i) => i !== index))} className="delete-button">
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default DropZone;

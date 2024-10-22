import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '../../styles/CreateTest.css';
import DragItem from './DragItem';
import DropZone from './DropZone';
import dragDropData from '../../data/dragDropData.json'; // Import your JSON file

const CreateTest = () => {
    const [droppedItems, setDroppedItems] = useState([]);

    const handleDrop = (item) => {
        setDroppedItems((prevItems) => [...prevItems, item]);
    };

    const handleRemoveItem = (index) => {
        const updatedItems = [...droppedItems];
        updatedItems.splice(index, 1);
        setDroppedItems(updatedItems);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="howto-container">
                <h1>Drag and Drop Steps</h1>
                <div className="drag-drop-container">
                    <div className="drag-items">
                        <h2>Code Blocks</h2>
                        {dragDropData.items.map((item, index) => (
                            <DragItem key={index} name={item.drag} />
                        ))}
                    </div>
                    <div className="drop-zone">
                        <h2>Drop Zone</h2>
                        <DropZone
                            onDrop={handleDrop}
                            droppedItems={droppedItems}
                            onRemove={handleRemoveItem}
                            dropData={dragDropData.items} // Pass the full item array to DropZone
                        />
                    </div>
                </div>
            </div>
        </DndProvider>
    );
};

export default CreateTest;

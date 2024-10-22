import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DragItem from './DragItem';
import DropZone from './DropZone';
import '../../styles/CreateTest.css'; // Import your CSS file for bee-themed styles

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
                        <DragItem name="Go to the Page" />
                        <DragItem name="Wait seconds" />
                        <DragItem name="Click on the element" />
                        <DragItem name="Type text to the input" />
                    </div>
                    <div className="drop-zone">
                        <h2>Drop Zone</h2>
                        <DropZone onDrop={handleDrop} droppedItems={droppedItems} onRemove={handleRemoveItem} />
                    </div>
                </div>
            </div>
        </DndProvider>
    );
};

export default CreateTest;

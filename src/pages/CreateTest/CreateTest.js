import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '../../styles/CreateTest.css';
import DragItem from './DragItem';
import DropZone from './DropZone';
import dragDropData from '../../data/dragDropData.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faLightbulb, faEye } from '@fortawesome/free-solid-svg-icons';

const CreateTest = () => {
    const [droppedItems, setDroppedItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [testSuiteName, setTestSuiteName] = useState('');
    const [description, setDescription] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [contentMode, setContentMode] = useState('blocks'); // Mode for showing blocks, hint, or preview

    const handleDrop = (item) => {
        setDroppedItems((prevItems) => [...prevItems, item]);
    };

    const handleRemoveItem = (index) => {
        const updatedItems = [...droppedItems];
        updatedItems.splice(index, 1);
        setDroppedItems(updatedItems);
        console.log('Removed item');
    };

    const handleSave = () => {
        if (droppedItems.length > 0) {
            setShowModal(true);
        } else {
            setShowErrorModal(true); // Show error modal if no items are present
        }
    };

    const handleModalSave = () => {
        console.log('Test Suite Name:', testSuiteName);
        console.log('Description:', description);
        console.log('Dropped items:', droppedItems);
        setShowModal(false);
        setTestSuiteName('');
        setDescription('');
    };

    const handleCloseErrorModal = () => {
        setShowErrorModal(false); // Close error modal
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="howto-container">
                <h1>Drag and Drop Steps</h1>
                <div className="drag-drop-container">
                    <div className="drag-items">
                        <h2>Code Blocks</h2>
                        {contentMode === 'blocks' && (
                            dragDropData.items.map((item, index) => (
                                <DragItem key={index} name={item.drag} />
                            ))
                        )}
                        {contentMode === 'hint' && (
                            <div>
                                <p>Drag items from the "Code Blocks" section to the "Drop Zone" to create your test steps. Click "Save" to save the test suite.</p>
                                <button onClick={() => setContentMode('blocks')}>Back to Code Blocks</button>
                            </div>
                        )}
                        {contentMode === 'preview' && (
                            <div>
                                <h3>Preview Dropped Items</h3>
                                {droppedItems.length > 0 ? (
                                    <ul>
                                        {droppedItems.map((item, index) => (
                                            <li key={index}>{item.drag}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No items have been added to the drop zone yet.</p>
                                )}
                                <button onClick={() => setContentMode('blocks')}>Back to Code Blocks</button>
                            </div>
                        )}
                    </div>
                    <div className="drop-zone">
                        <h2>Drop Zone</h2>
                        <DropZone
                            onDrop={handleDrop}
                            droppedItems={droppedItems}
                            onRemove={handleRemoveItem}
                            dropData={dragDropData.items}
                        />
                    </div>
                </div>
                <div className="button-container">
                    <button className="hint-button" onClick={() => setContentMode('hint')}>
                        <FontAwesomeIcon icon={faLightbulb} /> Hint
                    </button>
                    <button className="preview-button" onClick={() => setContentMode('preview')}>
                        <FontAwesomeIcon icon={faEye} /> Preview
                    </button>
                    <button className="save-button" onClick={handleSave}>
                        <FontAwesomeIcon icon={faSave} /> Save
                    </button>
                </div>

                {/* Save Test Suite Modal */}
                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Save Test Suite</h3>
                            <label>
                                Test Suite Name:
                                <input
                                    type="text"
                                    value={testSuiteName}
                                    onChange={(e) => setTestSuiteName(e.target.value)}
                                />
                            </label>
                            <label>
                                Description:
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </label>
                            <button onClick={handleModalSave}>Save</button>
                            <button onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                )}

                {/* Error Modal for no dropped items */}
                {showErrorModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Buzz Buzz Buzz!</h3>
                            <p>No items to save. Please add items to the drop zone.</p>
                            <button onClick={handleCloseErrorModal}>OK</button>
                        </div>
                    </div>
                )}
            </div>
        </DndProvider>
    );
};

export default CreateTest;

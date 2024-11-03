import React from 'react';

const AddItemForm = ({ newItem, handleFormChange, handleAddNewItem, toggleContentMode, setContentMode }) => {
    return (
        <div className="form-container">
            <button className="back-button" onClick={() => {
                setContentMode('blocks'); 
                toggleContentMode('blocks');
            }}>
                ← Return to Code Blocks
            </button>
            <form className="styled-form">
                <label>
                    Drag Label:
                    <input
                        type="text"
                        name="drag"
                        value={newItem.drag}
                        onChange={handleFormChange}
                        required
                    />
                </label>
                <label>
                    Drop Label:
                    <input
                        type="text"
                        name="drop"
                        value={newItem.drop}
                        onChange={handleFormChange}
                        required
                    />
                </label>
                <label>
                    Placeholder (optional):
                    <input
                        type="text"
                        name="placeholder"
                        value={newItem.placeholder}
                        onChange={handleFormChange}
                    />
                </label>
                <label>
                    Placeholder 2 (optional):
                    <input
                        type="text"
                        name="placeholder2"
                        value={newItem.placeholder2}
                        onChange={handleFormChange}
                    />
                </label>
                <label>
                    Log Message:
                    <input
                        type="text"
                        name="logMessage"
                        value={newItem.logMessage}
                        onChange={handleFormChange}
                        required
                    />
                </label>
                <label>
                    Code Block:
                    <textarea
                        name="codeBlock"
                        value={newItem.codeBlock}
                        onChange={handleFormChange}
                        required
                        className="non-resizable-textarea"
                    />
                </label>
                <button type="button" onClick={handleAddNewItem} className="align-right">
                    Add Item
                </button>
            </form>
        </div>
    );
};

export default AddItemForm;

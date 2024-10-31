import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '../../styles/CreateTest.css';
import DragItem from './DragItem';
import DropZone from './DropZone';
import dragDropData from '../../data/dragDropData.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faLightbulb, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CreateTest = () => {
    const [droppedItems, setDroppedItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [testSuiteName, setTestSuiteName] = useState('');
    const [description, setDescription] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [contentMode, setContentMode] = useState('blocks');
    const [heading, setHeading] = useState('Code Blocks');

    const handleDrop = (item) => {
        const newItem = { ...item, inputs: {} };
        if (item.placeholder) newItem.inputs['placeholder'] = '';
        if (item.placeholder2) newItem.inputs['placeholder2'] = '';
        setDroppedItems((prevItems) => [...prevItems, newItem]);
    };

    const handleInputChange = (index, placeholderKey, value) => {
        setDroppedItems((prevItems) => {
            const updatedItems = [...prevItems];
            updatedItems[index].inputs[placeholderKey] = value;
            return updatedItems;
        });
    };

    const generateCodePreview = (item) => {
        let codePreview = item.codeBlock;
        for (const [key, value] of Object.entries(item.inputs)) {
            codePreview = codePreview.replace(`\${${key}}`, value || '');
        }
        return codePreview;
    };

    const handleRemoveItem = (index) => {
        const updatedItems = [...droppedItems];
        updatedItems.splice(index, 1);
        setDroppedItems(updatedItems);
    };

    const handleSave = () => {
        if (droppedItems.length > 0) {
            setShowModal(true);
        } else {
            setShowErrorModal(true);
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

    const generateFullPreview = () => {
        let codeTemplate = `const puppeteer = require('puppeteer');
const path = require('path');
const { getViewport, launchBrowser, getScreenshotPath } = require('./puppeteerUtils');

const runTest = async (formData, io) => {
  const { url, username, password, device } = formData;

  if (!url || !username || !password || !device) {
    throw new Error('URL, username, password, and device are required');
  }

  try {
    io.emit('log', 'Launching browser...');
    const browser = await launchBrowser();
    const page = await browser.newPage();

    //Drop code here
    // ADD CODE HERE
    // Screenshot
    const screenshotPath = getScreenshotPath('screenShot');
    // Close Browser
    io.emit('log', 'Closing browser...');
    await browser.close();

    return {
      message: 'Test completed successfully',
      screenshotUrl: 'screenShot',
    };
  } catch (error) {
    io.emit('log', \`Error running Puppeteer test: \${error.stack || error.message}\`);
    throw new Error(\`Error running test: \${error.message}\`);
  }
};

module.exports = runTest;`;

        const droppedItemsCode = droppedItems
            .map((item) => generateCodePreview(item))
            .join('\n\t');

        codeTemplate = codeTemplate.replace('// ADD CODE HERE', droppedItemsCode);
        return codeTemplate;
    };

    const toggleContentMode = (mode) => {
        setContentMode((prevMode) => {
            const newMode = prevMode === mode ? 'blocks' : mode;

            if (newMode === 'hint') {
                setHeading('Hint');
            } else if (newMode === 'preview') {
                setHeading('Code Preview');
            } else {
                setHeading('Code Blocks');
            }

            return newMode;
        });
    };

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="howto-container">
                <h1>Drag and Drop Steps</h1>
                <div className="drag-drop-container">
                    <div className="drag-items">
                        <h2>{heading}</h2>
                        {contentMode === 'blocks' && (
                            dragDropData.items.map((item, index) => (
                                <DragItem key={index} name={item.drag} />
                            ))
                        )}
                        {contentMode === 'hint' && (
                            <div>
                                <p>Drag items from the "Code Blocks" section to the "Drop Zone" to create your test steps. Click "Save" to save the test suite.</p>
                            </div>
                        )}
                        {contentMode === 'preview' && (
                            <div className="code-preview">
                                {droppedItems.length > 0 ? (
                                    <SyntaxHighlighter language="javascript" style={solarizedlight}>
                                        {generateFullPreview()}
                                    </SyntaxHighlighter>
                                ) : (
                                    <p>Please drop an item into the Drop Zone to see the preview.</p>
                                )}
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
                            onInputChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="button-container">
                    <button className="hint-button" onClick={() => toggleContentMode('hint')}>
                        <FontAwesomeIcon icon={faLightbulb} /> Hint
                    </button>
                    <button className="preview-button" onClick={() => toggleContentMode('preview')}>
                        <FontAwesomeIcon icon={contentMode === 'preview' ? faEyeSlash : faEye} /> Preview
                    </button>
                    <button className="save-button" onClick={handleSave}>
                        <FontAwesomeIcon icon={faSave} /> Save
                    </button>
                </div>

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

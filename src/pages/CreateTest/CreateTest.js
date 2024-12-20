import React, { useState } from 'react';
import axios from 'axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '../../styles/CreateTest.css';
import DragItem from './DragItem';
import DropZone from './DropZone';
import AddItemForm from './AddItemForm';
import dragDropData from '../../data/dragDropData.json';
import testSuitDataStructure from '../../data/testSuitDataStructure.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faLightbulb, faEye, faEyeSlash, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import HintTestTable from './HintTestTable';


const CreateTest = () => {
    const [droppedItems, setDroppedItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [testSuitData, setTestSuitData] = useState(testSuitDataStructure);
    const [testName, setTestName] = useState('');
    const [description, setDescription] = useState('');
    const [testSuit, setTestSuit] = useState('');  // Add this line for the testSuit state
    const [testSuiteName, setTestSuiteName] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [contentMode, setContentMode] = useState('blocks');
    const [heading, setHeading] = useState('Code Blocks');
    const [showForm, setShowForm] = useState(false);
    const [newItem, setNewItem] = useState({
        drag: '',
        drop: '',
        placeholder: '',
        placeholder2: '',
        logMessage: '',
        codeBlock: '',
    });
    const [selectedItemToDelete, setSelectedItemToDelete] = useState('');
    const [items, setItems] = useState(dragDropData.items);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setNewItem((prevItem) => ({
            ...prevItem,
            [name]: value,
        }));
    };

    const handleAddNewItem = async () => {
        if (newItem.drag && newItem.drop && newItem.codeBlock) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/add-drag-drop-item`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newItem),
                });

                if (response.ok) {

                    const addedItem = { ...newItem, inputs: {} };
                    if (newItem.placeholder) addedItem.inputs['placeholder'] = '';
                    if (newItem.placeholder2) addedItem.inputs['placeholder2'] = '';

                    setItems((prevItems) => [...prevItems, addedItem]); // Update the items list
                    setDroppedItems((prevItems) => [...prevItems, addedItem]); // Update dropped items
                    setNewItem({ drag: '', drop: '', placeholder: '', placeholder2: '', logMessage: '', codeBlock: '' });
                    setShowForm(false);
                    alert('Item added successfully!');

                } else {
                    alert('Failed to add item. Please check the required fields.');
                }
            } catch (error) {
                console.error('Error adding item:', error);
                alert('Error adding item. Please try again.');
            }
        } else {
            alert('Please fill out all required fields.');
        }
    };
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
        let codePreview = `io.emit('log', ${JSON.stringify(item.logMessage)});\n\t`;
        codePreview += item.codeBlock;
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
        // Close the modal and reset the state
        setShowModal(false);
        setTestSuiteName('');
        setTestName('');
        setDescription('');
        const fileContent = generateFullPreview();
        const file = new Blob([fileContent], { type: 'application/javascript' });
        const formData = new FormData();
        formData.append('file', file, `${testSuiteName}.js`);
        formData.append('testName', testName); // Use the correct testName
        formData.append('description', description);

        window.alert('Uploading test file. Please wait...');

        axios.post(`${process.env.REACT_APP_API_BASE_URL}/upload-test`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((response) => {
                console.log('File uploaded successfully:', response.data.message);
                setUploadMessage(response.data.message);
                setUploadSuccess(true);

                window.alert('File uploaded successfully!');

                const existingSuit = testSuitDataStructure.find(
                    (suit) => suit.testSuit.toLowerCase() === testSuit.toLowerCase()
                );

                if (existingSuit) {
                    console.log('Update the test only');
                    const existingTest = existingSuit.tests.find(
                        (test) => test.content.testName.toLowerCase() === testSuit.toLowerCase()
                    );

                    if (!existingTest) {
                        existingSuit.tests.push({
                            title: `${testSuiteName} Test`,
                            content: {
                                testName: testSuiteName,
                                description: description,
                            },
                        });
                    } else {
                        console.log(`Test '${testSuit}' already exists in the suite '${testSuiteName}'.`);
                        window.alert(`Test '${testSuit}' already exists in the suite '${testSuiteName}'.`);
                    }
                } else {
                    console.log('Create the whole test suite');
                    testSuitDataStructure.push({
                        testSuit: testSuit,
                        tests: [
                            {
                                title: `${testSuiteName} Test`,
                                content: {
                                    testName: testSuiteName,
                                    description: description,
                                },
                            },
                        ],
                    });
                }

                setTestSuitData([...testSuitData]);
                console.log(testSuitData);

                return axios.post(`${process.env.REACT_APP_API_BASE_URL}/update-accordion-data`, testSuitData);
            })
            .then((response) => {
                console.log('Data updated successfully:', response.data.message);
                setUploadMessage('Test suite updated successfully');
                window.alert('Test suite updated successfully!');
            })
            .catch((error) => {
                console.error('Error uploading or updating data:', error);
                setUploadMessage('Error uploading the file');
                setUploadSuccess(false);
                window.alert('An error occurred while uploading or updating the data. Please try again.');
            });
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

    // Drop code here
    //=========================================================================
    // ADD CODE HERE
    //=========================================================================

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
            } else if (newMode === 'addItem') {
                setHeading('Add New Code Block');
            } else {
                setHeading('Code Blocks');
            }

            return newMode;
        });
    };

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    };

    const handleDeleteItem = async () => {
        const confirmed = window.confirm(`Are you sure you want to delete "${selectedItemToDelete}"?`);
        if (confirmed) {
            console.log('yes');
            // Find the index of the item to delete
            const itemIndex = droppedItems.findIndex(item => item.drag === selectedItemToDelete);
            console.log(itemIndex);
            if (itemIndex === -1) {
                // Update the local state by filtering out the deleted item
                const updatedItems = droppedItems.filter((_, index) => index !== itemIndex);
                setDroppedItems(updatedItems); // Update local state

                // Optional: Send a request to delete the item from the server
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/delete-drag-drop-item`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ drag: selectedItemToDelete }), // Send the item identifier
                    });

                    if (!response.ok) {
                        throw new Error('Failed to delete item on the server.');
                    }

                    alert('Item deleted successfully!');
                } catch (error) {
                    console.error('Error deleting item:', error);
                    alert('Error deleting item. Please try again.');
                }
            }
        }
        setShowDeleteModal(false); // Close the modal after deletion
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="howto-container">
                <h1>Drag and Drop Steps</h1>
                <div className="drag-drop-container">
                    <div className="drag-items">
                        <h2>{heading}</h2>
                        {contentMode === 'blocks' && (
                            <>
                                {items.map((item, index) => (
                                    <DragItem key={index} name={item.drag} />
                                ))}
                                <div className="button-wrapper">
                                    <button
                                        className="add-button"
                                        onClick={() => {
                                            setShowForm(!showForm);
                                            toggleContentMode('addItem');
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                    <button
                                        className="remove-button"
                                        onClick={() => {
                                            setShowForm(false);
                                            toggleContentMode('blocks');
                                            setShowDeleteModal(true);
                                        }}
                                        style={{ marginLeft: '8px' }}
                                    >
                                        <FontAwesomeIcon icon={faMinus} />
                                    </button>
                                </div>
                            </>
                        )}
                        {contentMode === 'hint' && (
                            <HintTestTable />
                        )}
                        {contentMode === 'preview' && (
                            <div className="code-preview">
                                {droppedItems.length > 0 ? (
                                    <SyntaxHighlighter language="javascript" style={solarizedlight}>
                                        {generateFullPreview()}
                                    </SyntaxHighlighter>
                                ) : (
                                    <p className="center-text">Please drop an item into the Drop Zone to see the preview.</p>
                                )}
                            </div>
                        )}
                        {contentMode === 'addItem' && (
                            <AddItemForm
                                newItem={newItem}
                                handleFormChange={handleFormChange}
                                handleAddNewItem={handleAddNewItem}
                                toggleContentMode={toggleContentMode}
                                setContentMode={setContentMode}
                            />
                        )}
                    </div>
                    <div className="drop-zone">
                        <h2>Drop Zone</h2>
                        <DropZone
                            onDrop={handleDrop}
                            droppedItems={droppedItems}
                            onRemove={handleRemoveItem}
                            dropData={items}
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
                            <label htmlFor="testSuitOptions">
                                Select Test Suite:
                                <input
                                    list="testSuitOptions"
                                    type="text"
                                    value={testSuit}
                                    onChange={(e) => setTestSuit(e.target.value)}
                                    required
                                />
                                <datalist id="testSuitOptions">
                                    {testSuitDataStructure.map((suit) => (
                                        <option key={suit.testSuit} value={suit.testSuit}>
                                            {suit.testSuit}
                                        </option>
                                    ))}
                                </datalist>
                            </label>
                            <p />
                            <label>
                                Test Name:
                                <input
                                    type="text"
                                    value={testSuiteName}
                                    onChange={(e) => setTestSuiteName(e.target.value)}
                                />
                            </label>
                            <p />
                            <label>
                                Description:
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </label>



                            <div className="modal-actions">
                                <button onClick={handleModalSave}>Save</button>
                                <button onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
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
                {showDeleteModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>Delete Item</h2>
                            <div className="form-group">
                                <label>Select Item to Delete</label>
                                <input
                                    type="text"
                                    placeholder="Enter Item to Delete"
                                    value={selectedItemToDelete}
                                    onChange={(e) => setSelectedItemToDelete(e.target.value)}
                                    list="deleteItemOptions"
                                />
                                <datalist id="deleteItemOptions">
                                    {/* Access the items array in dragDropData */}
                                    {dragDropData.items.map((item, index) => (
                                        <option key={index} value={item.drag}>
                                            {item.drag} {/* Display the 'drag' property */}
                                        </option>
                                    ))}
                                </datalist>
                            </div>
                            <button onClick={handleDeleteItem}>Delete</button>
                            <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </DndProvider>
    );
};

export default CreateTest;

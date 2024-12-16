import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../../styles/HintTestTable.css';

const HintTestTable = () => {
    const [rows, setRows] = useState([]);
    const [newTest, setNewTest] = useState({ name: '', description: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState('');

    // Fetch data from the JSON file on component load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/get-hint-tests`);
                // If the response data is not an array, set it as an empty array
                if (Array.isArray(response.data)) {
                    setRows(response.data);
                } else {
                    setRows([]); // Fallback to empty array
                    setError('The data returned is not in the correct format.');
                }
            } catch (error) {
                console.error('Error fetching hint tests:', error);
                setRows([]); // Fallback to empty array on error
                setError('There was an issue fetching the hint tests. Please try again later.');
            }
        };

        fetchData();
    }, []);

    // Add a new row to the JSON file
    const addRow = useCallback(async () => {
        if (newTest.name.trim() && newTest.description.trim()) {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/add-hint-test`, newTest);
                console.log('Response from server:', response.data); // Log the response to inspect the structure
    
                // Check if response.data is a valid test object
                if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
                    // After adding, refetch the updated list of rows
                    const fetchData = async () => {
                        try {
                            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/get-hint-tests`);
                            if (Array.isArray(response.data)) {
                                setRows(response.data); // Update state with the new list
                            } else {
                                setRows([]);
                                setError('The data returned is not in the correct format.');
                            }
                        } catch (error) {
                            console.error('Error fetching hint tests:', error);
                            setRows([]);
                            setError('There was an issue fetching the hint tests. Please try again later.');
                        }
                    };
                    fetchData();
    
                    setNewTest({ name: '', description: '' });
                    setIsModalOpen(false);
                } else {
                    setErrorMessage('Failed to update the list of tests: The response is not a valid test object.');
                }
            } catch (error) {
                console.error('Error adding test:', error);
                setErrorMessage('There was an issue adding the test. Please try again.');
            }
        } else {
            setErrorMessage('Both fields are required.');
        }
    }, [newTest]);
    


    // Delete a row from the JSON file
    const deleteRow = useCallback(async (index) => {
        const confirmed = window.confirm('Are you sure you want to delete this test?');
        if (confirmed) {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/delete-hint-test`, { index });
                setRows(response.data);
            } catch (error) {
                console.error('Error deleting test:', error);
                setError('There was an issue deleting the test. Please try again.');
            }
        }
    }, []);

    return (
        <div>
            <table className="custom-table">
                <thead>
                    <tr>
                        <th className="table-header">Custom Test</th>
                        <th className="table-header">Description</th>
                        <th className="table-header"></th>
                    </tr>
                </thead>
                <tbody>
                    {rows.length > 0 ? (
                        rows.map((row, index) => (
                            <tr key={index}>
                                <td className="table-cell">{row.name}</td>
                                <td className="table-cell">{row.description}</td>
                                <td className="table-cell">
                                    <button onClick={() => deleteRow(index)} className="delete-button">
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="no-data-message">No tests available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {error && <div className="error-message">{error}</div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <div className="button-wrapper">
                <button onClick={() => setIsModalOpen(true)} className="add-button">
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="bee-modal-overlay">
                    <div className="bee-modal-content">
                        <h2>Add New Test</h2>
                        <input
                            type="text"
                            placeholder="Custom Test Name"
                            value={newTest.name}
                            onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                            className="input-box"
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={newTest.description}
                            onChange={(e) => setNewTest({ ...newTest, description: e.target.value })}
                            className="input-box"
                        />
                        <div className="bee-modal-buttons">
                            <button onClick={addRow} className="btn">Add</button>
                            <button onClick={() => setIsModalOpen(false)} className="btn cancel">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HintTestTable;

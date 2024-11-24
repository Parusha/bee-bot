import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import '../../styles/HintTestTable.css';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const HintTestTable = () => {
    const [rows, setRows] = useState([]);
    const [newTest, setNewTest] = useState({ name: '', description: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const addRow = () => {
        if (newTest.name.trim() && newTest.description.trim()) {
            setRows([...rows, newTest]);
            setNewTest({ name: '', description: '' });
            setIsModalOpen(false); // Close modal after adding
        }
    };

    const deleteRow = (index) => {
        setRows(rows.filter((_, idx) => idx !== index));
    };

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
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td className="table-cell">{row.name}</td>
                            <td className="table-cell">{row.description}</td>
                            <td className="table-cell">
                                <button
                                    onClick={() => deleteRow(index)}
                                    className="delete-button"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="button-wrapper">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="add-button"
                >
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
                            onChange={(e) =>
                                setNewTest({ ...newTest, name: e.target.value })
                            }
                            className="input-box"
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={newTest.description}
                            onChange={(e) =>
                                setNewTest({ ...newTest, description: e.target.value })
                            }
                            className="input-box"
                        />
                        <div className="bee-modal-buttons">
                            <button onClick={addRow} className="btn">
                                Add
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="btn cancel"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HintTestTable;

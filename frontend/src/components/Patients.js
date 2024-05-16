import React, { useState, useEffect } from "react";
import axios from 'axios';
import './Patients.css';
import PatientCard from './PatientCard';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [newPatients, setNewPatient] = useState({ name: '', age:'', gender: ''});
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:5000/patients')
            .then(response => setPatients(response.data))
            .catch(error => console.error('Error fetching patients:', error));
    }, []);

    const handleAddPatient = (e) => {
        e.preventDefault();
        
        axios.post('http://localhost:5000/patients/add', newPatients)
            .then(response => {console.log(response.data)})
            .catch(error => console.error('Error adding patient:', error)); 
    };

    const handleUpdatePatient = (id,e) => {
        e.preventDefault();

        axios.post(`http://localhost:5000/patients/update/${id}`, selectedPatient)
            .then(respose => {
                const updatePat = {
                    ...selectedPatient,
                    _id: id
                };

                console.log('update patient', updatePat);

                setPatients(
                    patients.map(patients => ( 
                        patients._id === id ? updatePat : patients
                    ))
                );
                setSelectedPatient(null);
                setIsEditMode(false); // Switch back to Add mode
            })
            .catch(error => console.error('Error updating patient:', error));
    };

    const handleDeletePatient = (id) => {
        axios.delete(`http://localhost:5000/patients/delete/${id}`)
            .then(response => {
                console.log(response.data);
                setSelectedPatient(null);
                setPatients(patients.filter(patient => patient._id !== id));
            })
            .catch(error => console.error('Error deleting patient:', error)); 
    };

    const handleEditPatient = (patients) => {
        setSelectedPatient(patients);
        setIsEditMode(true);
    };

    return(
        <div className="patient-main">
            <div className="form-sections">
                <h4>
                    {
                        isEditMode ? 'Edit Patient' : 'Add New Patient'
                    }
                </h4>
                <form onSubmit={
                    isEditMode ? (e) => 
                        handleUpdatePatient(selectedPatient._id, e) : handleAddPatient}>

                    <label>Name:</label>            
                    <input type="text" 
                        value={isEditMode ? 
                                    selectedPatient.name : 
                                    newPatients.name 
                        }
                    
                        onChange={(e) => 
                                        isEditMode ? 
                                            setSelectedPatient(
                                                {
                                                    ...selectedPatient,
                                                    name: e.target.value
                                                }
                                            ) :
                                            setNewPatient(
                                                {
                                                    ...newPatients,
                                                    name: e.target.value
                                                }
                                            )   
                        } 
                    />
                    <br />
                    <button type="submit">
                        {
                            isEditMode ? 'Update Patient' : 'Add Patient'
                        }
                    </button>
                </form> 
            </div>  
        

        <div className="patients-section">
            <h3 style={{ textAlign: "center"}}>
                Patients({patients.length})
            </h3>

            <div className="patient-list">
                {patients.map(patients => (
                    <PatientCard 
                        key={patients._id}
                        patient={patients}
                        onEdit={handleEditPatient}
                        onDelete={handleDeletePatient}
                    />
                ))}
            </div>
        </div>
    </div>
    );
};

export default Patients;
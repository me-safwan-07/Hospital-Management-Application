import React, {
    useState,
    useEffect
} from "react";
import axios from "axios";
import DoctorCard from './DoctorCard.JS';
import './Doctor.css';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [newDOctor, setNewDoctor] = useState({ name: '', specialty: ''});
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:5000/doctors')
            .then(response => setDoctors(response.data))
            .catch(error => console.error('Error fetching doctors:', error));
    }, []);

    const handleAddDoctor = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/doctors/add', newDOctor)
            .then(response => {
                console.log("doc", respose.data);
                setDoctors(
                    [
                        ...doctors,
                        response.data
                    ]
                );
                setNewDoctor({
                    name: '',
                    specialty: ''
                });
            })
            .catch(error => console.error('Error adding doctor:', error));
    };

    const handleUpdateAppointment = (id,e) => {
        e.preventDefault();
        axios.post(`http://localhost:5000/doctors/update/${id}`, selectedDoctor)
            .then(response => {
                const updateDoc = {
                    ...selectedDoctor,
                    _id: id
                };

                console.log('update doc', updateDoc);

                setDoctors(
                    doctors.map(
                        doctors => (doctors._id === id ? updateDoc : doctor)
                    )
                );
                setSelectedDoctor(null);
                setIsEditMode(false); 
            })
            .catch(error => console.error('Error updating doctor:', error));
    };

    const handleDeleteDoctor = (id) => {
        axios.delete(`http://localhost:5000/doctor/delete/${id}`)
            .then(response => {
                console.log(response.data);
                setDoctors(
                    doctors.filter(
                        doctor => doctor._id !== id
                    )
                );
            })
            .catch(error => console.error('Error deleting doctors:', error));
    };

    const handleEditDoctor = (doctor) => {
        setSelectedDoctor(doctor);
        setIsEditMode(true);
    };

    return (
        <div className="main-doc-container">
            <div className="form-sections">
                <h4>
                    {
                        isEditMode? 'Edit Doctor' : 'Add New Doctor'
                    }
                </h4>
                
                <form onSubmit={isEditMode ? (e) => 
                    handleUpdateAppointment(selectedDoctor._id, e) :
                    handleAddDoctor
                }>
                    <input type="text" value={
                        isEditMode ?  selectedDoctor.specialty : newDOctor.specialty
                    } onChange={(e) => 
                        isEditMode ? setSelectedDoctor({
                            ...selectedDoctor,
                            specialty : e.target.value
                        }) : setNewDoctor({
                            ...newDOctor,
                            specialty: e.target.value
                        })
                    }/>
                    <br/>
                    <button type='submit'>
                        {
                            isEditMode ? 'Update Doctor' : 'Add Doctor'
                        }
                    </button>
                </form>
            </div>
            <div className="doctors-section">
                <h3>Doctors({doctors.length})</h3>
                <div className="doctor-list">
                    {doctors.map(doctor => (
                        <DoctorCard 
                            key={doctor._id}
                            doctor={doctor}
                            onEdit={handleEditDoctor}
                            onDelete={handleDeleteDoctor}   
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Doctors;
import React,
{
    useState,
    useEffect
} from 'react';
import axios from 'axios';
import AppointmentCard from './AppointmentCard'
import './AppointmentCard.css'

const Appointments = () => {
    const [ appointments, setAppointments] = useState([]);
    const [ newAppointment, setNewAppointment] =
        useState(
            {
                patientName: '',
                doctorName: '',
                date:''
            }
        );
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:5000/appointments')
            .then(response => setAppointments(response.data))
            .catch(error => console.error('Error fetching appointment:', error));
    }, []);

    const handleAddAppointment = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/appointments/add', newAppointment)
            .then(response => {
                console.log(response.data);
                setAppointments(
                    [ ...appointments, response.data ]
                );
                setNewAppointment({
                    patientName: '',
                    doctorName: '',
                    date: ''
                });
            })
            .catch(error => console.error('Error adding appoinment: ', error));
    };

    const handleUpdateAppointment = (id,e) => {
        e.preventDefault();
        axios.post(`http://localhost:5000/appointment/update/${id}`/*, selectedAppoitment*/)
            .then(response => {
                console.log(response.data);
                const updateApp = {...selectedAppointment, _id:id};
                setAppointments(
                    appointments.map(
                        appointment => (appointment._id === id ? updateApp : appointment)
                    )
                );
                setSelectedAppointment(null);
                setIsEditMode(false);
            })
            .catch(error => console.log('Error updating appointment:', error));
    };

    const handleDeleteAppointment = (id) => {
        axios.delete(`http://localhost:5000/appointments/delete/${id}`)
            .then(response => {
                console.log(response.data);
                setAppointments(
                    appointments.filter(
                        appointments._id !== id
                    )
                );
            })
            .catch(error => console.error('Error deleting appoinment:', error));
    };
    
     const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsEditMode(true);
    };

    return (
        <div className='flex-row' style={{ width: "100%"}}>
            <div className='flex-column'>
                <div className='add-form'>
                    <h4>
                        {
                            isEditMode ? 'Edit Appointment' : 'Add New Appointment'
                        }
                    </h4>
                    <form className='appointment-form' 
                    onSubmit={isEditMode ? (e) => handleUpdateAppointment(selectedAppointment.id, e) : handleAddAppointment}
                    >
                        <label>Patients Name:</label>
                        <input type='text' 
                            value={isEditMode ? selectedAppointment.patientName : newAppointment.patientName}
                            onChange={
                                (e) => isEditMode ? setSelectedAppointment({
                                    ...selectedAppointment,
                                    patientName: e.target.value
                                }) :
                                setNewAppointment({
                                    ...newAppointment,
                                    patientName: e.target.value
                                })
                            }
                        />
                        <label>Doctor Name</label>
                        <input type="text" 
                            value={ isEditMode ? selectedAppointment.doctorName : newAppointment.doctorName}
                            onChange={
                                (e) => isEditMode ? setSelectedAppointment({
                                    ...selectedAppointment,doctorName: e.target.value
                                }) : setNewAppointment({
                                    ...newAppointment,
                                    doctorName:e.target.value
                                })
                            }
                        />
                        <label>Date:</label>
                        <input type='date' 
                            value={ isEditMode ? selectedAppointment.date : newAppointment.date}
                            onChange={
                                (e) => isEditMode ? setSelectedAppointment({
                                    ...selectedAppointment,date: e.target.value
                                }) : setNewAppointment ({
                                    ...newAppointment,date: e.target.value
                                })
                            }
                        />
                        <button type='submit'>
                            { isEditMode ? 'Update Appointment' : 'Add appointment'}
                        </button>
                    </form>
            </div>
        </div>
        <div className='appointments'>
            <h3>Appointments ({appointments.length})</h3>
            <div className='appointment-list'>
                {appointments.map(appointment => (
                    <AppointmentCard
                            key = { appointment._id }
                            appointment = { appointment }
                            oneEdit= { handleEditAppointment }
                            onDelete={ handleDeleteAppointment }
                    />
                ))}
            </div>
        </div>
        </div>
    );
};


export default Appointments;
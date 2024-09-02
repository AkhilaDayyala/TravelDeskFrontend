import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  padding: 2rem;
  background: ${(props) => props.theme.background || '#f4f4f4'};
  color: ${(props) => props.theme.text || '#333'};
  min-height: 100vh;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: rgb(251, 113, 133); /* Button background color */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1rem;
  &:hover {
    background-color: #549be7; /* Hover background color */
  }
`;

const FormContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid ${(props) => props.theme.border || '#ddd'};
  border-radius: 5px;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid ${(props) => props.theme.border || '#ddd'};
  border-radius: 5px;
`;

const Textarea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid ${(props) => props.theme.border || '#ddd'};
  border-radius: 5px;
  resize: vertical;
`;

const HistoryContainer = styled.div`
  margin-top: 2rem;
`;

const HistoryItem = styled.li`
  background: #fff;
  border-radius: 5px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1rem;
`;



const EmployeeDashboard = () => {
    const [formData, setFormData] = useState({
        userId: '',
        firstName: '',
        lastName: '',
        departmentId: '',
        projectId: '',
        reasonForTravel: '',
        fromDate: '',
        toDate: '',
        fromLocation: '',
        toLocation: ''
    });

    const [projects, setProjects] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [travelRequests, setTravelRequests] = useState([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        // Fetch projects and departments
        axios.get('https://localhost:7075/api/Project')
            .then(response => setProjects(response.data))
            .catch(error => console.error('Error fetching projects:', error));

        axios.get('https://localhost:7075/api/Department')
            .then(response => setDepartments(response.data))
            .catch(error => console.error('Error fetching departments:', error));
    }, []);

    useEffect(() => {
        // Fetch user data from token and travel requests
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userid;
            
            setFormData(prevState => ({
                ...prevState,
                userId: userId,
                firstName: decodedToken.firstname,
                lastName: decodedToken.lastname,
                departmentId: decodedToken.departmentid
            }));

            axios.get(`https://localhost:7075/api/TravelRequest/user/${userId}`)
                .then(response => setTravelRequests(response.data))
                .catch(error => console.error('Error fetching travel requests:', error));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevState => {
            const newFormData = { ...prevState, [name]: value };

            // Convert date strings to Date objects
            const fromDate = new Date(newFormData.fromDate);
            const toDate = new Date(newFormData.toDate);
            const currentDate = new Date();

            // Validation logic
            if (name === "fromDate" && fromDate <= currentDate) {
                alert("From Date must be greater than the current date.");
                newFormData.fromDate = ""; // Reset the invalid date
            }

            if (name === "toDate" && toDate <= fromDate) {
                alert("To Date must be greater than From Date.");
                newFormData.toDate = ""; // Reset the invalid date
            }

            return newFormData;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const requestData = {
            userId: formData.userId,
            projectId: formData.projectId,
            departmentId: formData.departmentId,
            reasonForTravel: formData.reasonForTravel,
            fromDate: formData.fromDate,
            toDate: formData.toDate,
            fromLocation: formData.fromLocation,
            toLocation: formData.toLocation
        };

        axios.post('https://localhost:7075/api/TravelRequest', requestData)
            .then(response => {
                alert('Travel Request submitted successfully!');
                setFormData({
                    userId: '',
                    firstName: '',
                    lastName: '',
                    projectId: '',
                    departmentId: '',
                    reasonForTravel: '',
                    fromDate: '',
                    toDate: '',
                    fromLocation: '',
                    toLocation: ''
                });
                setShowForm(false);

                // Refetch travel requests to update history
                axios.get(`https://localhost:7075/api/TravelRequest/user/${formData.userId}`)
                    .then(response => setTravelRequests(response.data))
                    .catch(error => console.error('Error fetching travel requests:', error));
            })
            .catch(error => {
                console.error('There was an error submitting the travel request!', error);
            });
    };

    return (
        <Container>
            {!showForm && (
                <Button onClick={() => setShowForm(true)} style={{background:"black"}}>
                    Create New Travel Request
                </Button>
            )}

            {showForm && (
                <FormContainer>
                    <Title>Travel Request Form</Title>
                    <Form onSubmit={handleSubmit}>
                        <label>
                            User ID:
                            <Input
                                type="number"
                                name="userId"
                                value={formData.userId}
                                readOnly
                            />
                        </label>

                        <label>
                            First Name:
                            <Input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                readOnly
                            />
                        </label>

                        <label>
                            Last Name:
                            <Input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                readOnly
                            />
                        </label>

                        <label>
                            Department:
                            <Select
                                name="departmentId"
                                value={formData.departmentId}
                                readOnly
                                disabled
                            >
                                <option value="">Select a department</option>
                                {departments.map(department => (
                                    <option key={department.departmentId} value={department.departmentId}>
                                        {department.departmentName}
                                    </option>
                                ))}
                            </Select>
                        </label>

                        <label>
                            Project:
                            <Select
                                name="projectId"
                                value={formData.projectId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a project</option>
                                {projects.map(project => (
                                    <option key={project.projectId} value={project.projectId}>
                                        {project.projectName}
                                    </option>
                                ))}
                            </Select>
                        </label>

                        <label>
                            Reason for Travel:
                            <Textarea
                                name="reasonForTravel"
                                value={formData.reasonForTravel}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            From Date:
                            <Input
                                type="date"
                                name="fromDate"
                                value={formData.fromDate}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            To Date:
                            <Input
                                type="date"
                                name="toDate"
                                value={formData.toDate}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            From Location:
                            <Input
                                type="text"
                                name="fromLocation"
                                value={formData.fromLocation}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            To Location:
                            <Input
                                type="text"
                                name="toLocation"
                                value={formData.toLocation}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <Button type="submit" style={{background:"black"}}>Submit Request</Button>
                    </Form>
                </FormContainer>
            )}


            <HistoryContainer>
                <h1 style={{textAlign:"center",}}>Travel Request History</h1>
                <ol>
                    {travelRequests.map(request => (
                        <HistoryItem key={request.travelRequestId}>
                            <strong>Request ID:</strong> {request.travelRequestId}<br />
                            <strong>Project:</strong> {request.project.projectName}<br />
                            <strong>From:</strong> {new Date(request.fromDate).toDateString()} | <strong>To:</strong> {new Date(request.toDate).toDateString()}<br />
                            <strong>Reason for Travel:</strong> {request.reasonForTravel}<br />
                            <strong>Status:</strong> {request.status}
                        </HistoryItem>
                    ))}
                </ol>
            </HistoryContainer>
        </Container>
    );
};

export default EmployeeDashboard;

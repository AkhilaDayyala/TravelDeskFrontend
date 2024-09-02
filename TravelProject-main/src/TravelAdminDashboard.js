import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import './TravelAdminDashboard.css';

// Styled Components
const Container = styled.div`
  padding: 2rem;
  background: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.textColor};
  min-height: 100vh;
`;

const Header = styled(motion.h1)`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: bold; /* Make text bold */
  transition: color 0.3s ease-in-out;
  &:hover {
    color: ${(props) => props.theme.secondaryColor};
  }
`;

const BookingTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
  padding: 1rem;
  border-bottom: 2px solid ${(props) => props.theme.borderColor};
  background: ${(props) => props.theme.tableHeaderBackground};
  color: ${(props) => props.theme.tableHeaderText};
  text-align: left;
`;

const TableRow = styled(motion.tr)`
  &:nth-child(even) {
    background-color: ${(props) => props.theme.tableRowEven};
  }
  &:nth-child(odd) {
    background-color: ${(props) => props.theme.tableRowOdd};
  }
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.tableRowHover};
    transform: scale(1.03);
    transition: all 0.3s ease;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  background-color: rgb(251, 113, 133); /* Updated to use direct RGB value */
  color: ${(props) => props.theme.buttonText};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.buttonHoverBackground};
  }
`;

const TravelAdminDashboard = () => {
    const [travelRequests, setTravelRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Function to fetch travel requests
    const fetchTravelRequests = async () => {
        try {
            const response = await axios.get('https://localhost:7075/api/TravelAdmin/GetAllRequests');
            console.log('API Response:', response.data);

            if (Array.isArray(response.data)) {
                // Prepend the new data to the existing data
                setTravelRequests(prevData => [...response.data, ...prevData]);
            } else {
                console.error('Unexpected data format:', response.data);
                setTravelRequests([]);
            }
        } catch (error) {
            console.error('Error fetching travel requests:', error);
            setTravelRequests([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTravelRequests();
    }, []);

    const handleBooking = async (id) => {
        try {
            const bookingDetails = {
                comments: 'Booking confirmed',
                ticketUrl: 'http://example.com/ticket'
            };

            await axios.post(`https://localhost:7075/api/TravelAdmin/BookTicket/${id}`, bookingDetails);
            alert('Ticket booked successfully!');
            await fetchTravelRequests(); // Refresh the list
        } catch (error) {
            console.error('Error booking ticket:', error.response ? error.response.data : error.message);
            alert('Failed to book ticket.');
        }
    };

    const handleReturnToManager = async (id) => {
        try {
            const comments = 'Returning to manager for review';

            await axios.post(`https://localhost:7075/api/TravelAdmin/ReturnToManager/${id}`, { comments });
            alert('Request returned to manager successfully!');
            await fetchTravelRequests(); // Refresh the list
        } catch (error) {
            console.error('Error returning request to manager:', error.response ? error.response.data : error.message);
            alert('Failed to return request to manager.');
        }
    };

    const handleReturnToEmployee = async (id) => {
        try {
            const comments = 'Returning request to employee for more information';

            await axios.post(`https://localhost:7075/api/TravelAdmin/ReturnToEmployee/${id}`, { comments });
            alert('Request returned to employee successfully!');
            await fetchTravelRequests(); // Refresh the list
        } catch (error) {
            console.error('Error returning request to employee:', error.response ? error.response.data : error.message);
            alert('Failed to return request to employee.');
        }
    };

    const handleCloseRequest = async (id) => {
        try {
            const comments = 'Request completed';

            await axios.post(`https://localhost:7075/api/TravelAdmin/CloseRequest/${id}`, { comments });
            alert('Request closed successfully!');
            await fetchTravelRequests(); // Refresh the list
        } catch (error) {
            console.error('Error closing request:', error.response ? error.response.data : error.message);
            alert('Failed to close request.');
        }
    };

    return (
        <Container>
            <Header style={{color:'rgb(251,113,133)'}}>Travel Admin Dashboard</Header>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <BookingTable>
                    <thead>
                        <tr>
                            <TableHeader>ID</TableHeader>
                            <TableHeader>User Name</TableHeader>
                            <TableHeader>Project Name</TableHeader>
                            <TableHeader>Department Name</TableHeader>
                            <TableHeader>Reason for Travel</TableHeader>
                            <TableHeader>From Date</TableHeader>
                            <TableHeader>To Date</TableHeader>
                            <TableHeader>From Location</TableHeader>
                            <TableHeader>To Location</TableHeader>
                            <TableHeader>Comments</TableHeader>
                            <TableHeader>Ticket URL</TableHeader>
                            <TableHeader>Status</TableHeader>
                            <TableHeader>Actions</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {travelRequests.length > 0 ? (
                            travelRequests.map((request) => (
                                <TableRow key={request.travelRequestId}>
                                    <TableCell>{request.travelRequestId}</TableCell>
                                    <TableCell>{request.user.firstName + " " + request.user.lastName}</TableCell>
                                    <TableCell>{request.project.projectName}</TableCell>
                                    <TableCell>{request.department.departmentName}</TableCell>
                                    <TableCell>{request.reasonForTravel}</TableCell>
                                    <TableCell>{new Date(request.fromDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(request.toDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{request.fromLocation}</TableCell>
                                    <TableCell>{request.toLocation}</TableCell>
                                    <TableCell>{request.comments}</TableCell>
                                    <TableCell>
                                        {request.ticketUrl ? (
                                            <a href={request.ticketUrl} target="_blank" rel="noopener noreferrer">View Ticket</a>
                                        ) : 'N/A'}
                                    </TableCell>
                                    <TableCell>{request.status}</TableCell>
                                    <TableCell>
                                        {request.status === 'Completed' ? (
                                            <span>No actions available</span>
                                        ) : (
                                            <>
                                                {request.status === 'Booked' ? (
                                                    <Button onClick={() => handleCloseRequest(request.travelRequestId)} style={{backgroundColor:'red'}}>Close Request</Button>
                                                ) : (
                                                    <>
                                                        <Button onClick={() => handleBooking(request.travelRequestId)} style={{backgroundColor:'green'}}>Book Ticket</Button>
                                                        <Button onClick={() => handleReturnToManager(request.travelRequestId)} style={{backgroundColor:'royalblue'}}>Return to Manager</Button>
                                                        <Button onClick={() => handleReturnToEmployee(request.travelRequestId)}>Return to Employee</Button>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan="13">No travel requests available.</TableCell>
                            </TableRow>
                        )}
                    </tbody>
                </BookingTable>
            )}
        </Container>
    );
};

export default TravelAdminDashboard;

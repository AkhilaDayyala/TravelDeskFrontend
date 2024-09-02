import styled from 'styled-components';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

// Styled Components
const Container = styled.div`
  padding: 40px;
  background-color: #f8f9fa;
  color: #333;
  min-height: 100vh;
  font-family: 'Roboto', sans-serif; /* Use a modern font */
`;

const Header = styled(motion.h2)`
  font-size: 2.5rem;
  margin-bottom: 30px;
  text-align: center;
  color: #343a40; /* Match header color to table header */
  font-weight: bold; /* Make text bold */
`;

const TaskTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
  padding: 15px;
  text-align: left;
  background-color: #343a40; /* Darker, more sophisticated header color */
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  border-bottom: 1px solid #e9ecef;
`;

const TableRow = styled(motion.tr)`
  &:nth-child(even) {
    background-color: #f8f9fa; /* Softer, more modern even row color */
  }
  &:nth-child(odd) {
    background-color: #fff; /* Odd rows keep white background */
  }
  cursor: pointer;
  &:hover {
    background-color: #e2e6ea; /* Subtle hover effect */
    transform: scale(1.03);
    transition: all 0.3s ease;
  }
`;

const TableCell = styled.td`
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 0.5rem;
  border-radius: 5px;
  background-color: #6c757d; /* Neutral button color */
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease; /* Smooth transitions */
  font-weight: 500;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25); /* Add a focus ring for accessibility */
  }

  &.approve-button {
    background-color: #28a745; /* Green for approve */
  }

  &.approve-button:hover {
    background-color: #218838;
    transform: translateY(-2px); /* Slight lift on hover */
  }

  &.reject-button {
    background-color: #dc3545; /* Red for reject */
  }

  &.reject-button:hover {
    background-color: #c82333;
    transform: translateY(-2px); /* Slight lift on hover */
  }
`;

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ManagerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [managerId, setManagerId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
    if (token) {
      const decodedToken = jwtDecode(token);
      setManagerId(decodedToken.userid);
    }
  }, []);

  useEffect(() => {
    if (managerId) {
      fetchPendingRequests(managerId);
    }
  }, [managerId]);

  const fetchPendingRequests = async (managerId) => {
    try {
      const response = await axios.get(`https://localhost:7075/api/Manager/${managerId}/Requests`);
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const handleApprove = async (travelRequestId) => {
    console.log('Approving request with ID:', travelRequestId);
    try {
      const comments = prompt("Please enter any comments (optional):");
      const response = await axios.put(`https://localhost:7075/api/Manager/ApproveRequest/${travelRequestId}`, 
        { Comments: comments }, // Send as JSON
        {
          headers: {
            'Content-Type': 'application/json', // Set Content-Type to application/json
          },
        }
      );
      console.log('Approve Response:', response);
      alert('Request approved successfully.');
      
      // Update the state to remove the buttons for the approved request
      setRequests(prevRequests => 
        prevRequests.map(request =>
          request.travelRequestId === travelRequestId ? { ...request, status: 'Approved', actionTaken: true } : request
        )
      );
    } catch (error) {
      console.error('Error approving request:', error.response ? error.response.data : error.message);
    }
  };
  
  const handleReject = async (travelRequestId) => {
    console.log('Rejecting request with ID:', travelRequestId);
    try {
      const comments = prompt("Please enter your rejection comments:");
      const response = await axios.put(`https://localhost:7075/api/Manager/RejectRequest/${travelRequestId}`, 
        { Comments: comments }, // Send as JSON
        {
          headers: {
            'Content-Type': 'application/json', // Set Content-Type to application/json
          },
        }
      );
      console.log('Reject Response:', response);
      alert('Request rejected successfully.');
      
      // Update the state to remove the buttons for the rejected request
      setRequests(prevRequests => 
        prevRequests.map(request =>
          request.travelRequestId === travelRequestId ? { ...request, status: 'Rejected', actionTaken: true } : request
        )
      );
    } catch (error) {
      console.error('Error rejecting request:', error.response ? error.response.data : error.message);
    }
  };
  

  return (
    <Container>
      <Header>Pending Travel Requests</Header>
      {requests.length > 0 ? (
        <TaskTable>
          <thead>
            <tr>
              <TableHeader>Travel Request ID</TableHeader>
              <TableHeader>Employee</TableHeader>
              <TableHeader>Project</TableHeader>
              <TableHeader>Reason for Travel</TableHeader>
              <TableHeader>From</TableHeader>
              <TableHeader>To</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <TableRow key={request.travelRequestId} variants={rowVariants} initial="hidden" animate="visible">
                <TableCell>{request.travelRequestId}</TableCell>
                <TableCell>{request.user.firstName} {request.user.lastName}</TableCell>
                <TableCell>{request.project.projectName}</TableCell>
                <TableCell>{request.reasonForTravel}</TableCell>
                <TableCell>{request.fromLocation} on {new Date(request.fromDate).toDateString()}</TableCell>
                <TableCell>{request.toLocation} on {new Date(request.toDate).toDateString()}</TableCell>
                <TableCell>{request.status}</TableCell>
                <TableCell>
                  {!request.actionTaken && (
                           <>
                      <Button className="approve-button" onClick={() => handleApprove(request.travelRequestId)}>Approve</Button>
                      <Button className="reject-button" onClick={() => handleReject(request.travelRequestId)}>Reject</Button>
                           </>
                       )}
                 </TableCell>

              </TableRow>
            ))}
          </tbody>
        </TaskTable>
      ) : (
        <p>No pending requests found.</p>
      )}
    </Container>
  );
};

export default ManagerRequests;

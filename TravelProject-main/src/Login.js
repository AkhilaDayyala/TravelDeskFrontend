import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Correct import
import styled from 'styled-components';
import './Login.css';
import AboutTravelApp from './AboutTravelApp'; // Import the new component

// Styled Components
const MainContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const AboutContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f4f4; /* Light gray background */
`;

const LoginWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 400px;
  width: 100%;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-top: 0.5rem;
  font-size: 1rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: rgb(251, 113, 133); /* Button background color */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  &:hover {
    background-color: #549be7; /* Hover background color */
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin-top: 1rem;
`;

const Login = () => {
    const [formData, setFormData] = useState({ Email: '', Password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://localhost:7075/api/Login', formData);
            if (response.status === 200) {
                const { token } = response.data; // Extract token from response
                localStorage.setItem('token', token); // Store the token in local storage

                // Decode the token using jwt-decode
                const decodedToken = jwtDecode(token);
                console.log('Decoded Token:', decodedToken);

                const id = decodedToken.userid;
                const roleId = decodedToken.roleId; 
                
                // Navigate based on roleId
                switch(roleId) {
                    case '4':
                        navigate('/dashboard/employee');
                        break;
                    case '3':
                        navigate('/dashboard/manager');
                        break;
                    case '2':
                        navigate('/dashboard/travel-admin');
                        break;
                    case '1':
                        navigate('/dashboard/admin');
                        break;
                    default:
                        setMessage('Access restricted');
                }
            }
        } catch (error) {
            console.error(error);
            setMessage('Login failed');
        }
    };

    return (
        <MainContainer>
            <AboutContainer>
                <AboutTravelApp /> {/* Include the AboutTravelApp component */}
            </AboutContainer>
            <LoginWrapper>
                <Card>
                    <Title>Login Page</Title>
                    <InputGroup>
                        <Label htmlFor="Email">
                            <i className="fas fa-envelope"></i> Email
                        </Label>
                        <Input
                            type="email"
                            name="Email"
                            id="Email"
                            value={formData.Email}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>
                    <InputGroup>
                        <Label htmlFor="Password">
                            <i className="fas fa-lock"></i> Password
                        </Label>
                        <Input
                            type="password"
                            name="Password"
                            id="Password"
                            value={formData.Password}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>
                    <Button onClick={handleSubmit} style={{backgroundColor:"black"}}>Login</Button>
                    {message && <ErrorMessage>{message}</ErrorMessage>}
                </Card>
            </LoginWrapper>
        </MainContainer>
    );
};

export default Login;

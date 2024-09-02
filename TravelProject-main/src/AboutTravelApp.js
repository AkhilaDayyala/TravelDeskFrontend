import React from 'react';
import styled from 'styled-components';

// Styled Components
const AboutContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const AboutText = styled.div`
  flex: 1;
  font-size: 1rem;
  color: #333;
  margin-left: 1rem;
`;

const AboutImage = styled.img`
  width: 100px;
  height: auto;
  border-radius: 8px;
`;

const AboutTravelApp = () => {
  return (
    <AboutContainer>
      <img 
        src="/assets/42938.jpg" 
        alt="Travel Application" 
        style={{
          width: '100px',
          height: 'auto',
          borderRadius: '8px'
        }} 
      />
      <AboutText>
        <h2>Explore Your Next Adventure</h2>
        <p>
          Our travel application makes planning your next trip seamless and exciting. 
          Discover new destinations, manage bookings, and enjoy a hassle-free travel experience. 
          From flight bookings to travel management, we’ve got you covered!
        </p>
      </AboutText>
    </AboutContainer>
  );
};

export default AboutTravelApp;

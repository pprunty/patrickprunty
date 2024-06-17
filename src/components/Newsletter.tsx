import { useState } from 'react';
import styled from 'styled-components';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

   const handleSubmit = async (event) => {
        event.preventDefault();
        if (!email.trim()) {
          setMessage('Email cannot be empty.');
          return;
        }

        setLoading(true);
        setMessage('');

        const scriptUrl = "https://script.google.com/macros/s/AKfycbxYXBP_GiOutJgd6hSkO2_PGXOrRNd7yQV066B7Sq3iOCE7nKFgO-mr7gQwy9BhKZNI/exec";

        try {
          const response = await fetch(scriptUrl, {
            method: "POST",
            mode: 'no-cors', // Important as Apps Script does not support CORS
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email
            })
          });

          // Since 'no-cors' mode is used, the response is opaque and we cannot read its contents.
          // We'll assume the subscription is successful if no error is thrown.
          setMessage('Thank you for subscribing!');
        } catch (error) {
          console.error('There was an error:', error);
          setMessage('Something went wrong. Please try again.');
        } finally {
          setLoading(false);
        }
      };

  return (
    <SubscribeContainer>
      <SubscribeTitle>Patrick Prunty's Newsletter</SubscribeTitle>
      <SubscribeSubtitle>Stay up to date with my latest blog posts!</SubscribeSubtitle>
      <Form id="subscribe-form" onSubmit={handleSubmit}>
        <SubscribeInputContainer>
          <SubscribeInput
            type="email"
            placeholder="Type your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <SubscribeButton type="submit" disabled={loading}>
            <ButtonText>{loading ? 'Loading...' : 'Subscribe'}</ButtonText>
          </SubscribeButton>
        </SubscribeInputContainer>
      </Form>
      {message && <Message className={message.includes('Thank you') ? 'success-message' : 'error-message'}>{message}</Message>}
    </SubscribeContainer>
  );
};

// Styled Components
const SubscribeContainer = styled.div`
  text-align: center;
  margin-top: 3.5em;
  margin-bottom: 3.5em;
  padding-left: 10px;
  padding-right: 10px;

  @media (min-width: 768px) {
    padding-left: 0;
    padding-right: 0;
  }
`;

const SubscribeTitle = styled.div`
  font-weight: 550;
  margin-bottom: 10px;
  font-size: 24px;
`;

const SubscribeSubtitle = styled.div`
  font-size: 16px;
  margin-bottom: 30px;
`;

const Form = styled.form`
  width: 100%;
`;

const SubscribeInputContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const SubscribeInput = styled.input`
  border: 1px solid #333;
  min-width: 280px;
  height: 50px;
  border: 1px solid #333;
  border-radius: 0px !important;
  font-size: 16px;
  border-right: none !important;
  background-color: #f0f0f0;
  padding-left: 10px;
  outline: none;
  box-sizing: border-box;

  @media (max-width: 768px) {
    min-width: 200px;
  }

//   &:disabled {
//     background-color: #f0f0f0;
//   }
`;

const SubscribeButton = styled.button`
  height: 50px;
  border-radius: 0px !important;
  padding: 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #f0f0f0;
  border: 1px solid #333;
  font-weight: 600;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: background-color 0.2s ease-in-out;

  &:hover, &:active {
     background-color: #333;
     color: #F0F0F0;
  }
  &:disabled {
    cursor: not-allowed;
  }
`;

const ButtonText = styled.div`
  text-align: center;
  align-self: center;
`;

const Message = styled.div`
  margin-top: 30px;
  font-size: 14px;

  &.success-message {
    color: #333;
  }

  &.error-message {
    color: #FF0000;
  }
`;

export default Newsletter;

import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import axios from 'axios';
import { API_URL } from './apiURL';
import Modal from './Modal';

function App() {
  const [count, setCount] = useState(0);
  const [garbage, setGarbage] = useState(0);
  const [formValues, setFormValues] = useState({
    typeOfPayment: 1,
    amount: '',
    oldbalanceOrg: '',
    newbalanceOrg: '',
  });
  const [message, setMessage] = useState('');

  const types = [
    { name: 'CASH_OUT', value: 1 },
    { name: 'PAYMENT', value: 2 },
    { name: 'CASH_IN', value: 3 },
    { name: 'TRANSFER', value: 4 },
    { name: 'DEBIT', value: 5 },
  ];

  useEffect(() => {
    const response = axios.get(API_URL).then((res) => setGarbage(1));
  }, []);

  const onInputChange = (event: any, key: string) => {
    setMessage('');
    setFormValues({ ...formValues, [key]: event.target.value });
  };

  const predict = async () => {
    if (
      !formValues.amount ||
      !formValues.oldbalanceOrg ||
      !formValues.newbalanceOrg
    ) {
      setMessage('Please fill all the fields');
      return;
    }
    const response = await axios.post(API_URL, {
      typeOfPayment: formValues.typeOfPayment,
      amount: formValues.amount,
      oldbalanceOrg: formValues.oldbalanceOrg,
      newbalanceOrg: formValues.newbalanceOrg,
    });
    if (response.data.isFraud) {
      setMessage('Fraud');
    } else {
      setMessage('Not Fraud');
    }
  };

  return (
    <div className="App">
      <h1>Online Payment Fraud Prediction</h1>
      <div className="card">
        <p className="mt-4">Payment Type</p>
        <select
          value={formValues.typeOfPayment}
          onChange={(event) => {
            onInputChange(event, 'typeOfPayment');
          }}
          className="p-5 py-2 mb-6"
        >
          {types.map((type) => (
            <option key={type.name} value={type.value}>
              {type.name}
            </option>
          ))}
        </select>
        <p className="mt-4">Amount</p>
        <input
          type="number"
          value={formValues.amount}
          onChange={(event) => onInputChange(event, 'amount')}
          className="p-5 py-2 mb-6"
        />
        <p className="mt-4">Old Balance</p>
        <input
          type="number"
          value={formValues.oldbalanceOrg}
          onChange={(event) => onInputChange(event, 'oldbalanceOrg')}
          className="p-5 py-2 mb-6"
        />
        <p className="mt-4">New Balance</p>
        <input
          type="number"
          value={formValues.newbalanceOrg}
          onChange={(event) => onInputChange(event, 'newbalanceOrg')}
          className="p-5 py-2 "
        />
      </div>
      <Modal message={message} predict={predict} />
      <p className="read-the-docs mt-8">
        Created by{' '}
        <span>
          <a target="_blank" href="https://subigyalamichhane.com.np">
            Subigya Lamichhane
          </a>
        </span>
      </p>
      <p className="hidden">{garbage}</p>
    </div>
  );
}

export default App;

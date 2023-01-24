import axios from 'axios';
import { API_URL } from '../constants/apiURL';

export const predictFraudOrNot = async (formValues: any) => {
  //pre-fetch
  await axios.get(API_URL);
  const response = await axios.post(API_URL, {
    typeOfPayment: formValues.typeOfPayment,
    amount: formValues.amount,
    oldbalanceOrg: formValues.oldbalanceOrg,
    newbalanceOrg: formValues.newbalanceOrg,
  });
  return response.data.isFraud;
};

//@ts-nocheck
import React from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { Table } from 'antd';
import * as XLSX from 'xlsx';
import TableWithFilter from './TableWithFilter';
import { predictFraudOrNot } from '../utils/predictFraudOrNot';
import { FileUploader } from 'react-drag-drop-files';
import { UploadComponent } from './uploadComponent';

const columns = [
  {
    title: 'S No.',
    dataIndex: 'S No.',
    search: true,
    width: '20%',
    key: 'S No.',
  },
  {
    title: 'Payment Type',
    dataIndex: 'Payment Type',
    search: true,
    width: '30%',
    key: 'Payment Type',
  },
  {
    title: 'Amount',
    dataIndex: 'Amount',
    search: true,
    width: '30%',
    key: 'Amount',
  },
  {
    title: 'Old Balance',
    dataIndex: 'Old Balance',
    search: true,
    width: '30%',
    key: 'Old Balance',
  },
  {
    title: 'New Balance',
    dataIndex: 'New Balance',
    search: true,
    width: '30%',
    key: 'New Balance',
  },
  {
    title: 'Is Fraud',
    dataIndex: 'Is Fraud',
    width: '30%',
    key: 'Is Fraud',
  },
];

export default function Modal({ setData, data, types }) {
  const [showModal, setShowModal] = React.useState(false);
  let defaultValues = {};

  const [formValues, setFormValues] = React.useState(defaultValues);
  const [headerText, setHeaderText] = React.useState('Upload Excel File');
  const [loading, setLoading] = React.useState(false);

  const parseJson = async (json) => {
    let parsedJson = [];
    for (let i = 0; i < json.length; i++) {
      const response = await predictFraudOrNot({
        typeOfPayment: types.find((type) => type.name === item['Payment Type'])
          .value,
        amount: item['Amount'],
        oldbalanceOrg: item['Old Balance'],
        newbalanceOrg: item['New Balance'],
      });
      console.log(response, parsedJson);
      parsedJson.push({
        ...item,
        key: index,
        'Is Fraud': response.toString(),
        'S No.': index + 1,
      });
    }

    return parsedJson;
  };

  const onFileChange = async (file) => {
    // const file = e.target.files[0];
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const bufferArray = e.target.result;
      const data = new Uint8Array(bufferArray);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      let parsedJson = [];
      for (let i = 0; i < json.length; i++) {
        const item = json[i];

        const response = await predictFraudOrNot({
          typeOfPayment: types.find(
            (type) => type.name === item['Payment Type']
          ).value,
          amount: item['Amount'],
          oldbalanceOrg: item['Old Balance'],
          newbalanceOrg: item['New Balance'],
        });
        parsedJson.push({
          ...item,
          key: i,
          'Is Fraud': response.toString(),
          'S No.': i + 1,
        });
      }

      // console.log(newJ);
      setHeaderText('Select Recipients');
      setData(parsedJson);
      setLoading(false);
    };
    reader.readAsArrayBuffer(file);
  };

  const renderExcelTable = () => {
    // if (recipients.length === 0) return <div></div>;
    return (
      <div className="h-80 overflow-auto">
        <TableWithFilter columns={columns} data={data} />
      </div>
    );
  };

  const renderBody = () => {
    if (loading) {
      return (
        <div role="status" className="flex justify-center items-center p-10">
          <svg
            aria-hidden="true"
            className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      );
    }
    if (headerText === 'Select Recipients') {
      return renderExcelTable();
    }
    return (
      <div className="h-60 overflow-auto p-20">
        {/* <input
          type="file"
          onClick={(e) => {
            e.target.value = null;
          }}
          onChange={(e) => onFileChange(e)}
        /> */}
        <div className="scale-125">
          <FileUploader
            label="Drag and Drop or Click to Upload"
            className="h-40"
            handleChange={onFileChange}
            name="file"
            types={['XLSX']}
          />
        </div>
        {/* <UploadComponent handleFiles={onFileChange} /> */}
      </div>
    );
  };

  return (
    <>
      <button
        className="bg-green-700 ml-2"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Upload Excel
      </button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl text-gray-600 font-semibold">
                    {headerText}
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                {renderBody()}
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-green-700"
                    type="button"
                    onClick={() => {
                      setHeaderText('Upload Excel File');
                    }}
                  >
                    Select Another File
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}

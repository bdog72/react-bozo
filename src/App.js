//
//
import React, { useState, useEffect } from 'react';
import './App.css';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import Alert from './components/Alert';

import uuid from 'uuid/v4';
// import { MdHdrStrong } from 'react-icons/md';

// localStorage.setItem('')
// localStorage.getItem('')

// const initialExpenses = [];

// const initialExpenses = [
//   { id: uuid(), charge: 'rent', amount: 1600 },
//   { id: uuid(), charge: 'car payment', amount: 400 },
//   { id: uuid(), charge: 'credit card bill', amount: 1200 }
// ];

const initialExpenses = localStorage.getItem('expenses')
  ? JSON.parse(localStorage.getItem('expenses'))
  : [];

function App() {
  // ********** state values **********

  // all expenses, add expense
  const [expenses, setExpenses] = useState(initialExpenses);

  // single expense
  const [charge, setCharge] = useState('');

  // single amount
  const [amount, setAmount] = useState('');

  // alert
  const [alert, setAlert] = useState({ show: false });

  // edit
  const [edit, setEdit] = useState(false);

  // edit item
  const [id, setId] = useState(0);

  // ********** useEffect **********
  // useEffect(() => console.log('We called useEffect method bozo'));

  useEffect(() => {
    console.log('We called useEffect method');
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  // ********** functionality **********

  // handle charge
  const handleCharge = e => {
    setCharge(e.target.value);
  };

  // handle amount
  const handleAmount = e => {
    setAmount(e.target.value);
  };

  // handle alert
  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text });
    setTimeout(() => {
      setAlert({ show: false });
    }, 4000);
  };

  // handle submit
  const handleSubmit = e => {
    e.preventDefault();
    if (charge !== '' && amount > 0) {
      if (edit) {
        let tempExpenses = expenses.map(item => {
          return item.id === id ? { ...item, charge, amount } : item;
        });
        setExpenses(tempExpenses);
        setEdit(false);
        handleAlert({ type: 'success', text: 'item edited' });
      } else {
        const singleExpense = { id: uuid(), charge, amount };
        setExpenses([...expenses, singleExpense]);
        handleAlert({ type: 'success', text: 'item added' });
      }

      setCharge('');
      setAmount('');
    } else {
      // handle alert called
      handleAlert({ type: 'danger', text: 'You must enter valid values' });
    }
  };

  // clear all items
  const clearItems = () => {
    handleAlert({ type: 'danger', text: 'all items deleted' });
    setExpenses([]);
  };

  // handle delete
  const handleDelete = id => {
    let tempExpenses = expenses.filter(item => {
      return item.id !== id;
    });
    setExpenses(tempExpenses);
    // console.log(tempExpenses);
    handleAlert({ type: 'danger', text: 'item deleted' });
  };

  // handle edit
  const handleEdit = id => {
    let expense = expenses.find(item => {
      return item.id === id;
    });
    let { charge, amount } = expense;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
  };

  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}
      {/* <Alert /> */}
      <h1>Budget Calculator</h1>
      <main className="App">
        <ExpenseForm
          charge={charge}
          amount={amount}
          handleCharge={handleCharge}
          handleAmount={handleAmount}
          handleSubmit={handleSubmit}
          edit={edit}
        />
        <ExpenseList
          expenses={expenses}
          clearItems={clearItems}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      </main>
      <h1>
        total spending :{' '}
        <span className="total">
          ${' '}
          {expenses.reduce((acc, curr) => {
            return (acc += parseInt(curr.amount));
          }, 0)}
        </span>
      </h1>
    </>
  );
}

export default App;

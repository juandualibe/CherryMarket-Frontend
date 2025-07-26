// frontend/src/Calculator.js
import React, { useState, useEffect } from 'react';
import { Paper, Grid, Button, Typography, Box } from '@mui/material';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [currentNumber, setCurrentNumber] = useState('');
  const [operator, setOperator] = useState(null);
  const [previousNumber, setPreviousNumber] = useState(null);

  const handleNumber = (num) => {
    if (display === '0' && num !== '.') {
      setDisplay(num);
      setCurrentNumber(num);
    } else {
      setDisplay(display + num);
      setCurrentNumber(currentNumber + num);
    }
  };

  const handleOperator = (op) => {
    if (currentNumber === '') return;
    setPreviousNumber(parseFloat(currentNumber));
    setOperator(op);
    setDisplay(display + ' ' + op + ' ');
    setCurrentNumber('');
  };

  const handleClear = () => {
    setDisplay('0');
    setCurrentNumber('');
    setOperator(null);
    setPreviousNumber(null);
  };

  const handleBackspace = () => {
    if (currentNumber === '') return;
    const newCurrent = currentNumber.slice(0, -1);
    setCurrentNumber(newCurrent);
    setDisplay(newCurrent || '0');
  };

  const handlePercentage = () => {
    if (currentNumber === '' || !previousNumber || !operator) return;
    const num2 = parseFloat(currentNumber);
    const percentage = (previousNumber * num2) / 100;
    setCurrentNumber(percentage.toString());
    setDisplay(previousNumber + ' ' + operator + ' ' + percentage);
  };

  const handleCalculate = () => {
    if (!previousNumber || !operator || currentNumber === '') return;
    const num1 = previousNumber;
    const num2 = parseFloat(currentNumber);
    let result;

    switch (operator) {
      case '+':
        result = num1 + num2;
        break;
      case '-':
        result = num1 - num2;
        break;
      case '*':
        result = num1 * num2;
        break;
      case '/':
        result = num2 !== 0 ? num1 / num2 : 'Error';
        break;
      default:
        return;
    }

    setDisplay(result.toString());
    setCurrentNumber(result.toString());
    setOperator(null);
    setPreviousNumber(null);
  };

  // Manejo de teclado
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;
      if (/[0-9.]/.test(key)) {
        handleNumber(key);
      } else if (['+', '-', '*', '/'].includes(key)) {
        handleOperator(key);
      } else if (key === '%') {
        handlePercentage();
      } else if (key === 'Enter') {
        handleCalculate();
      } else if (key === 'Backspace') {
        handleBackspace();
      } else if (key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentNumber, operator, previousNumber]);

  const buttons = [
    { label: 'C', action: handleClear, color: 'error' },
    { label: '⌫', action: handleBackspace, color: 'secondary' },
    { label: '%', action: handlePercentage },
    { label: '7', action: () => handleNumber('7') },
    { label: '8', action: () => handleNumber('8') },
    { label: '9', action: () => handleNumber('9') },
    { label: '4', action: () => handleNumber('4') },
    { label: '5', action: () => handleNumber('5') },
    { label: '6', action: () => handleNumber('6') },
    { label: '1', action: () => handleNumber('1') },
    { label: '2', action: () => handleNumber('2') },
    { label: '3', action: () => handleNumber('3') },
    { label: '0', action: () => handleNumber('0'), span: 2 },
    { label: '.', action: () => handleNumber('.') },
    { label: '=', action: handleCalculate, color: 'success' },
    { label: '/', action: () => handleOperator('/') },
    { label: '*', action: () => handleOperator('*') },
    { label: '-', action: () => handleOperator('-') },
    { label: '+', action: () => handleOperator('+') },
  ];

  return (
    <Paper elevation={3} sx={{ p: 2, maxWidth: 300 }}>
      <Typography variant="h6" gutterBottom>
        Calculadora
      </Typography>
      <Box sx={{ mb: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1, textAlign: 'right' }}>
        <Typography variant="h5">{display}</Typography>
      </Box>
      <Grid container spacing={1}>
        {buttons.map((button, index) => (
          <Grid item xs={button.span || 4} key={index}>
            <Button
              variant="contained"
              color={button.color || 'primary'}
              fullWidth
              onClick={button.action}
              sx={{ fontSize: '1.2rem', height: 50 }}
            >
              {button.label}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default Calculator;
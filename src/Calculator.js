// frontend/src/Calculator.js
import React, { useState, useEffect, useRef } from 'react';
import { Paper, Grid, Button, Typography, Box, TextField } from '@mui/material';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [currentNumber, setCurrentNumber] = useState('');
  const [operator, setOperator] = useState(null);
  const [previousNumber, setPreviousNumber] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleNumber = (num) => {
    if (display === '0' && num !== '.') {
      setDisplay(num);
      setCurrentNumber(num);
    } else {
      setDisplay(display + num);
      setCurrentNumber(currentNumber + num);
    }
    inputRef.current?.focus(); // Mantiene el foco en el TextField tras usar botones
  };

  const handleOperator = (op) => {
    if (currentNumber === '') return;
    setPreviousNumber(parseFloat(currentNumber));
    setOperator(op);
    setDisplay(display + ' ' + op + ' ');
    setCurrentNumber('');
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setDisplay('0');
    setCurrentNumber('');
    setOperator(null);
    setPreviousNumber(null);
    inputRef.current?.focus();
  };

  const handleBackspace = () => {
    if (currentNumber === '') return;
    const newCurrent = currentNumber.slice(0, -1);
    setCurrentNumber(newCurrent);
    setDisplay(newCurrent || '0');
    inputRef.current?.focus();
  };

  const handlePercentage = () => {
    if (currentNumber === '' || !previousNumber || !operator) return;
    const num2 = parseFloat(currentNumber);
    const percentage = (previousNumber * num2) / 100;
    setCurrentNumber(percentage.toString());
    setDisplay(previousNumber + ' ' + operator + ' ' + percentage);
    inputRef.current?.focus();
  };

  const handleToggleSign = () => {
    if (currentNumber === '') return;
    const newNumber = (parseFloat(currentNumber) * -1).toString();
    setCurrentNumber(newNumber);
    if (operator && previousNumber) {
      setDisplay(previousNumber + ' ' + operator + ' ' + newNumber);
    } else {
      setDisplay(newNumber);
    }
    inputRef.current?.focus();
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
    inputRef.current?.focus();
  };

  // Manejo de teclado
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isFocused) return; // Solo procesa teclas si el TextField está enfocado
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
      } else if (key === 'n' || key === 'N') {
        handleToggleSign();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentNumber, operator, previousNumber, isFocused]);

  const buttons = [
    { label: 'C', action: handleClear, color: 'error' },
    { label: '⌫', action: handleBackspace, color: 'secondary' },
    { label: '%', action: handlePercentage },
    { label: '+/-', action: handleToggleSign },
    { label: '7', action: () => handleNumber('7') },
    { label: '8', action: () => handleNumber('8') },
    { label: '9', action: () => handleNumber('9') },
    { label: '/', action: () => handleOperator('/') },
    { label: '4', action: () => handleNumber('4') },
    { label: '5', action: () => handleNumber('5') },
    { label: '6', action: () => handleNumber('6') },
    { label: '*', action: () => handleOperator('*') },
    { label: '1', action: () => handleNumber('1') },
    { label: '2', action: () => handleNumber('2') },
    { label: '3', action: () => handleNumber('3') },
    { label: '-', action: () => handleOperator('-') },
    { label: '0', action: () => handleNumber('0'), span: 2 },
    { label: '.', action: () => handleNumber('.') },
    { label: '=', action: handleCalculate, color: 'success' },
    { label: '+', action: () => handleOperator('+') }        
  ];

  return (
    <Paper elevation={3} sx={{ p: 2, maxWidth: 400 }}>
      <Typography variant="h6" gutterBottom>
        Calculadora
      </Typography>
      <Box sx={{ mb: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1, textAlign: 'right' }}>
        <TextField
          inputRef={inputRef}
          value={display}
          fullWidth
          variant="outlined"
          InputProps={{ readOnly: true }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          sx={{ input: { textAlign: 'right', fontSize: '1.5rem' } }}
        />
      </Box>
      <Grid container spacing={1}>
        {buttons.map((button, index) => (
          <Grid item xs={button.span || 3} key={index}>
            <Button
              variant="contained"
              color={button.color || 'primary'}
              fullWidth
              onClick={button.action}
              sx={{ fontSize: '1.2rem', height: 50 }}
              disabled={button.disabled || false}
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
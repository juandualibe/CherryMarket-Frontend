// frontend/src/components/ui/Calculator.js
import React, { useState, useEffect, useRef } from 'react'; // Importa React y hooks para estado, efectos y referencias
import {
  Paper, // Contenedor tipo tarjeta para la calculadora
  Grid, // Sistema de grilla para los botones
  Button, // Botones interactivos
  Typography, // Texto estilizado para el título
  Box, // Contenedor flexible
  TextField, // Campo de texto para la pantalla
} from '@mui/material'; // Componentes de Material-UI

// Componente Calculator: Implementa una calculadora básica con operaciones aritméticas
const Calculator = () => {
  // Estado para la pantalla de la calculadora
  const [display, setDisplay] = useState('0');
  // Estado para el número actual que se está ingresando
  const [currentNumber, setCurrentNumber] = useState('');
  // Estado para el operador seleccionado (+, -, *, /)
  const [operator, setOperator] = useState(null);
  // Estado para el número previo (primer operando)
  const [previousNumber, setPreviousNumber] = useState(null);
  // Estado para indicar si el campo de texto está enfocado
  const [isFocused, setIsFocused] = useState(false);
  // Referencia para el campo de texto de la pantalla
  const inputRef = useRef(null);

  // Maneja la entrada de números y el punto decimal
  const handleNumber = (num) => {
    if (display === '0' && num !== '.') {
      // Reemplaza el 0 inicial con el número ingresado
      setDisplay(num);
      setCurrentNumber(num);
    } else {
      // Añade el número al display y al número actual
      setDisplay(display + num);
      setCurrentNumber(currentNumber + num);
    }
    inputRef.current?.focus(); // Mantiene el foco en el campo de texto
  };

  // Maneja la selección de un operador
  const handleOperator = (op) => {
    if (currentNumber === '') return; // No hace nada si no hay número actual
    setPreviousNumber(parseFloat(currentNumber)); // Guarda el número actual como previo
    setOperator(op); // Establece el operador
    setDisplay(display + ' ' + op + ' '); // Actualiza el display
    setCurrentNumber(''); // Limpia el número actual
    inputRef.current?.focus();
  };

  // Limpia todos los estados de la calculadora
  const handleClear = () => {
    setDisplay('0');
    setCurrentNumber('');
    setOperator(null);
    setPreviousNumber(null);
    inputRef.current?.focus();
  };

  // Elimina el último carácter del número actual
  const handleBackspace = () => {
    if (currentNumber === '') return; // No hace nada si no hay número actual
    const newCurrent = currentNumber.slice(0, -1); // Elimina el último carácter
    setCurrentNumber(newCurrent);
    setDisplay(newCurrent || '0'); // Actualiza el display
    inputRef.current?.focus();
  };

  // Calcula un porcentaje basado en el número previo y el actual
  const handlePercentage = () => {
    if (currentNumber === '' || !previousNumber || !operator) return; // Requiere ambos números y operador
    const num2 = parseFloat(currentNumber);
    const percentage = (previousNumber * num2) / 100; // Calcula el porcentaje
    setCurrentNumber(percentage.toString());
    setDisplay(previousNumber + ' ' + operator + ' ' + percentage); // Actualiza el display
    inputRef.current?.focus();
  };

  // Cambia el signo del número actual
  const handleToggleSign = () => {
    if (currentNumber === '') return; // No hace nada si no hay número actual
    const newNumber = (parseFloat(currentNumber) * -1).toString(); // Cambia el signo
    setCurrentNumber(newNumber);
    if (operator && previousNumber) {
      // Actualiza el display con el operador y el nuevo número
      setDisplay(previousNumber + ' ' + operator + ' ' + newNumber);
    } else {
      setDisplay(newNumber); // Actualiza solo el número
    }
    inputRef.current?.focus();
  };

  // Realiza el cálculo basado en el operador
  const handleCalculate = () => {
    if (!previousNumber || !operator || currentNumber === '') return; // Requiere ambos números y operador
    const num1 = previousNumber;
    const num2 = parseFloat(currentNumber);
    let result;

    // Realiza la operación según el operador
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
        result = num2 !== 0 ? num1 / num2 : 'Error'; // Evita división por cero
        break;
      default:
        return;
    }

    setDisplay(result.toString()); // Muestra el resultado
    setCurrentNumber(result.toString()); // Guarda el resultado como número actual
    setOperator(null); // Limpia el operador
    setPreviousNumber(null); // Limpia el número previo
    inputRef.current?.focus();
  };

  // Maneja la entrada por teclado
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isFocused) return; // Solo procesa teclas si el campo está enfocado
      const { key } = event;
      if (/[0-9.]/.test(key)) {
        handleNumber(key); // Números y punto
      } else if (['+', '-', '*', '/'].includes(key)) {
        handleOperator(key); // Operadores
      } else if (key === '%') {
        handlePercentage(); // Porcentaje
      } else if (key === 'Enter') {
        handleCalculate(); // Cálculo
      } else if (key === 'Backspace') {
        handleBackspace(); // Borrar
      } else if (key === 'Escape') {
        handleClear(); // Limpiar
      } else if (key === 'n' || key === 'N') {
        handleToggleSign(); // Cambiar signo
      }
    };

    window.addEventListener('keydown', handleKeyDown); // Añade el listener de teclado
    return () => window.removeEventListener('keydown', handleKeyDown); // Limpia el listener al desmontar
  }, [currentNumber, operator, previousNumber, isFocused]); // Dependencias del efecto

  // Define los botones de la calculadora
  const buttons = [
    { label: 'C', action: handleClear, color: 'error' }, // Limpiar
    { label: '⌫', action: handleBackspace, color: 'secondary' }, // Borrar
    { label: '%', action: handlePercentage }, // Porcentaje
    { label: '+/-', action: handleToggleSign }, // Cambiar signo
    { label: '7', action: () => handleNumber('7') }, // Números
    { label: '8', action: () => handleNumber('8') },
    { label: '9', action: () => handleNumber('9') },
    { label: '/', action: () => handleOperator('/') }, // Operadores
    { label: '4', action: () => handleNumber('4') },
    { label: '5', action: () => handleNumber('5') },
    { label: '6', action: () => handleNumber('6') },
    { label: '*', action: () => handleOperator('*') },
    { label: '1', action: () => handleNumber('1') },
    { label: '2', action: () => handleNumber('2') },
    { label: '3', action: () => handleNumber('3') },
    { label: '-', action: () => handleOperator('-') },
    { label: '0', action: () => handleNumber('0'), span: 2 }, // Cero ocupa dos columnas
    { label: '.', action: () => handleNumber('.') }, // Punto decimal
    { label: '=', action: handleCalculate, color: 'success' }, // Calcular
    { label: '+', action: () => handleOperator('+') },
  ];

  return (
    <Paper elevation={3} sx={{ p: 2, maxWidth: 400 }}> {/* Contenedor de la calculadora */}
      {/* Título */}
      <Typography variant="h6" gutterBottom>
        Calculadora
      </Typography>
      {/* Pantalla de la calculadora */}
      <Box sx={{ mb: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1, textAlign: 'right' }}>
        <TextField
          inputRef={inputRef}
          value={display}
          fullWidth
          variant="outlined"
          InputProps={{ readOnly: true }} // Solo lectura
          onFocus={() => setIsFocused(true)} // Activa el foco
          onBlur={() => setIsFocused(false)} // Desactiva el foco
          sx={{ input: { textAlign: 'right', fontSize: '1.5rem' } }} // Estilo de la pantalla
        />
      </Box>
      {/* Botones de la calculadora */}
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
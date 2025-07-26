// frontend/src/components/sales/ShoppingCart.js
import React, { useState } from 'react'; // Importa React y hook para estado
import {
  Paper, // Contenedor tipo tarjeta para el carrito
  Table, // Tabla para estructurar los ítems
  TableBody, // Cuerpo de la tabla
  TableCell, // Celdas de la tabla
  TableContainer, // Contenedor para la tabla
  TableHead, // Encabezado de la tabla
  TableRow, // Filas de la tabla
  IconButton, // Botones con íconos (+, -, tacho)
  Typography, // Textos estilizados
  Button, // Botones de acción
  Box, // Contenedor flexible
  Divider, // Separador visual
  Dialog, // Diálogo para ítems manuales
  DialogTitle, // Título del diálogo
  DialogContent, // Contenido del diálogo
  DialogActions, // Botones del diálogo
  TextField, // Campos de texto
} from '@mui/material'; // Componentes de Material-UI
import AddIcon from '@mui/icons-material/Add'; // Ícono para sumar cantidad
import RemoveIcon from '@mui/icons-material/Remove'; // Ícono para restar cantidad
import DeleteIcon from '@mui/icons-material/Delete'; // Ícono para eliminar ítem
import { toast } from 'react-toastify'; // Notificaciones para el usuario

// Componente ShoppingCart: Muestra y gestiona el carrito de compras
// Props:
// - cart: Array de ítems en el carrito
// - onQuantityChange: Función para cambiar la cantidad de un ítem
// - onRemoveItem: Función para eliminar un ítem
// - onFinalizeSale: Función para finalizar la venta
const ShoppingCart = ({ cart, onQuantityChange, onRemoveItem, onFinalizeSale }) => {
  // Estado para controlar el diálogo de ítems manuales
  const [openManualItemDialog, setOpenManualItemDialog] = useState(false);
  // Estado para los datos del ítem manual
  const [manualItem, setManualItem] = useState({
    name: '',
    price: '',
    quantity: 1,
  });

  // Calcula el total del carrito
  const total = cart.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  // Maneja cambios en el formulario de ítem manual
  const handleManualItemChange = (e) => {
    const { name, value } = e.target;
    setManualItem((prev) => ({ ...prev, [name]: value }));
  };

  // Añade un ítem manual al carrito
  const handleAddManualItem = () => {
    const { name, price, quantity } = manualItem;
    // Valida los datos del formulario
    if (!name || !price || price <= 0 || quantity <= 0) {
      toast.error('Por favor, completa el nombre, precio y cantidad válidos.');
      return;
    }
    // Añade el ítem al carrito con un ID único
    onQuantityChange(
      `manual_${Date.now()}`, // ID único para ítems manuales
      parseInt(quantity),
      { name, price: parseFloat(price), quantity: 0, isManual: true }
    );
    // Limpia el formulario y cierra el diálogo
    setManualItem({ name: '', price: '', quantity: 1 });
    setOpenManualItemDialog(false);
    toast.success('Ítem manual añadido al carrito.');
  };

  // Abre el diálogo de ítems manuales
  const handleOpenManualItemDialog = () => setOpenManualItemDialog(true);
  // Cierra el diálogo y limpia el formulario
  const handleCloseManualItemDialog = () => {
    setManualItem({ name: '', price: '', quantity: 1 });
    setOpenManualItemDialog(false);
  };

  // Vacía el carrito tras confirmación
  const handleClearCart = () => {
    if (window.confirm('¿Seguro que quieres vaciar el carrito?')) {
      cart.forEach((item) => onRemoveItem(item.id));
      toast.info('Carrito vaciado.');
    }
  };

  return (
    <Paper
      sx={{
        p: 2, // Padding interno
        height: '100%', // Ocupa toda la altura
        display: 'flex',
        flexDirection: 'column', // Organiza el contenido verticalmente
      }}
    >
      {/* Título del carrito */}
      <Typography variant="h5" gutterBottom>
        Carrito de Compras
      </Typography>
      {/* Botones para añadir ítem manual y vaciar carrito */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleOpenManualItemDialog}
        >
          Añadir Ítem Manual
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleClearCart}
          disabled={cart.length === 0}
        >
          Vaciar Carrito
        </Button>
      </Box>
      {/* Lista de ítems en una tabla */}
      {cart.length === 0 ? (
        <Typography color="text.secondary">El carrito está vacío.</Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ mb: 2, maxHeight: 300, overflow: 'auto' }} // Scroll vertical
        >
          <Table size="small" aria-label="carrito de compras">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Producto</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="right">
                  Precio
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">
                  Cantidad
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">
                  Acciones
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="right">
                  Subtotal
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {/* Nombre del producto */}
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ maxWidth: 150, whiteSpace: 'normal' }}
                  >
                    {item.name || 'Producto desconocido'}
                  </TableCell>
                  {/* Precio unitario */}
                  <TableCell align="right">
                    ${parseFloat(item.price).toFixed(2)}
                  </TableCell>
                  {/* Cantidad */}
                  <TableCell align="center">{item.quantity}</TableCell>
                  {/* Botones de acción */}
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                      {/* Botón para restar cantidad */}
                      <IconButton
                        size="small"
                        onClick={() => onQuantityChange(item.id, -1)}
                        disabled={item.quantity <= 1}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      {/* Botón para sumar cantidad */}
                      <IconButton
                        size="small"
                        onClick={() => onQuantityChange(item.id, 1)}
                        disabled={
                          !item.isManual &&
                          item.quantity >= (item.stock || Infinity)
                        } // Valida stock para ítems no manuales
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                      {/* Botón para eliminar ítem */}
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  {/* Subtotal */}
                  <TableCell align="right">
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* Total y botón de finalizar */}
      <Box sx={{ mt: 'auto' }}>
        <Divider sx={{ mb: 2 }} /> {/* Separador visual */}
        {/* Total del carrito */}
        <Typography variant="h6" align="right">
          Total: ${total.toFixed(2)}
        </Typography>
        {/* Botón para finalizar la venta */}
        <Button
          variant="contained"
          color="success"
          fullWidth
          sx={{ mt: 2 }}
          onClick={onFinalizeSale}
          disabled={cart.length === 0}
        >
          Finalizar Venta
        </Button>
      </Box>
      {/* Diálogo para añadir ítem manual */}
      <Dialog open={openManualItemDialog} onClose={handleCloseManualItemDialog}>
        <DialogTitle>Añadir Ítem Manual</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {/* Campo para el nombre */}
            <TextField
              label="Nombre del Ítem"
              name="name"
              value={manualItem.name}
              onChange={handleManualItemChange}
              fullWidth
              required
            />
            {/* Campo para el precio */}
            <TextField
              label="Precio"
              name="price"
              type="number"
              value={manualItem.price}
              onChange={handleManualItemChange}
              fullWidth
              required
              inputProps={{ min: 0, step: 0.01 }}
            />
            {/* Campo para la cantidad */}
            <TextField
              label="Cantidad"
              name="quantity"
              type="number"
              value={manualItem.quantity}
              onChange={handleManualItemChange}
              fullWidth
              required
              inputProps={{ min: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          {/* Botón para cancelar */}
          <Button onClick={handleCloseManualItemDialog}>Cancelar</Button>
          {/* Botón para añadir el ítem */}
          <Button variant="contained" onClick={handleAddManualItem}>
            Añadir
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ShoppingCart;
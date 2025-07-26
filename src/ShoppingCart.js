import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

const ShoppingCart = ({
  cart,
  onQuantityChange,
  onRemoveItem,
  onFinalizeSale,
}) => {
  const [openManualItemDialog, setOpenManualItemDialog] = useState(false);
  const [manualItem, setManualItem] = useState({
    name: "",
    price: "",
    quantity: 1,
  });

  // Calcular el total del carrito
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Manejar el formulario de ítem manual
  const handleManualItemChange = (e) => {
    const { name, value } = e.target;
    setManualItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddManualItem = () => {
    const { name, price, quantity } = manualItem;
    if (!name || !price || price <= 0 || quantity <= 0) {
      toast.error("Por favor, completa el nombre, precio y cantidad válidos.");
      return;
    }

    // Añadir el ítem manual al carrito
    onQuantityChange(
      `manual_${Date.now()}`, // ID único para ítems manuales
      parseInt(quantity),
      { name, price: parseFloat(price), quantity: 0, isManual: true } // isManual para diferenciar
    );

    // Limpiar formulario y cerrar diálogo
    setManualItem({ name: "", price: "", quantity: 1 });
    setOpenManualItemDialog(false);
    toast.success("Ítem manual añadido al carrito.");
  };

  // Abrir/cerrar el diálogo de ítem manual
  const handleOpenManualItemDialog = () => setOpenManualItemDialog(true);
  const handleCloseManualItemDialog = () => {
    setManualItem({ name: "", price: "", quantity: 1 });
    setOpenManualItemDialog(false);
  };

  // Vaciar el carrito
  const handleClearCart = () => {
    if (window.confirm("¿Seguro que quieres vaciar el carrito?")) {
      cart.forEach((item) => onRemoveItem(item.id));
      toast.info("Carrito vaciado.");
    }
  };

  return (
    <Paper
      sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Typography variant="h5" gutterBottom>
        Carrito de Compras
      </Typography>

      {/* Botones de acciones */}
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
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

      {/* Lista de ítems */}
      {cart.length === 0 ? (
        <Typography color="text.secondary">El carrito está vacío.</Typography>
      ) : (
        <List sx={{ flexGrow: 1, overflow: "auto" }}>
          {cart.map((item) => (
            <ListItem key={item.id} divider>
              <ListItemText
                primary={item.name}
                secondary={`$${parseFloat(item.price).toFixed(2)} x ${
                  item.quantity
                }`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  onClick={() => onQuantityChange(item.id, -1)}
                  disabled={item.quantity <= 1}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                <IconButton onClick={() => onQuantityChange(item.id, 1)}>
                  <AddIcon />
                </IconButton>
                <IconButton onClick={() => onRemoveItem(item.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      {/* Total y botón de finalizar */}
      <Box sx={{ mt: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Nombre del Ítem"
              name="name"
              value={manualItem.name}
              onChange={handleManualItemChange}
              fullWidth
              required
            />
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
          <Button onClick={handleCloseManualItemDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleAddManualItem}>
            Añadir
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ShoppingCart;

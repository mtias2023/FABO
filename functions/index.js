const functions = require("firebase-functions");
const mercadopago = require("mercadopago");

// Configuración de Mercado Pago con tu access_token
mercadopago.configure({
  access_token: "5598373379629756",
});

// Función para crear la preferencia de pago
exports.createPayment = functions.https.onRequest(async (req, res) => {
  try {
    const preference = {
      items: [
        {
          title: req.body.title,
          unit_price: req.body.price,
          quantity: req.body.quantity,
        },
      ],
      back_urls: {
        success: "https://tu-web.com/success",
        failure: "https://tu-web.com/failure",
        pending: "https://tu-web.com/pending",
      },
      auto_return: "approved",
    };

    // Crear la preferencia en Mercado Pago
    const response = await mercadopago.preferences.create(preference);

    // Enviar el link de inicio de pago (init_point) al frontend
    res.json({init_point: response.body.init_point});
  } catch (error) {
    console.error("Error al crear la preferencia de pago", error);
    res.status(500).send(error.message);
  }
});

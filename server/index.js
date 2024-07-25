/* const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_51Pb3p4RxG6tmlHDdM1h0cPP3g3CevZb6XGO77qCwO4mAAiPIb8pwLyeQDcGSqhGCKu8hPu5ere5fXgd3WZfbjckm00NBue3iXJ'); // Substitua pela sua chave secreta do Stripe

const app = express();

// Middleware para processar JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Webhook para lidar com eventos do Stripe
app.post('/webhook', (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, 'whsec_dWvHl4pXbjIy2pPDgLscsvFvEJ1T4BK8'); // Substitua pelo seu endpoint secret
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Checkout session completed:', session);
      // Lidar com o evento de pagamento concluído
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Endpoint para verificar o status da assinatura
app.post('/check-subscription-status', async (req, res) => {
  const { email } = req.body;
  console.log('Received request to check subscription status for email:', email);

  if (!email) {
    console.log('Email not provided or invalid.');
    return res.status(400).send({ error: 'Email not provided or invalid.' });
  }

  try {
    // Busque o cliente pelo email
    const customers = await stripe.customers.list({ email });
    console.log('Stripe customers list response:', customers);

    if (customers.data.length === 0) {
      console.log('Customer not found for email:', email);
      return res.status(404).send({ error: 'Customer not found' });
    }

    const customer = customers.data.find(cust => cust.email === email);
    if (!customer) {
      console.log('Customer email does not match:', email);
      return res.status(404).send({ error: 'Customer email does not match' });
    }

    console.log('Found customer:', customer);

    // Busque todas as assinaturas do cliente
    const subscriptions = await stripe.subscriptions.list({ customer: customer.id });
    console.log('Stripe subscriptions list response:', subscriptions);

    if (subscriptions.data.length === 0) {
      console.log('Subscription not found for customer:', customer.id);
      return res.status(404).send({ error: 'Subscription not found' });
    }

    // Verifique se há uma assinatura ativa ou em trial
    const activeSubscription = subscriptions.data.find(sub => sub.status === 'active' || sub.status === 'trialing');

    if (!activeSubscription) {
      console.log('Active or trialing subscription not found for customer:', customer.id);
      return res.status(404).send({ error: 'Active or trialing subscription not found' });
    }

    console.log('Subscription status for customer:', activeSubscription.status);
    res.send({ subscriptionStatus: activeSubscription.status });
  } catch (error) {
    console.error('Error checking subscription status:', error);
    res.status(400).send({ error: error.message });
  }
});

// Endpoint para cancelar a assinatura
app.post('/cancel-subscription', async (req, res) => {
  const { email } = req.body;
  console.log('Received request to cancel subscription for email:', email);

  if (!email) {
    console.log('Email not provided or invalid.');
    return res.status(400).send({ error: 'Email not provided or invalid.' });
  }

  try {
    // Busque o cliente pelo email
    const customers = await stripe.customers.list({ email });
    console.log('Stripe customers list response:', customers);

    if (customers.data.length === 0) {
      console.log('Customer not found for email:', email);
      return res.status(404).send({ error: 'Customer not found' });
    }

    const customer = customers.data.find(cust => cust.email === email);
    if (!customer) {
      console.log('Customer email does not match:', email);
      return res.status(404).send({ error: 'Customer email does not match' });
    }

    console.log('Found customer:', customer);

    // Busque todas as assinaturas do cliente
    const subscriptions = await stripe.subscriptions.list({ customer: customer.id });
    console.log('Stripe subscriptions list response:', subscriptions);

    if (subscriptions.data.length === 0) {
      console.log('Subscription not found for customer:', customer.id);
      return res.status(404).send({ error: 'Subscription not found' });
    }

    // Verifique se há uma assinatura ativa ou em trial
    const activeSubscription = subscriptions.data.find(sub => sub.status === 'active' || sub.status === 'trialing');

    if (!activeSubscription) {
      console.log('Active or trialing subscription not found for customer:', customer.id);
      return res.status(404).send({ error: 'Active or trialing subscription not found' });
    }

    // Cancele a assinatura ativa
    const canceledSubscription = await stripe.subscriptions.update(activeSubscription.id, {
      cancel_at_period_end: true
    });
    console.log('Canceled subscription:', canceledSubscription);

    res.send({ message: 'Subscription canceled', subscription: canceledSubscription });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(400).send({ error: error.message });
  }
});

// Test endpoint para verificar o recebimento de dados
app.post('/test-receive', (req, res) => {
  console.log('Dados recebidos:', req.body);
  res.json({ message: 'backend recebeu' });
});

// Test endpoint para verificar a resposta do servidor
app.get('/test-response', (req, res) => {
  res.json({ message: 'backend devolveu' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`)); */


    //  01
/* const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_51Pb3p4RxG6tmlHDdM1h0cPP3g3CevZb6XGO77qCwO4mAAiPIb8pwLyeQDcGSqhGCKu8hPu5ere5fXgd3WZfbjckm00NBue3iXJ');
const db = require('./database'); // Importar o banco de dados

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Webhook para lidar com eventos do Stripe
app.post('/webhook', (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, 'whsec_dWvHl4pXbjIy2pPDgLscsvFvEJ1T4BK8'); // Substitua pelo seu endpoint secret
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Checkout session completed:', session);
      // Lidar com o evento de pagamento concluído
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Endpoint para verificar o status da assinatura
app.post('/check-subscription-status', async (req, res) => {
  const { email, uuid } = req.body;
  console.log('Received request to check subscription status for email:', email, 'and UUID:', uuid);

  if (!email || !uuid) {
    console.log('Email or UUID not provided or invalid.');
    return res.status(400).send({ error: 'Email or UUID not provided or invalid.' });
  }

  try {
    db.get('SELECT uuid FROM customers WHERE email = ?', [email], async (err, row) => {
      if (err) {
        console.error('Error querying database:', err.message);
        return res.status(500).send({ error: 'Internal server error.' });
      }

      if (row && row.uuid !== uuid) {
        console.log('UUID mismatch for email:', email);
        return res.status(400).send({ error: 'Este email já está sendo utilizado por outro usuário.' });
      }

      if (!row) {
        // Busque o cliente pelo email
        const customers = await stripe.customers.list({ email });
        console.log('Stripe customers list response:', customers);

        if (customers.data.length === 0) {
          console.log('Customer not found for email:', email);
          return res.status(404).send({ error: 'Customer not found' });
        }

        const customer = customers.data.find(cust => cust.email === email);
        if (!customer) {
          console.log('Customer email does not match:', email);
          return res.status(404).send({ error: 'Customer email does not match' });
        }

        console.log('Found customer:', customer);

        // Busque todas as assinaturas do cliente
        const subscriptions = await stripe.subscriptions.list({ customer: customer.id });
        console.log('Stripe subscriptions list response:', subscriptions);

        if (subscriptions.data.length === 0) {
          console.log('Subscription not found for customer:', customer.id);
          return res.status(404).send({ error: 'Subscription not found' });
        }

        // Verifique se há uma assinatura ativa ou em trial
        const activeSubscription = subscriptions.data.find(sub => sub.status === 'active' || sub.status === 'trialing');

        if (!activeSubscription) {
          console.log('Active or trialing subscription not found for customer:', customer.id);
          return res.status(404).send({ error: 'Active or trialing subscription not found' });
        }

        // Vincular o UUID ao email no primeiro uso
        db.run('INSERT INTO customers (email, uuid) VALUES (?, ?)', [email, uuid], (err) => {
          if (err) {
            console.error('Error inserting into database:', err.message);
            return res.status(500).send({ error: 'Internal server error.' });
          }

          console.log('Subscription status for customer:', activeSubscription.status);
          res.send({ subscriptionStatus: activeSubscription.status });
        });
      } else {
        console.log('Subscription status for customer:', row.uuid);
        res.send({ subscriptionStatus: 'active' });
      }
    });
  } catch (error) {
    console.error('Error checking subscription status:', error);
    res.status(400).send({ error: error.message });
  }
});

// Endpoint para cancelar a assinatura
app.post('/cancel-subscription', async (req, res) => {
  const { email, uuid } = req.body;
  console.log('Received request to cancel subscription for email:', email, 'and UUID:', uuid);

  if (!email || !uuid) {
    console.log('Email or UUID not provided or invalid.');
    return res.status(400).send({ error: 'Email or UUID not provided or invalid.' });
  }

  try {
    db.get('SELECT uuid FROM customers WHERE email = ?', [email], async (err, row) => {
      if (err) {
        console.error('Error querying database:', err.message);
        return res.status(500).send({ error: 'Internal server error.' });
      }

      if (!row) {
        console.log('Customer not found for email:', email);
        return res.status(404).send({ error: 'Customer not found' });
      }

      if (row.uuid !== uuid) {
        console.log('UUID mismatch for email:', email);
        return res.status(400).send({ error: 'UUID mismatch for email.' });
      }

      // Busque o cliente pelo email
      const customers = await stripe.customers.list({ email });
      console.log('Stripe customers list response:', customers);

      if (customers.data.length === 0) {
        console.log('Customer not found for email:', email);
        return res.status(404).send({ error: 'Customer not found' });
      }

      const customer = customers.data.find(cust => cust.email === email);
      if (!customer) {
        console.log('Customer email does not match:', email);
        return res.status(404).send({ error: 'Customer email does not match' });
      }

      console.log('Found customer:', customer);

      // Busque todas as assinaturas do cliente
      const subscriptions = await stripe.subscriptions.list({ customer: customer.id });
      console.log('Stripe subscriptions list response:', subscriptions);

      if (subscriptions.data.length === 0) {
        console.log('Subscription not found for customer:', customer.id);
        return res.status(404).send({ error: 'Subscription not found' });
      }

      // Verifique se há uma assinatura ativa ou em trial
      const activeSubscription = subscriptions.data.find(sub => sub.status === 'active' || sub.status === 'trialing');

      if (!activeSubscription) {
        console.log('Active or trialing subscription not found for customer:', customer.id);
        return res.status(404).send({ error: 'Active or trialing subscription not found' });
      }

      // Cancele a assinatura ativa
      const canceledSubscription = await stripe.subscriptions.update(activeSubscription.id, {
        cancel_at_period_end: true
      });
      console.log('Canceled subscription:', canceledSubscription);

      res.send({ message: 'Subscription canceled', subscription: canceledSubscription });
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(400).send({ error: error.message });
  }
});

// Endpoint para desvincular o UUID do email
app.post('/unlink-uuid', (req, res) => {
  const { email, uuid } = req.body;
  console.log('Received request to unlink UUID for email:', email, 'and UUID:', uuid);

  if (!email || !uuid) {
    console.log('Email or UUID not provided or invalid.');
    return res.status(400).send({ error: 'Email or UUID not provided or invalid.' });
  }

  db.get('SELECT uuid FROM customers WHERE email = ?', [email], (err, row) => {
    if (err) {
      console.error('Error querying database:', err.message);
      return res.status(500).send({ error: 'Internal server error.' });
    }

    if (!row) {
      console.log('Customer not found for email:', email);
      return res.status(404).send({ error: 'Customer not found' });
    }

    if (row.uuid !== uuid) {
      console.log('UUID mismatch for email:', email);
      return res.status(400).send({ error: 'UUID mismatch for email.' });
    }

    db.run('DELETE FROM customers WHERE email = ?', [email], (err) => {
      if (err) {
        console.error('Error deleting from database:', err.message);
        return res.status(500).send({ error: 'Internal server error.' });
      }

      console.log('UUID unlinked for email:', email);
      res.send({ message: 'UUID unlinked successfully.' });
    });
  });
});

// Test endpoint para verificar o recebimento de dados
app.post('/test-receive', (req, res) => {
  console.log('Dados recebidos:', req.body);
  res.json({ message: 'backend recebeu' });
});

// Test endpoint para verificar a resposta do servidor
app.get('/test-response', (req, res) => {
  res.json({ message: 'backend devolveu' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`)); */


    // 02
/*     const express = require('express');
    const bodyParser = require('body-parser');
    const stripe = require('stripe')('sk_test_51Pb3p4RxG6tmlHDdM1h0cPP3g3CevZb6XGO77qCwO4mAAiPIb8pwLyeQDcGSqhGCKu8hPu5ere5fXgd3WZfbjckm00NBue3iXJ');
    const db = require('./database'); // Importar o banco de dados
    
    const app = express();
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    
    // Webhook para lidar com eventos do Stripe
    app.post('/webhook', (req, res) => {
      const sig = req.headers['stripe-signature'];
      let event;
    
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, 'whsec_dWvHl4pXbjIy2pPDgLscsvFvEJ1T4BK8'); // Substitua pelo seu endpoint secret
      } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    
      // Handle the event
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;
          console.log('Checkout session completed:', session);
          // Lidar com o evento de pagamento concluído
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    
      res.json({ received: true });
    });
    
    // Endpoint para verificar o status da assinatura
    app.post('/check-subscription-status', async (req, res) => {
      const { email, uuid, password } = req.body;
      console.log('Received request to check subscription status for email:', email, 'UUID:', uuid, 'and password:', password);
    
      if (!email || !uuid || !password) {
        console.log('Email, UUID or password not provided or invalid.');
        return res.status(400).send({ error: 'Email, UUID or password not provided or invalid.' });
      }
    
      try {
        db.get('SELECT uuid, password FROM customers WHERE email = ?', [email], async (err, row) => {
          if (err) {
            console.error('Error querying database:', err.message);
            return res.status(500).send({ error: 'Internal server error.' });
          }
    
          if (row && row.uuid !== uuid) {
            console.log('UUID mismatch for email:', email);
            return res.status(400).send({ error: 'Este email já está sendo utilizado por outro usuário.' });
          }
    
          if (!row) {
            // Busque o cliente pelo email
            const customers = await stripe.customers.list({ email });
            console.log('Stripe customers list response:', customers);
    
            if (customers.data.length === 0) {
              console.log('Customer not found for email:', email);
              return res.status(404).send({ error: 'Customer not found' });
            }
    
            const customer = customers.data.find(cust => cust.email === email);
            if (!customer) {
              console.log('Customer email does not match:', email);
              return res.status(404).send({ error: 'Customer email does not match' });
            }
    
            console.log('Found customer:', customer);
    
            // Busque todas as assinaturas do cliente
            const subscriptions = await stripe.subscriptions.list({ customer: customer.id });
            console.log('Stripe subscriptions list response:', subscriptions);
    
            if (subscriptions.data.length === 0) {
              console.log('Subscription not found for customer:', customer.id);
              return res.status(404).send({ error: 'Subscription not found' });
            }
    
            // Verifique se há uma assinatura ativa ou em trial
            const activeSubscription = subscriptions.data.find(sub => sub.status === 'active' || sub.status === 'trialing');
    
            if (!activeSubscription) {
              console.log('Active or trialing subscription not found for customer:', customer.id);
              return res.status(404).send({ error: 'Active or trialing subscription not found' });
            }
    
            // Vincular o UUID e a senha ao email no primeiro uso
            db.run('INSERT INTO customers (email, uuid, password) VALUES (?, ?, ?)', [email, uuid, password], (err) => {
              if (err) {
                console.error('Error inserting into database:', err.message);
                return res.status(500).send({ error: 'Internal server error.' });
              }
    
              console.log('Subscription status for customer:', activeSubscription.status);
              console.log('Saved in database - email:', email, ', uuid:', uuid, ', password:', password);
              res.send({ subscriptionStatus: activeSubscription.status });
            });
          } else {
            console.log('Subscription status for customer:', row.uuid, 'with password:', row.password);
            res.send({ subscriptionStatus: 'active' });
          }
    
          // Log current database state
          db.all('SELECT * FROM customers', (err, rows) => {
            if (err) {
              console.error('Error querying database:', err.message);
            } else {
              console.log('Current database state:', rows);
            }
          });
        });
      } catch (error) {
        console.error('Error checking subscription status:', error);
        res.status(400).send({ error: error.message });
      }
    });
    
    // Endpoint para cancelar a assinatura
    app.post('/cancel-subscription', async (req, res) => {
      const { email, uuid, password } = req.body;
      console.log('Received request to cancel subscription for email:', email, 'UUID:', uuid, 'and password:', password);
    
      if (!email || !uuid || !password) {
        console.log('Email, UUID or password not provided or invalid.');
        return res.status(400).send({ error: 'Email, UUID or password not provided or invalid.' });
      }
    
      try {
        db.get('SELECT uuid, password FROM customers WHERE email = ?', [email], async (err, row) => {
          if (err) {
            console.error('Error querying database:', err.message);
            return res.status(500).send({ error: 'Internal server error.' });
          }
    
          if (!row) {
            console.log('Customer not found for email:', email);
            return res.status(404).send({ error: 'Customer not found' });
          }
    
          if (row.uuid !== uuid) {
            console.log('UUID mismatch for email:', email);
            return res.status(400).send({ error: 'UUID mismatch for email.' });
          }
    
          if (row.password !== password) {
            console.log('Password mismatch for email:', email);
            return res.status(400).send({ error: 'Senha inválida.' });
          }
    
          // Busque o cliente pelo email
          const customers = await stripe.customers.list({ email });
          console.log('Stripe customers list response:', customers);
    
          if (customers.data.length === 0) {
            console.log('Customer not found for email:', email);
            return res.status(404).send({ error: 'Customer not found' });
          }
    
          const customer = customers.data.find(cust => cust.email === email);
          if (!customer) {
            console.log('Customer email does not match:', email);
            return res.status(404).send({ error: 'Customer email does not match' });
          }
    
          console.log('Found customer:', customer);
    
          // Busque todas as assinaturas do cliente
          const subscriptions = await stripe.subscriptions.list({ customer: customer.id });
          console.log('Stripe subscriptions list response:', subscriptions);
    
          if (subscriptions.data.length === 0) {
            console.log('Subscription not found for customer:', customer.id);
            return res.status(404).send({ error: 'Subscription not found' });
          }
    
          // Verifique se há uma assinatura ativa ou em trial
          const activeSubscription = subscriptions.data.find(sub => sub.status === 'active' || sub.status === 'trialing');
    
          if (!activeSubscription) {
            console.log('Active or trialing subscription not found for customer:', customer.id);
            return res.status(404).send({ error: 'Active or trialing subscription not found' });
          }
    
          // Cancele a assinatura ativa
          const canceledSubscription = await stripe.subscriptions.update(activeSubscription.id, {
            cancel_at_period_end: true
          });
          console.log('Canceled subscription:', canceledSubscription);
    
          res.send({ message: 'Subscription canceled', subscription: canceledSubscription });
        });
      } catch (error) {
        console.error('Error canceling subscription:', error);
        res.status(400).send({ error: error.message });
      }
    });
    
    // Endpoint para desvincular o UUID do email
    app.post('/unlink-uuid', (req, res) => {
      const { email, uuid, password } = req.body;
      console.log('Received request to unlink UUID for email:', email, 'UUID:', uuid, 'and password:', password);
    
      if (!email || !uuid || !password) {
        console.log('Email, UUID or password not provided or invalid.');
        return res.status(400).send({ error: 'Email, UUID or password not provided or invalid.' });
      }
    
      db.get('SELECT uuid, password FROM customers WHERE email = ?', [email], (err, row) => {
        if (err) {
          console.error('Error querying database:', err.message);
          return res.status(500).send({ error: 'Internal server error.' });
        }
    
        if (!row) {
          console.log('Customer not found for email:', email);
          return res.status(404).send({ error: 'Customer not found' });
        }
    
        if (row.uuid !== uuid) {
          console.log('UUID mismatch for email:', email);
          return res.status(400).send({ error: 'UUID mismatch for email.' });
        }
    
        if (row.password !== password) {
          console.log('Password mismatch for email:', email);
          return res.status(400).send({ error: 'Senha inválida.' });
        }
    
        db.run('DELETE FROM customers WHERE email = ?', [email], (err) => {
          if (err) {
            console.error('Error deleting from database:', err.message);
            return res.status(500).send({ error: 'Internal server error.' });
          }
    
          console.log('UUID unlinked for email:', email);
          res.send({ message: 'UUID unlinked successfully.' });
        });
      });
    });
    
    // Test endpoint para verificar o recebimento de dados
    app.post('/test-receive', (req, res) => {
      console.log('Dados recebidos:', req.body);
      res.json({ message: 'backend recebeu' });
    });
    
    // Test endpoint para verificar a resposta do servidor
    app.get('/test-response', (req, res) => {
      res.json({ message: 'backend devolveu' });
    });
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Running on port ${PORT}`)); */
    
    // 03
    const express = require('express');
    const bodyParser = require('body-parser');
    const stripe = require('stripe')('sk_test_51Pb3p4RxG6tmlHDdM1h0cPP3g3CevZb6XGO77qCwO4mAAiPIb8pwLyeQDcGSqhGCKu8hPu5ere5fXgd3WZfbjckm00NBue3iXJ');
    const db = require('./database'); // Importar o banco de dados
    
    const app = express();
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    
    // Webhook para lidar com eventos do Stripe
    app.post('/webhook', (req, res) => {
      const sig = req.headers['stripe-signature'];
      let event;
    
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, 'whsec_dWvHl4pXbjIy2pPDgLscsvFvEJ1T4BK8'); // Substitua pelo seu endpoint secret
      } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    
      // Handle the event
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;
          console.log('Checkout session completed:', session);
          // Lidar com o evento de pagamento concluído
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    
      res.json({ received: true });
    });
    
    // Endpoint para verificar o status da assinatura
    app.post('/check-subscription-status', async (req, res) => {
      const { email, uuid, password, product_id } = req.body;
      console.log('Received request to check subscription status for email:', email, 'UUID:', uuid, 'password:', password, 'product_id:', product_id);
    
      if (!email || !uuid || !password || !product_id) {
        console.log('Email, UUID, password or product_id not provided or invalid.');
        return res.status(400).send({ error: 'Email, UUID, password or product_id not provided or invalid.' });
      }
    
      try {
        db.get('SELECT uuid, password FROM customers WHERE email = ? AND product_id = ?', [email, product_id], async (err, row) => {
          if (err) {
            console.error('Error querying database:', err.message);
            return res.status(500).send({ error: 'Internal server error.' });
          }
    
          if (row && row.uuid !== uuid) {
            console.log('UUID mismatch for email:', email);
            return res.status(400).send({ error: 'Este email já está sendo utilizado por outro usuário.' });
          }
    
          if (!row) {
            // Busque o cliente pelo email
            const customers = await stripe.customers.list({ email });
            console.log('Stripe customers list response:', customers);
    
            if (customers.data.length === 0) {
              console.log('Customer not found for email:', email);
              return res.status(404).send({ error: 'Customer not found' });
            }
    
            const customer = customers.data.find(cust => cust.email === email);
            if (!customer) {
              console.log('Customer email does not match:', email);
              return res.status(404).send({ error: 'Customer email does not match' });
            }
    
            console.log('Found customer:', customer);
    
            // Busque todas as assinaturas do cliente
            const subscriptions = await stripe.subscriptions.list({ customer: customer.id });
            console.log('Stripe subscriptions list response:', subscriptions);
    
            if (subscriptions.data.length === 0) {
              console.log('Subscription not found for customer:', customer.id);
              return res.status(404).send({ error: 'Subscription not found' });
            }
    
            // Verifique se há uma assinatura ativa ou em trial
            const activeSubscription = subscriptions.data.find(sub => (sub.status === 'active' || sub.status === 'trialing') && sub.plan.product === product_id);
    
            if (!activeSubscription) {
              console.log('Active or trialing subscription not found for customer:', customer.id);
              return res.status(404).send({ error: 'Active or trialing subscription not found' });
            }
    
            console.log('Active subscription found:', {
              subscriptionId: activeSubscription.id,
              productId: activeSubscription.plan.product,
              status: activeSubscription.status,
            });
    
            // Vincular o UUID e a senha ao email no primeiro uso
            db.run('INSERT INTO customers (email, uuid, password, product_id) VALUES (?, ?, ?, ?)', [email, uuid, password, product_id], (err) => {
              if (err) {
                console.error('Error inserting into database:', err.message);
                return res.status(500).send({ error: 'Internal server error.' });
              }
    
              console.log('Subscription status for customer:', activeSubscription.status);
              console.log('Saved in database - email:', email, ', uuid:', uuid, ', password:', password, ', product_id:', product_id);
              res.send({ subscriptionStatus: activeSubscription.status });
            });
          } else {
            console.log('Subscription status for customer:', row.uuid, 'with password:', row.password);
            res.send({ subscriptionStatus: 'active' });
          }
    
          // Log current database state
          db.all('SELECT * FROM customers', (err, rows) => {
            if (err) {
              console.error('Error querying database:', err.message);
            } else {
              console.log('Current database state:', rows);
            }
          });
        });
      } catch (error) {
        console.error('Error checking subscription status:', error);
        res.status(400).send({ error: error.message });
      }
    });
    
    // Endpoint para cancelar a assinatura
    app.post('/cancel-subscription', async (req, res) => {
      const { email, uuid, password, product_id } = req.body;
      console.log('Received request to cancel subscription for email:', email, 'UUID:', uuid, 'and password:', password, 'product_id:', product_id);
    
      if (!email || !uuid || !password || !product_id) {
        console.log('Email, UUID, password or product_id not provided or invalid.');
        return res.status(400).send({ error: 'Email, UUID, password or product_id not provided or invalid.' });
      }
    
      try {
        db.get('SELECT uuid, password FROM customers WHERE email = ? AND product_id = ?', [email, product_id], async (err, row) => {
          if (err) {
            console.error('Error querying database:', err.message);
            return res.status(500).send({ error: 'Internal server error.' });
          }
    
          if (!row) {
            console.log('Customer not found for email:', email);
            return res.status(404).send({ error: 'Customer not found' });
          }
    
          if (row.uuid !== uuid) {
            console.log('UUID mismatch for email:', email);
            return res.status(400).send({ error: 'UUID mismatch for email.' });
          }
    
          if (row.password !== password) {
            console.log('Password mismatch for email:', email);
            return res.status(400).send({ error: 'Senha inválida.' });
          }
    
          // Busque o cliente pelo email
          const customers = await stripe.customers.list({ email });
          console.log('Stripe customers list response:', customers);
    
          if (customers.data.length === 0) {
            console.log('Customer not found for email:', email);
            return res.status(404).send({ error: 'Customer not found' });
          }
    
          const customer = customers.data.find(cust => cust.email === email);
          if (!customer) {
            console.log('Customer email does not match:', email);
            return res.status(404).send({ error: 'Customer email does not match' });
          }
    
          console.log('Found customer:', customer);
    
          // Busque todas as assinaturas do cliente
          const subscriptions = await stripe.subscriptions.list({ customer: customer.id });
          console.log('Stripe subscriptions list response:', subscriptions);
    
          if (subscriptions.data.length === 0) {
            console.log('Subscription not found for customer:', customer.id);
            return res.status(404).send({ error: 'Subscription not found' });
          }
    
          // Verifique se há uma assinatura ativa ou em trial
          const activeSubscription = subscriptions.data.find(sub => (sub.status === 'active' || sub.status === 'trialing') && sub.plan.product === product_id);
    
          if (!activeSubscription) {
            console.log('Active or trialing subscription not found for customer:', customer.id);
            return res.status(404).send({ error: 'Active or trialing subscription not found' });
          }
    
          // Cancele a assinatura ativa
          const canceledSubscription = await stripe.subscriptions.update(activeSubscription.id, {
            cancel_at_period_end: true
          });
          console.log('Canceled subscription:', canceledSubscription);
    
          res.send({ message: 'Subscription canceled', subscription: canceledSubscription });
        });
      } catch (error) {
        console.error('Error canceling subscription:', error);
        res.status(400).send({ error: error.message });
      }
    });
    
    // Endpoint para desvincular o UUID do email
    app.post('/unlink-uuid', (req, res) => {
      const { email, uuid, password, product_id } = req.body;
      console.log('Received request to unlink UUID for email:', email, 'UUID:', uuid, 'password:', password, 'product_id:', product_id);
    
      if (!email || !uuid || !password || !product_id) {
        console.log('Email, UUID, password or product_id not provided or invalid.');
        return res.status(400).send({ error: 'Email, UUID, password or product_id not provided or invalid.' });
      }
    
      db.get('SELECT uuid, password FROM customers WHERE email = ? AND product_id = ?', [email, product_id], (err, row) => {
        if (err) {
          console.error('Error querying database:', err.message);
          return res.status(500).send({ error: 'Internal server error.' });
        }
    
        if (!row) {
          console.log('Customer not found for email:', email);
          return res.status(404).send({ error: 'Customer not found' });
        }
    
        if (row.uuid !== uuid) {
          console.log('UUID mismatch for email:', email);
          return res.status(400).send({ error: 'UUID mismatch for email.' });
        }
    
        if (row.password !== password) {
          console.log('Password mismatch for email:', email);
          return res.status(400).send({ error: 'Senha inválida.' });
        }
    
        db.run('DELETE FROM customers WHERE email = ? AND product_id = ?', [email, product_id], (err) => {
          if (err) {
            console.error('Error deleting from database:', err.message);
            return res.status(500).send({ error: 'Internal server error.' });
          }
    
          console.log('UUID unlinked for email:', email);
          res.send({ message: 'UUID unlinked successfully.' });
        });
      });
    });
    
    // Test endpoint para verificar o recebimento de dados
    app.post('/test-receive', (req, res) => {
      console.log('Dados recebidos:', req.body);
      res.json({ message: 'backend recebeu' });
    });
    
    // Test endpoint para verificar a resposta do servidor
    app.get('/test-response', (req, res) => {
      res.json({ message: 'backend devolveu' });
    });
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Running on port ${PORT}`));
    
import express from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const apiRouter = express.Router();

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Retrieve a list of products
 *     responses:
 *       200:
 *         description: A list of products.
 */
// REST API Endpoints

// 1. PRODUCTS API
apiRouter.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/products', async (req, res) => {
  try {
    const { id, name, description, category, price, stock, image, status } = req.body;
    const prod = await prisma.product.create({
      data: {
        id: id || undefined,
        name: name.toUpperCase(),
        description: description || '',
        category,
        price: Number(price),
        stock: Number(stock),
        image: image || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=300',
        status: status || (Number(stock) === 0 ? 'Out of Stock' : Number(stock) <= 5 ? 'Low Stock' : 'Active')
      }
    });

    // Automatically update product count for this category
    await prisma.category.updateMany({
      where: { name: category },
      data: { productCount: { increment: 1 } }
    });

    res.json(prod);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, stock, image, status } = req.body;
    
    // Get old category before updating
    const oldProd = await prisma.product.findUnique({ where: { id } });

    const prod = await prisma.product.update({
      where: { id },
      data: {
        name: name ? name.toUpperCase() : undefined,
        description,
        category,
        price: price !== undefined ? Number(price) : undefined,
        stock: stock !== undefined ? Number(stock) : undefined,
        image,
        status: status || (stock !== undefined ? (Number(stock) === 0 ? 'Out of Stock' : Number(stock) <= 5 ? 'Low Stock' : 'Active') : undefined)
      }
    });

    // Update category productCounts if category changed
    if (oldProd && oldProd.category !== category) {
      await prisma.category.updateMany({
        where: { name: oldProd.category },
        data: { productCount: { decrement: 1 } }
      });
      await prisma.category.updateMany({
        where: { name: category },
        data: { productCount: { increment: 1 } }
      });
    }

    res.json(prod);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.patch('/products/:id/stock', async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    const currentStock = Number(stock);
    const status = currentStock === 0 ? 'Out of Stock' : currentStock <= 5 ? 'Low Stock' : 'Active';

    const prod = await prisma.product.update({
      where: { id },
      data: {
        stock: currentStock,
        status
      }
    });
    res.json(prod);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const oldProd = await prisma.product.findUnique({ where: { id } });
    await prisma.product.delete({ where: { id } });

    if (oldProd) {
      await prisma.category.updateMany({
        where: { name: oldProd.category },
        data: { productCount: { decrement: 1 } }
      });
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. CATEGORIES API
apiRouter.get('/categories', async (req, res) => {
  try {
    // Dynamically recalculate product counts from Product table to be accurate
    const categories = await prisma.category.findMany();
    const updatedCategories = await Promise.all(
      categories.map(async (cat) => {
        const count = await prisma.product.count({ where: { category: cat.name } });
        if (cat.productCount !== count) {
          return await prisma.category.update({
            where: { id: cat.id },
            data: { productCount: count }
          });
        }
        return cat;
      })
    );
    res.json(updatedCategories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/categories', async (req, res) => {
  try {
    const { name, description } = req.body;
    const count = await prisma.product.count({ where: { category: name } });
    const cat = await prisma.category.create({
      data: {
        name,
        description: description || '',
        productCount: count
      }
    });
    res.json(cat);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const cat = await prisma.category.update({
      where: { id },
      data: {
        name,
        description
      }
    });
    res.json(cat);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. ORDERS API
apiRouter.get('/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true }
    });
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/orders', async (req, res) => {
  try {
    const { customerName, customerEmail, total, status, paymentMethod, items } = req.body;
    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        date: new Date().toISOString().split('T')[0],
        total: Number(total),
        status: status || 'Pending',
        paymentMethod,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: Number(item.quantity),
            price: Number(item.price)
          }))
        }
      },
      include: { items: true }
    });

    // Try to update/increment customer metrics
    const customer = await prisma.customer.findUnique({ where: { email: customerEmail } });
    if (customer) {
      await prisma.customer.update({
        where: { email: customerEmail },
        data: {
          totalSpend: { increment: Number(total) },
          orderCount: { increment: 1 }
        }
      });
    } else {
      await prisma.customer.create({
        data: {
          name: customerName,
          email: customerEmail,
          totalSpend: Number(total),
          orderCount: 1,
          joinDate: new Date().toISOString().split('T')[0],
          status: 'Active'
        }
      });
    }

    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, customerName, customerEmail, paymentMethod } = req.body;
    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        customerName,
        customerEmail,
        paymentMethod
      },
      include: { items: true }
    });
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.order.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. CUSTOMERS API
apiRouter.get('/customers', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/customers', async (req, res) => {
  try {
    const { name, email, status } = req.body;
    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        totalSpend: 0,
        orderCount: 0,
        joinDate: new Date().toISOString().split('T')[0],
        status: status || 'Active'
      }
    });
    res.json(customer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, status, totalSpend, orderCount } = req.body;
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name,
        email,
        status,
        totalSpend: totalSpend !== undefined ? Number(totalSpend) : undefined,
        orderCount: orderCount !== undefined ? Number(orderCount) : undefined
      }
    });
    res.json(customer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.customer.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. PROMOTIONS API
apiRouter.get('/promotions', async (req, res) => {
  try {
    const promotions = await prisma.promotion.findMany();
    res.json(promotions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/promotions', async (req, res) => {
  try {
    const { code, discountType, discountValue, startDate, endDate, status } = req.body;
    const promo = await prisma.promotion.create({
      data: {
        code,
        discountType,
        discountValue: Number(discountValue),
        startDate,
        endDate,
        status: status || 'Active',
        useCount: 0
      }
    });
    res.json(promo);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/promotions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discountType, discountValue, startDate, endDate, status, useCount } = req.body;
    const promo = await prisma.promotion.update({
      where: { id },
      data: {
        code,
        discountType,
        discountValue: discountValue !== undefined ? Number(discountValue) : undefined,
        startDate,
        endDate,
        status,
        useCount: useCount !== undefined ? Number(useCount) : undefined
      }
    });
    res.json(promo);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/promotions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.promotion.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. STAFF API
apiRouter.get('/staff', async (req, res) => {
  try {
    const staff = await prisma.staff.findMany();
    res.json(staff);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/staff', async (req, res) => {
  try {
    const { name, role, email, status, avatar } = req.body;
    const staff = await prisma.staff.create({
      data: {
        name,
        role,
        email,
        status: status || 'Active',
        avatar: avatar || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200'
      }
    });
    res.json(staff);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/staff/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, email, status, avatar } = req.body;
    const staff = await prisma.staff.update({
      where: { id },
      data: {
        name,
        role,
        email,
        status,
        avatar
      }
    });
    res.json(staff);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/staff/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.staff.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});




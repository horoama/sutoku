import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Seed basic categories and items if none exist
app.post('/api/seed', async (req, res) => {
  try {
    const existingCategories = await prisma.category.count();
    if (existingCategories > 0) {
      return res.json({ message: 'Already seeded' });
    }

    const meatCategory = await prisma.category.create({ data: { name: '肉類' } });
    const vegCategory = await prisma.category.create({ data: { name: '野菜類' } });
    const dairyCategory = await prisma.category.create({ data: { name: '乳製品' } });

    await prisma.itemTemplate.createMany({
      data: [
        { name: '牛肉', categoryId: meatCategory.id, defaultDays: 3 },
        { name: '豚肉', categoryId: meatCategory.id, defaultDays: 3 },
        { name: 'キャベツ', categoryId: vegCategory.id, defaultDays: 7 },
        { name: 'にんじん', categoryId: vegCategory.id, defaultDays: 14 },
        { name: '牛乳', categoryId: dairyCategory.id, defaultDays: 7 },
      ],
    });

    res.json({ message: 'Seed successful' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to seed data' });
  }
});

// Get Categories and Items
app.get('/api/items', async (req, res) => {
  const items = await prisma.category.findMany({
    include: { items: true },
  });
  res.json(items);
});

// Create User & Family (for initial testing purposes)
app.post('/api/setup-user', async (req, res) => {
  try {
    let family = await prisma.family.findFirst({ where: { name: 'Test Family' } });
    if (!family) {
      family = await prisma.family.create({ data: { name: 'Test Family' } });
    }

    let user = await prisma.user.findFirst({ where: { email: 'test@example.com' } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          familyId: family.id,
        },
      });
    }

    res.json({ user, family });
  } catch (error) {
    res.status(500).json({ error: 'Failed to setup user' });
  }
});


// Add to Shopping List
app.post('/api/shopping', async (req, res) => {
  const { familyId, itemTemplateId, priority, note } = req.body;
  try {
    const item = await prisma.shoppingItem.create({
      data: { familyId, itemTemplateId, priority, note },
      include: { itemTemplate: true },
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item' });
  }
});

// Get Shopping List
app.get('/api/shopping/:familyId', async (req, res) => {
  const { familyId } = req.params;
  const items = await prisma.shoppingItem.findMany({
    where: { familyId, isPurchased: false },
    include: { itemTemplate: true },
  });
  res.json(items);
});

// Move Shopping Item to Fridge
app.post('/api/shopping/:id/purchase', async (req, res) => {
  const { id } = req.params;
  try {
    const shoppingItem = await prisma.shoppingItem.findUnique({
      where: { id },
      include: { itemTemplate: true },
    });

    if (!shoppingItem) return res.status(404).json({ error: 'Not found' });

    await prisma.$transaction(async (tx) => {
      // Mark as purchased
      await tx.shoppingItem.update({
        where: { id },
        data: { isPurchased: true },
      });

      // Add to Fridge
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + shoppingItem.itemTemplate.defaultDays);

      await tx.fridgeItem.create({
        data: {
          familyId: shoppingItem.familyId,
          itemTemplateId: shoppingItem.itemTemplateId,
          expirationDate,
        },
      });

      // Record Purchase History
      await tx.purchaseHistory.create({
        data: {
          familyId: shoppingItem.familyId,
          itemTemplateId: shoppingItem.itemTemplateId,
        },
      });
    });

    res.json({ message: 'Moved to fridge and history recorded' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to purchase' });
  }
});

// Get Purchase History
app.get('/api/history/:familyId', async (req, res) => {
  const { familyId } = req.params;
  const history = await prisma.purchaseHistory.findMany({
    where: { familyId },
    include: { itemTemplate: true },
    orderBy: { purchasedAt: 'desc' },
  });
  res.json(history);
});

// Get Fridge Items
app.get('/api/fridge/:familyId', async (req, res) => {
  const { familyId } = req.params;
  const items = await prisma.fridgeItem.findMany({
    where: { familyId },
    include: { itemTemplate: true },
    orderBy: { expirationDate: 'asc' },
  });
  res.json(items);
});

// Chat Endpoints
app.get('/api/chat/:familyId', async (req, res) => {
  const { familyId } = req.params;
  const messages = await prisma.chatMessage.findMany({
    where: { familyId },
    include: { user: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  res.json(messages);
});

app.post('/api/chat', async (req, res) => {
  const { familyId, userId, text } = req.body;
  try {
    const message = await prisma.chatMessage.create({
      data: { familyId, userId, text },
      include: { user: true },
    });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
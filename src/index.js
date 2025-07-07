import 'dotenv/config';
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

import Contact from './models/contact.js';

const createContact = async () => {
  const exists = await Contact.findOne({ phoneNumber: '+380501234567' });
  if (exists) {
    console.log('Контакт вже існує');
    return;
  }

  const newContact = new Contact({
    name: 'Іван Іваненко',
    phoneNumber: '+380501234567',
    email: 'ivan@example.com',
    isFavourite: false,
    contactType: 'personal',
  });

  await newContact.save();
  console.log('✅ Контакт додано');
};

const bootstrap = async () => {
  try {
    await initMongoConnection();
    await createContact();
    setupServer();
  } catch (error) {
    console.error('❌ Помилка під час запуску:', error);
    process.exit(1);
  }
};
bootstrap();

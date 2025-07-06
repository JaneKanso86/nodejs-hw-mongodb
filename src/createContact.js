import 'dotenv/config';
import { initMongoConnection } from './db/initMongoConnection.js';
import Contact from './models/contact.js';

const createContact = async () => {
  await initMongoConnection();

  const exists = await Contact.findOne({ phoneNumber: '+380501234567' });
  if (exists) {
    console.log('Контакт вже існує');
    process.exit(0);
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
  process.exit(0);
};

createContact().catch((err) => {
  console.error('❌ Помилка створення контакту:', err.message);
  process.exit(1);
});

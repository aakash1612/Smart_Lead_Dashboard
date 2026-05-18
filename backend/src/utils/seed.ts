import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './db';
import { User } from '../models/User';
import { Lead } from '../models/Lead';

const seed = async (): Promise<void> => {
  await connectDB();

  console.log('🌱 Seeding database...');

  // Clear existing data
  await User.deleteMany({});
  await Lead.deleteMany({});

  // Create admin user
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@smartleads.com',
    password: 'admin123',
    role: 'admin',
  });

  // Create sales user
  const sales = await User.create({
    name: 'Sales Rep',
    email: 'sales@smartleads.com',
    password: 'sales123',
    role: 'sales',
  });

  const statuses: Array<'New' | 'Contacted' | 'Qualified' | 'Lost'> = [
    'New', 'Contacted', 'Qualified', 'Lost',
  ];
  const sources: Array<'Website' | 'Instagram' | 'Referral'> = [
    'Website', 'Instagram', 'Referral',
  ];

  const names = [
    'Rahul Sharma', 'Priya Mehta', 'Arjun Singh', 'Divya Patel',
    'Vikram Kumar', 'Ananya Reddy', 'Rohan Gupta', 'Neha Joshi',
    'Amit Verma', 'Pooja Agarwal', 'Sandeep Rao', 'Kavya Nair',
    'Suresh Pillai', 'Ritu Desai', 'Manish Tiwari', 'Sneha Bose',
    'Aakash Shah', 'Deepa Krishnan', 'Rajesh Iyer', 'Meera Saxena',
  ];

  const leadsData = names.map((name, i) => ({
    name,
    email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
    status: statuses[i % statuses.length],
    source: sources[i % sources.length],
    notes: i % 3 === 0 ? `Interested in enterprise plan. Follow up scheduled.` : undefined,
    createdBy: i % 3 === 0 ? admin._id : sales._id,
    createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
  }));

  await Lead.insertMany(leadsData);

  console.log('✅ Seed complete!');
  console.log('👤 Admin: admin@smartleads.com / admin123');
  console.log('👤 Sales: sales@smartleads.com / sales123');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

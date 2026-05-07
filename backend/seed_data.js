import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PhishingDataset from './models/PhishingDataset.js';
import { connectDB } from './config/db.js';

dotenv.config();

const sampleMessages = [
  {
    message_content: JSON.stringify({
      from: "security@paypal-verify-account.com",
      subject: "URGENT: Action Required on your account",
      body: "Dear Customer,\n\nWe noticed unusual activity on your account. To prevent immediate suspension, please verify your identity by clicking the secure link below.\n\nhttp://secure-login.paypal-verify.com/auth\n\nFailure to do so within 24 hours will result in permanent account closure.\n\nRegards,\nSecurity Team"
    }),
    label: "phishing",
    extracted_features: { has_urls: true, urgent_words: true }
  },
  {
    message_content: JSON.stringify({
      from: "support@github.com",
      subject: "[GitHub] A new device has been added to your account",
      body: "Hi there,\n\nA new device (Chrome on Mac OS X) was just added to your GitHub account. If this was you, you can safely ignore this email.\n\nIf this wasn't you, please reset your password immediately at https://github.com/settings/security.\n\nThanks,\nThe GitHub Team"
    }),
    label: "safe",
    extracted_features: { has_urls: true, urgent_words: false }
  },
  {
    message_content: JSON.stringify({
      from: "IT-Support@company-portal-login.net",
      subject: "Mandatory Office 365 Password Update",
      body: "All employees,\n\nDue to a recent security update, your Office 365 password expires today. Please log in to the portal below to retain your email access.\n\nhttp://office365-secure-update-portal.com/login\n\nIT Helpdesk"
    }),
    label: "phishing",
    extracted_features: { has_urls: true, urgent_words: true }
  },
  {
    message_content: JSON.stringify({
      from: "no-reply@amazon.com",
      subject: "Your Amazon.com order of 'Sony WH-1000XM4' has shipped!",
      body: "Hi,\n\nGreat news! Your order is on its way. You can track your package here: https://amazon.com/orders/track/123456\n\nThank you for shopping with us.\n\nAmazon.com"
    }),
    label: "safe",
    extracted_features: { has_urls: true, urgent_words: false }
  },
  {
    message_content: JSON.stringify({
      from: "admin@netflix-billing-update.com",
      subject: "Payment Declined - Update your payment method",
      body: "Hi Customer,\n\nWe were unable to process your last payment. Your Netflix subscription will be cancelled in 48 hours unless you update your billing information.\n\nUpdate here: http://netflix-billing-update.com/payment\n\nThe Netflix Team"
    }),
    label: "phishing",
    extracted_features: { has_urls: true, urgent_words: true }
  }
];

const seedDB = async () => {
  try {
    await connectDB();
    
    console.log('Clearing old dataset...');
    await PhishingDataset.deleteMany({});
    
    console.log('Seeding new questions...');
    await PhishingDataset.insertMany(sampleMessages);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();

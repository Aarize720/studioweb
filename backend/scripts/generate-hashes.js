/**
 * Script pour générer les hashes bcrypt
 */

const bcrypt = require('bcryptjs');

async function generateHashes() {
  const adminHash = await bcrypt.hash('Admin123!', 10);
  const clientHash = await bcrypt.hash('Client123!', 10);

  console.log('Admin hash (Admin123!):', adminHash);
  console.log('Client hash (Client123!):', clientHash);
}

generateHashes();
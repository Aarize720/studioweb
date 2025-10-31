/**
 * Script pour corriger les mots de passe des utilisateurs de test
 */

const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function fixPasswords() {
  try {
    console.log('🔧 Correction des mots de passe...\n');

    // Générer les vrais hashes
    const adminHash = await bcrypt.hash('Admin123!', 10);
    const clientHash = await bcrypt.hash('Client123!', 10);

    console.log('✅ Hashes générés');

    // Mettre à jour les utilisateurs admin
    await pool.query(
      `UPDATE users SET password = $1 WHERE email IN ('admin@horizonstudio.com', 'manager@horizonstudio.com')`,
      [adminHash]
    );
    console.log('✅ Mots de passe admin mis à jour (Admin123!)');

    // Mettre à jour les utilisateurs clients
    await pool.query(
      `UPDATE users SET password = $1 WHERE role = 'client'`,
      [clientHash]
    );
    console.log('✅ Mots de passe clients mis à jour (Client123!)');

    // Afficher les identifiants
    console.log('\n📋 Identifiants de connexion:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Super Admin:');
    console.log('   Email: admin@horizonstudio.com');
    console.log('   Mot de passe: Admin123!');
    console.log('');
    console.log('👤 Manager:');
    console.log('   Email: manager@horizonstudio.com');
    console.log('   Mot de passe: Admin123!');
    console.log('');
    console.log('👤 Client 1:');
    console.log('   Email: client@example.com');
    console.log('   Mot de passe: Client123!');
    console.log('');
    console.log('👤 Client 2:');
    console.log('   Email: sophie@example.com');
    console.log('   Mot de passe: Client123!');
    console.log('');
    console.log('👤 Client 3:');
    console.log('   Email: pierre@example.com');
    console.log('   Mot de passe: Client123!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    console.log('\n✅ Tous les mots de passe ont été corrigés!');
    console.log('🚀 Vous pouvez maintenant vous connecter avec ces identifiants.\n');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    await pool.end();
    process.exit(1);
  }
}

fixPasswords();
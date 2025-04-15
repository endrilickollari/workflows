// /**
//  * Database diagnosis tool - helps debug data type issues
//  */
// import { db } from '../db';
// import { sql } from 'drizzle-orm';

// /**
//  * Print detailed information about the database schema and contents
//  */
// export async function diagnoseBetterAuthDb(): Promise<void> {
//   console.log('Checking database structure:');
  
//   try {
//     // Check BetterAuth tables with the standard table names
//     const betterAuthTables = ['user', 'session', 'account', 'verification'];
    
//     for (const tableName of betterAuthTables) {
//       console.log(`\nExamining ${tableName}:`);
      
//       try {
//         // Count rows
//         const result = await db.execute(sql`SELECT COUNT(*) as count FROM ${sql.identifier(tableName)}`);
//         console.log(`Table ${tableName} has ${result[0].count} rows`);
        
//         // Sample data
//         if (result[0].count > 0) {
//           const rows = await db.execute(sql`SELECT * FROM ${sql.identifier(tableName)} LIMIT 3`);
//           console.log(`Sample data from ${tableName}:`);
//           console.log(rows);
//         }
//       } catch (error) {
//         console.error(`Error examining table ${tableName}:`, error);
//       }
//     }
//   } catch (error) {
//     console.error('Error during database diagnosis:', error);
//   }
// }

// // If run directly, execute the diagnosis
// if (import.meta.main) {
//   console.log('Running database diagnosis...');
//   diagnoseBetterAuthDb()
//     .then(() => console.log('\nDiagnosis complete'))
//     .catch(err => console.error('Diagnosis failed:', err));
// }

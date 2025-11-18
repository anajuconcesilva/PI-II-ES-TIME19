// Conexão do banco feita pela Sofia de Sousa

import mysql from 'mysql2/promise';

// Criando pool de conexão (não usar pool.end() no backend)
export const pool = mysql.createPool({
  host: 'localhost',       // Servidor MySQL local
  port: 3306,              // Porta padrão do MySQL
  user: 'root',            // Usuário padrão do XAMPP
  password: '',            // Normalmente root não tem senha no XAMPP
  database: 'projetonotadez'
});

// Função opcional para testar a conexão
// NÃO FECHA o pool — apenas testa
export async function testarConexao() {
  try {
    const [rows] = await pool.query('SELECT NOW() AS data_atual');
    console.log('Conexão bem-sucedida!');
    console.log('Data e hora no MySQL:', (rows as any)[0].data_atual);
  } catch (erro) {
    console.error('Erro ao conectar no banco:', erro);
  }
}

export default pool;

// Conexão do banco feita pela Sofia de Sousa 

//Possibilita trabalhar com função async com o mysql

const mysql = require('mysql2/promise');

// Conexão Banco de Dados
  // Primeira coisa a se fazer é abaixar no terminal a dependencia npm install mysql2


  export const pool = mysql.createPool({
    host: '127.0.0.1',  // Padrão não mudar
    port: 3306,         // Porta padrão do mySql
    user: 'root',   // Aqui mudamos para o usuário do banco de dados mySql
    password: '9128',   // Aqui inserimos a senha
    database: 'ProjetoNotaDez' // Por ser da faculdade, o database é o nome de usuario
  });

  export async function testarConexao() {
    try {
      // Testa uma query simples
      const [rows] = await pool.query('SELECT NOW() AS data_atual');
      console.log('Conexão bem-sucedida!');
      console.log('Data e hora no MySQL:', rows[0].data_atual);
      
    } catch (erro: unknown) {
      if (erro instanceof Error) {
        console.error('Erro ao conectar no banco:', erro.message);
      } else {
        console.error('Erro ao conectar no banco:', erro);
      }
    } finally {
      // Fecha todas as conexões do pool
      await pool.end();
    }
  }

  export default pool;

// electron/rouletteService.js

/**
 * Cria as tabelas necessárias para a roleta de prêmios
 * @param {Object} db - Instância do banco de dados SQLite
 */
function createRouletteTables(db) {
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject(new Error('Database instance is required'));
    }
    
    db.serialize(() => {
      // Tabela de prêmios da roleta
      const createPrizesTable = `
        CREATE TABLE IF NOT EXISTS roulette_prizes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          image_url TEXT NOT NULL,
          color TEXT DEFAULT '#FF6B35',
          probability INTEGER DEFAULT 25,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Tabela de giros realizados (vincula lead com prêmio ganho)
      const createSpinsTable = `
        CREATE TABLE IF NOT EXISTS lead_spins (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          lead_id INTEGER NOT NULL,
          prize_id INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (lead_id) REFERENCES leads (id),
          FOREIGN KEY (prize_id) REFERENCES roulette_prizes (id)
        )
      `;

      let tablesCreated = 0;
      const totalTables = 2;

      db.run(createPrizesTable, (err) => {
        if (err) {
          console.error('❌ Erro ao criar tabela roulette_prizes:', err.message);
          return reject(err);
        }
        console.log('✅ Tabela roulette_prizes verificada/criada.');
        tablesCreated++;
        if (tablesCreated === totalTables) {
          resolve();
        }
      });

      db.run(createSpinsTable, (err) => {
        if (err) {
          console.error('❌ Erro ao criar tabela lead_spins:', err.message);
          return reject(err);
        }
        console.log('✅ Tabela lead_spins verificada/criada.');
        tablesCreated++;
        if (tablesCreated === totalTables) {
          resolve();
        }
      });
    });
  });
}

/**
 * Popula a tabela de prêmios com dados iniciais
 * @param {Object} db - Instância do banco de dados SQLite
 */
function seedPrizes(db) {
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject(new Error('Database instance is required'));
    }

    // Verifica se já existem prêmios
    db.get('SELECT COUNT(*) as count FROM roulette_prizes', [], (err, row) => {
      if (err) {
        console.error('❌ Erro ao verificar prêmios:', err.message);
        return reject(err);
      }

      if (row && row.count > 0) {
        console.log(`ℹ️  Já existem ${row.count} prêmio(s) cadastrados. Pulando seed.`);
        return resolve();
      }

      // Prêmios de exemplo com imagens placeholder
      const defaultPrizes = [
        {
          name: 'Cupom 10% OFF',
          image_url: 'https://via.placeholder.com/150/FF6B35/FFFFFF?text=10%25+OFF',
          color: '#FF6B35',
          probability: 35
        },
        {
          name: 'Brinde Exclusivo',
          image_url: 'https://via.placeholder.com/150/004E89/FFFFFF?text=Brinde',
          color: '#004E89',
          probability: 30
        },
        {
          name: 'Cupom 20% OFF',
          image_url: 'https://via.placeholder.com/150/F7931E/FFFFFF?text=20%25+OFF',
          color: '#F7931E',
          probability: 20
        },
        {
          name: 'Produto Premium',
          image_url: 'https://via.placeholder.com/150/28A745/FFFFFF?text=Premium',
          color: '#28A745',
          probability: 10
        },
        {
          name: 'Super Prêmio',
          image_url: 'https://via.placeholder.com/150/DC3545/FFFFFF?text=Super',
          color: '#DC3545',
          probability: 5
        }
      ];

      const sql = `INSERT INTO roulette_prizes (name, image_url, color, probability) VALUES (?, ?, ?, ?)`;
      let inserted = 0;

      defaultPrizes.forEach((prize) => {
        db.run(sql, [prize.name, prize.image_url, prize.color, prize.probability], function(err) {
          if (err) {
            console.error('❌ Erro ao inserir prêmio:', err.message);
            return reject(err);
          }
          inserted++;
          console.log(`✅ Prêmio "${prize.name}" inserido com sucesso!`);
          
          if (inserted === defaultPrizes.length) {
            console.log(`🎉 ${inserted} prêmios inseridos com sucesso!`);
            resolve();
          }
        });
      });
    });
  });
}

/**
 * Salva o resultado de um giro da roleta
 * @param {Object} db - Instância do banco de dados SQLite
 * @param {number} leadId - ID do lead que girou a roleta
 * @param {number} prizeId - ID do prêmio ganho
 */
function saveSpinResult(db, leadId, prizeId) {
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject(new Error('Database instance is required'));
    }

    const sql = `INSERT INTO lead_spins (lead_id, prize_id) VALUES (?, ?)`;
    
    db.run(sql, [leadId, prizeId], function(err) {
      if (err) {
        console.error('❌ Erro ao salvar resultado do giro:', err.message);
        return reject(err);
      }

      console.log(`✅ Giro salvo: Lead ${leadId} ganhou o prêmio ${prizeId}`);
      
      // Atualiza o campo prize_won na tabela leads
      const updateLeadSql = `
        UPDATE leads 
        SET prize_won = (SELECT name FROM roulette_prizes WHERE id = ?)
        WHERE id = ?
      `;
      
      db.run(updateLeadSql, [prizeId, leadId], function(err) {
        if (err) {
          console.error('❌ Erro ao atualizar lead com prêmio:', err.message);
          return reject(err);
        }
        
        resolve({
          id: this.lastID,
          leadId,
          prizeId
        });
      });
    });
  });
}

/**
 * Busca todos os prêmios disponíveis
 * @param {Object} db - Instância do banco de dados SQLite
 */
function getAllPrizes(db) {
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject(new Error('Database instance is required'));
    }

    const sql = `SELECT * FROM roulette_prizes ORDER BY probability DESC`;
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('❌ Erro ao buscar prêmios:', err.message);
        return reject(err);
      }

      resolve(rows);
    });
  });
}

/**
 * Busca um prêmio aleatório baseado nas probabilidades
 * @param {Object} db - Instância do banco de dados SQLite
 */
function getRandomPrize(db) {
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject(new Error('Database instance is required'));
    }

    const sql = `SELECT * FROM roulette_prizes`;
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('❌ Erro ao buscar prêmios:', err.message);
        return reject(err);
      }

      if (!rows || rows.length === 0) {
        return reject(new Error('Nenhum prêmio cadastrado'));
      }

      // Calcula o prêmio baseado nas probabilidades
      const totalProbability = rows.reduce((sum, prize) => sum + prize.probability, 0);
      const random = Math.random() * totalProbability;
      
      let accumulated = 0;
      for (const prize of rows) {
        accumulated += prize.probability;
        if (random <= accumulated) {
          resolve(prize);
          return;
        }
      }

      // Fallback: retorna o último prêmio
      resolve(rows[rows.length - 1]);
    });
  });
}

/**
 * Inicializa o sistema de roleta (cria tabelas e popula com dados iniciais)
 * @param {Object} db - Instância do banco de dados SQLite
 */
async function initRouletteSystem(db) {
  try {
    if (!db) {
      throw new Error('Database instance is required');
    }
    await createRouletteTables(db);
    await seedPrizes(db);
    console.log('🎰 Sistema de roleta inicializado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inicializar sistema de roleta:', error);
    throw error;
  }
}

module.exports = {
  createRouletteTables,
  seedPrizes,
  saveSpinResult,
  getAllPrizes,
  getRandomPrize,
  initRouletteSystem
};


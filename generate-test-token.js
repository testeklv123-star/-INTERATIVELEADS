const { signAccessToken } = require('./src/utils/jwt');
const token = signAccessToken({ sub: '1', tenantId: 'test-tenant', role: 'admin' });
console.log('TOKEN DE TESTE:', token);

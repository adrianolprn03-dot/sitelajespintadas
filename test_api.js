const http = require('http');

const data = JSON.stringify({
  cpf: "999.888.777-66",
  avaliacaoGestao: 5,
  avaliacaoOuvidoria: 5,
  satisfacaoTransparencia: 5,
  avaliacaoLixo: 5,
  avaliacaoLimpezaRuas: 5,
  avaliacaoPatrimonio: 5,
  avaliacaoPracas: 5,
  avaliacaoCultura: 5,
  avaliacaoIluminacao: 5,
  avaliacaoSeguranca: 5,
  avaliacaoEsporte: 5,
  avaliacaoSaude: 5,
  avaliacaoEducacao: 5,
  avaliacaoAssistenciaSocial: 5
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/pesquisa-satisfacao',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();

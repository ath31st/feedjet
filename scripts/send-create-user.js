#!/usr/bin/env node
import http from 'node:http';

const payload = JSON.stringify({
  login: 'admin',
  password: '1234',
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/trpc/user.create',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
  },
  timeout: 10000,
};

const req = http.request(options, (res) => {
  let data = '';
  res.setEncoding('utf8');
  res.on('data', (chunk) => { data += chunk });
  res.on('end', () => {
    console.log('status', res.statusCode);
    try {
      console.log(JSON.stringify(JSON.parse(data), null, 2));
    } catch {
      console.log(data);
    }
  });
});

req.on('error', (err) => {
  console.error('request error:', err.message || err);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('request timeout');
  req.destroy();
  process.exit(1);
});

req.write(payload);
req.end();

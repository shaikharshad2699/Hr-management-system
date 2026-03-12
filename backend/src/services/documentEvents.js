const clients = new Set();

const SSE_HEADERS = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache, no-transform',
  Connection: 'keep-alive',
  'X-Accel-Buffering': 'no',
};

const writeEvent = (res, event, data) => {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
};

const addClient = (res) => {
  Object.entries(SSE_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (typeof res.flushHeaders === 'function') {
    res.flushHeaders();
  }

  res.write(': connected\n\n');
  clients.add(res);
};

const removeClient = (res) => {
  clients.delete(res);
};

const broadcast = (event, data) => {
  for (const client of clients) {
    writeEvent(client, event, data);
  }
};

module.exports = {
  addClient,
  removeClient,
  broadcast,
  writeEvent,
};

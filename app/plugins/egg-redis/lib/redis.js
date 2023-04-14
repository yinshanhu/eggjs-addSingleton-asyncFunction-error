'use strict';

const assert = require('assert');
const awaitFirst = require('await-first');
const axios = require('axios');

module.exports = app => {
  app.addSingleton('redis', createClient);
};

let count = 0;
async function createClient(config, app) {

  console.log(11111111111111111111111111111111111111111, axios.get)

  try {
    await axios.get(`http://apis.juhe.cn/cook/query?key=&menu=%E8%A5%BF%E7%BA%A2%E6%9F%BF&rn=10&pn=3`).catch((e) => {
      console.log('>>>>>>>>2222>>>>>>>', e)
    });

  } catch (err) {
    console.log('>>>>>>>>>>>>>>>', err)
  }

  console.log(222222222222222222222222222222222222222222)
  const Redis = app.config.redis.Redis || require('ioredis');
  let client;

  console.log('==========================', config.cluster, config.sentinels)

  if (config.cluster === true) {
    assert(config.nodes && config.nodes.length !== 0, '[egg-redis] cluster nodes configuration is required when use cluster redis');

    config.nodes.forEach(client => {
      assert(client.host && client.port && client.password !== undefined && client.db !== undefined,
        `[egg-redis] 'host: ${client.host}', 'port: ${client.port}', 'password: ${client.password}', 'db: ${client.db}' are required on config`);
    });
    app.coreLogger.info('[egg-redis] cluster connecting');




    // let { appName } = app.config;
    // const { res } = await app.curl(`${app.config.tcConfUrl}/TCBase.Cache.v2`, {
    //   method: 'GET',
    //   contentType: 'json',
    //   headers: {
    //     Authorization: `Basic ${Buffer.from(`${appName}:${appName}`, 'ascii').toString('base64')}`,
    //   },
    //   dataType: 'json',
    // })

    // const { instances } = res.data && res.data.length && res.data[0];
    // let nodeList = [];

    // instances.map((item) => {
    //   let ip = item.ip && item.ip.split(':');
    //   let nodeLi = {
    //     host: ip[0],
    //     port: ip.length > 1 ? ip[1] : 0,
    //     password: '',
    //     db: 0
    //   }
    //   nodeList.push(nodeLi);
    // })

    // console.log(nodeList)





    client = new Redis.Cluster(config.nodes, config);
  }

  client.on('connect', () => {
    app.coreLogger.info('[egg-redis] client connect success');
  });
  client.on('error', err => {
    app.coreLogger.error('[egg-redis] client error: %s', err);
    app.coreLogger.error(err);
  });

  app.beforeStart(async () => {
    const index = count++;
    if (config.weakDependent) {
      app.coreLogger.info(`[egg-redis] instance[${index}] is weak dependent and won't block app start`);
      client.once('ready', () => {
        app.coreLogger.info(`[egg-redis] instance[${index}] status OK`);
      });
      return;
    }

    await awaitFirst(client, ['ready', 'error']);
    app.coreLogger.info(`[egg-redis] instance[${index}] status OK, client ready`);
  });

  return client;
}

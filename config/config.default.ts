import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1681383885658_2238';

  // add your egg config in here
  config.middleware = [];

  // add your special config in here
  const bizConfig = {};

  // config.redis = {
  //   client: {}
  // }
  config.redis = {
    client: {
      cluster: true,
      nodes: [
        { host: '127.0.0.1', port: 6379, password: '', db: 0 },
        { host: '127.0.0.1', port: 11281, password: '', db: 0 },
        { host: '127.0.0.1', port: 11476, password: '', db: 0 },
        { host: '127.0.0.1', port: 11190, password: '', db: 0 },
        { host: '127.0.0.1', port: 10805, password: '', db: 0 },
        { host: '127.0.0.1', port: 10883, password: '', db: 0 }
      ]
      

    },
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};

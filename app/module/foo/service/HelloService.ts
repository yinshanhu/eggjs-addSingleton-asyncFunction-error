import { EggLogger } from 'egg';
import { SingletonProto, AccessLevel, Inject } from '@eggjs/tegg';
import type { Redis } from 'ioredis';

@SingletonProto({
  // 如果需要在上层使用，需要把 accessLevel 显示声明为 public
  accessLevel: AccessLevel.PUBLIC,
})
export class HelloService {
  // 注入一个 logger
  @Inject()
  logger: EggLogger;

  @Inject()
  redis: Redis

  // 封装业务
  async hello(userId: string): Promise<string> {

    console.log(this.redis)
    const result = { userId, handledBy: 'foo module' };
    this.logger.info('[hello] get result: %j', result);
    return `hello, ${result.userId}`;
  }
}

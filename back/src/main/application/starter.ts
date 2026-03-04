import { loadConfig } from './config'
import { AwilixIocContainer } from './ioc/awilix/awilix-ioc-container'
import '../utils/date'
import type { Config } from '../types/application/config'
import type { IocContainer } from '../types/application/ioc'

const startIocContainer = (config: Config): AwilixIocContainer => {
  return new AwilixIocContainer(config)
}

const startApp = async (): Promise<IocContainer> => {
  const config = loadConfig()
  const iocContainer = startIocContainer(config)
  const { httpServer } = iocContainer.instances

  await httpServer.configure()
  await httpServer.start()

  return iocContainer.instances
}

export { startApp, startIocContainer }

import { startApp } from './application/starter'

const bootstrap = async (): Promise<void> => {
  try {
    await startApp()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

void bootstrap()

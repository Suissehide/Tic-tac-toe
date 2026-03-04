export const toLocalhostIfLinux = (address: string): string =>
  process.platform === 'linux'
    ? address.replace('127.0.0.1', 'localhost').replace('0.0.0.0', 'localhost')
    : address

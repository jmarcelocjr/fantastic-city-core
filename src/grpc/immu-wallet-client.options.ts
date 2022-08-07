import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const immuWalletClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: process.env.GRPC_URL,
    package: 'immuWallet',
    credentials: null,
    loader: { keepCase: true },
    protoPath: join(__dirname, '/../../proto/immu-wallet.proto')
  },
};
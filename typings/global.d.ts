// @see why export {} is needed https://stackoverflow.com/questions/42233987/how-to-configure-custom-global-interfaces-d-ts-files-for-typescript/42257742#42257742
// export {}

// declare global {
//   interface Window {
//     __APOLLO_STATE__?: any
//   }
// }

import { GraphQLOperation } from 'graphql-upload'
import { IncomingMessage } from 'http'

declare module 'next' {
  export interface NextApiRequest extends IncomingMessage {
    filePayload: GraphQLOperation | GraphQLOperation[]
  }
}

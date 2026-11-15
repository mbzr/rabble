import 'server-only'
import Mux from '@mux/ts'
import { env } from '@/env'

const mux = new Mux({
  jwtSigningKey: env.MUX_SIGNING_KEY,
  jwtPrivateKey: env.MUX_PRIVATE_KEY,
})

export interface PlaybackTokens {
  playback: string
  thumbnail: string
  storyboard: string
}

// generates signed playback tokens for a given playback ID.
// the tokens are valid for 4 hours and can be used to access the video, thumbnail, and storyboard
export const signPlaybackTokens = async (
  playbackId: string,
): Promise<PlaybackTokens> => {
  const sign = (type: 'video' | 'thumbnail' | 'storyboard') =>
    mux.jwt.signPlaybackId(playbackId, { type, expiration: '4h' })

  const [playback, thumbnail, storyboard] = await Promise.all([
    sign('video'),
    sign('thumbnail'),
    sign('storyboard'),
  ])

  return { playback, thumbnail, storyboard }
}

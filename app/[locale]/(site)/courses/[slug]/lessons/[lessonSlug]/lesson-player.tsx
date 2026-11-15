'use client'

import type { PlaybackTokens } from '@/lib/server/mux'
import MuxPlayer from '@mux/mux-player-react'

interface LessonPlayerProps {
  playbackId: string
  tokens: PlaybackTokens
  title: string
}

export const LessonPlayer = ({
  playbackId,
  tokens,
  title,
}: LessonPlayerProps) => (
  <MuxPlayer
    playbackId={playbackId}
    tokens={tokens}
    streamType="on-demand"
    metadata={{
      video_title: title,
    }}
    className="aspect-video w-full overflow-hidden rounded-lg"
  />
)

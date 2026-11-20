'use client'

import type { PlaybackTokens } from '@/lib/server/mux'
import MuxPlayer from '@mux/mux-player-react'
import { useEffect, useEffectEvent, useRef } from 'react'

const SAVE_EVERY_SECONDS = 10

interface LessonPlayerProps {
  lessonId: string
  playbackId: string
  tokens: PlaybackTokens
  title: string
  startSeconds: number
  savesProgress: boolean
}

// keepalive lets the request finish even if the tab closes while it's sending
const sendProgress = (lessonId: string, lastPositionSeconds: number) => {
  fetch('/api/progress', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ lessonId, lastPositionSeconds }),
    keepalive: true,
  }).catch(() => {})
}

export const LessonPlayer = ({
  lessonId,
  playbackId,
  tokens,
  title,
  startSeconds,
  savesProgress,
}: LessonPlayerProps) => {
  const position = useRef(startSeconds)
  const lastSaved = useRef(startSeconds)

  const save = () => {
    if (!savesProgress || position.current === lastSaved.current) return
    lastSaved.current = position.current
    sendProgress(lessonId, position.current)
  }

  const saveOnLeave = useEffectEvent(save)

  // save progress when switching tabs or closing the browser
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') return
      saveOnLeave()
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      saveOnLeave()
    }
  }, [])

  return (
    <MuxPlayer
      playbackId={playbackId}
      tokens={tokens}
      startTime={startSeconds}
      streamType="on-demand"
      metadata={{
        video_title: title,
      }}
      className="w-full overflow-hidden rounded-lg"
      style={{ aspectRatio: '16/9' }}
      onTimeUpdate={(e) => {
        position.current = (e.target as HTMLMediaElement).currentTime
        if (position.current - lastSaved.current >= SAVE_EVERY_SECONDS) {
          save()
        }
      }}
      onPause={() => save()}
      onEnded={(event) => {
        // save the full duration of the video when it ends
        position.current = (event.target as HTMLMediaElement).duration
        save()
      }}
    />
  )
}

import { NextApiRequest, NextApiResponse } from 'next'

import { callVimeoApi } from '@/lib/vimeo/client'

async function coursesHandler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      try {
        const { name } = req.body
        const createCourseRequest = await callVimeoApi('/me/projects', {
          method: 'POST',
          params: {
            name,
          },
        })

        if (createCourseRequest) {
          res.status(createCourseRequest.status).send(createCourseRequest.data)
        }
      } catch (error: any) {
        res.status(error.code).send({ error: error.message })
      }
      break
    default:
      res.status(500).end()
      break
  }
}

export default coursesHandler

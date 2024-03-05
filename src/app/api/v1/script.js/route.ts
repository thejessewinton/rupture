import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { db } from '~/server/db'
import { apiKeys } from '~/server/db/schema'

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  console.log(token)

  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 })
  }

  const team = await db.query.apiKeys.findFirst({
    where: eq(apiKeys.key, token),
    with: {
      team: {
        with: {
          subscription: true
        }
      }
    }
  })

  if (!team) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return new NextResponse(
    `
      alert('Hello, ${team.team.name}!');
  `,
    {
      headers: {
        'Content-Type': 'application/javascript'
        // 'Cache-Control': 'public, immutable, no-transform, s-maxage=31536000, max-age=31536000'
      }
    }
  )
}

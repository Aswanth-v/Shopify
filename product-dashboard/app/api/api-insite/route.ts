import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { analyticsData } = await req.json()

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const message = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 400,
    messages: [{
      role: 'user',
      content: `You are an analytics assistant. Analyze this product dashboard usage data and give a short 3-sentence insight about user behavior patterns, most popular products, and recommendations:

Data: ${JSON.stringify(analyticsData)}

Keep it concise and actionable.`
    }]
  })

  const insight = (message.content[0] as { type: string; text: string }).text
  return NextResponse.json({ insight })
}
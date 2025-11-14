import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Home() {
  const cookieStore = await cookies()
  const tokenCookie = cookieStore.get('access_token')
  const token = tokenCookie?.value ?? null

  if (token) {
    redirect('/admin')
  }

  redirect('/login')
}

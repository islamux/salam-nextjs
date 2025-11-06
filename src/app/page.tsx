// Root page - redirects to home
import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to home page
  redirect('/home');
}

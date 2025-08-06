import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

async function fetchProtectedData() {
  const { data: { session } } = await supabase.auth.getSession();

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/protected-route`, {
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
}

export function useProtectedData() {
  return useQuery({
    queryKey: ['protected-data'],
    queryFn: fetchProtectedData,
    enabled: !!supabase.auth.getSession(),
  });
}

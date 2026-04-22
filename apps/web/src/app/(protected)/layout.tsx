'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/axios';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/modules/auth/stores/useAuthStore';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get('/users/me');
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        const currentUrl =
          pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
        localStorage.setItem('indend_url', currentUrl);
        router.replace('/login');
      }
    };

    fetchUser();
  }, [router, pathname, searchParams, setUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}

'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/modules/auth/stores/useAuthStore';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get('/users/me');
        setUser(response.data);

        const returnUrl = localStorage.getItem('indend_url');
        if (returnUrl && returnUrl.startsWith('/')) {
          localStorage.removeItem('indend_url');
          router.replace(returnUrl);
        } else {
          router.replace('/');
        }
      } catch (err) {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router, setUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}

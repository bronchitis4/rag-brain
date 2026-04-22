'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AUTH_ENDPOINTS, AUTH_TEXTS } from '../utils/auth.constants';
import { IconBrandGoogle } from '@tabler/icons-react';
import { Loader2 } from 'lucide-react';

export function GoogleAuthButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    window.location.href = AUTH_ENDPOINTS.GOOGLE_LOGIN;
  };

  return (
    <Button variant="outline" className="w-full" onClick={handleLogin} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <IconBrandGoogle className="mr-2 h-4 w-4" />
      )}
      {AUTH_TEXTS.LOGIN_BUTTON}
    </Button>
  );
}

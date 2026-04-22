import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleAuthButton } from './google-auth-button';
import { AUTH_TEXTS } from '../utils/auth.constants';

export function LoginCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{AUTH_TEXTS.LOGIN_TITLE}</CardTitle>
        <CardDescription>{AUTH_TEXTS.LOGIN_DESCRIPTION}</CardDescription>
      </CardHeader>
      <CardContent>
        <GoogleAuthButton />
      </CardContent>
    </Card>
  );
}

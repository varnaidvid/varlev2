'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleNotch } from '@phosphor-icons/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { ChangeEvent, MouseEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const SignInPage = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleInputChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  function onSubmit(event: any) {
    setIsLoading(true);
    toast.loading('Bejelentkezés folyamatban...', {
      id: 'signin',
    });

    event.preventDefault();
    event.stopPropagation();

    signIn('credentials', {
      username: formData.username,
      password: formData.password,
      callbackUrl: '/',
      redirect: false,
    }).then((result) => {
      if (result && result.error !== null) {
        if (result.status === 401) {
          setIsLoading(false);
          toast.error('Hibás felhasználónév vagy jelszó', {
            id: 'signin',
            duration: 5000,
          });
        } else {
          setIsLoading(false);
          toast.error('Hiba történt a bejelentkezés során', {
            id: 'signin',
            duration: 5000,
          });
        }
      } else {
        setIsLoading(false);
        toast.success('Sikeres bejelentkezés', {
          id: 'signin',
          duration: 5000,
        });
        router.push('/');
      }
    });
  }

  return (
    <div className="grid min-h-screen place-items-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Bejelentkezés</CardTitle>
          <CardDescription>
            Add meg a felhasználóneved és a jelszavad belépéshez
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Felhasználónév</Label>
                <Input
                  id="username"
                  placeholder="Gipsz-Jakab"
                  type="text"
                  name="username"
                  autoCapitalize="none"
                  autoComplete="username"
                  autoCorrect="off"
                  required
                  disabled={isLoading}
                  value={formData.username}
                  onChange={handleInputChanged}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Jelszó</Label>
                <Input
                  id="password"
                  placeholder="********"
                  type="password"
                  name="password"
                  autoCapitalize="none"
                  autoComplete="password"
                  autoCorrect="off"
                  required
                  disabled={isLoading}
                  value={formData.password}
                  onChange={handleInputChanged}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button disabled={isLoading} className="w-full">
              {isLoading && (
                <CircleNotch className="mr-2 h-4 w-4 animate-spin" />
              )}
              Bejelentkezés
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignInPage;

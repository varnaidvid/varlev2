'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
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
import { ChangeEvent, MouseEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const SignUpPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: '',
  });

  const handleInputChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmitted = async (e: MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true);
    toast.loading('Regisztráció folyamatban...', {
      id: 'signup',
    });

    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      setIsLoading(false);

      toast.error('Hiba történt a regisztráció során', {
        id: 'signup',
        duration: 5000,
      });

      return;
    }

    setIsLoading(false);
    toast.success('Sikeres regisztráció!', {
      id: 'signup',
      duration: 5000,
    });
    router.push('/bejelentkezes');
  };

  return (
    <div className="grid min-h-screen place-items-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Regisztráció</CardTitle>
          <CardDescription>Add meg email címed és jelszavad</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  name="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={formData.email}
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
                  disabled={isLoading}
                  value={formData.password}
                  onChange={handleInputChanged}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Jelszó megerősítése</Label>
                <Input
                  id="password2"
                  placeholder="********"
                  type="password"
                  name="password2"
                  autoCapitalize="none"
                  autoComplete="password"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={formData.password2}
                  onChange={handleInputChanged}
                />
              </div>
            </div>
            <Button
              disabled={isLoading}
              className="w-full mt-6"
              onClick={handleFormSubmitted}
            >
              {isLoading && (
                <CircleNotch className="mr-2 h-4 w-4 animate-spin" />
              )}
              Regisztráció
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <span className="text-gray-600">Már van fiókod?</span>
          <Link
            href="/bejelentkezes"
            className="text-blue-600 hover:underline ml-1"
          >
            Jelentkezz be!
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpPage;

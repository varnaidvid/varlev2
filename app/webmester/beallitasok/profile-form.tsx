'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'A felhasználónév legalább 2 karakter hosszú kell legyen.',
    })
    .max(30, {
      message: 'A felhasználónév nem lehet hosszabb 30 karakternél.',
    }),
  email: z
    .string({
      required_error: 'Válaszd ki az email címet a megjelenítéshez.',
    })
    .email(),
  bio: z.string().max(160).min(4),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: 'Kérlek adj meg érvényes URL-t.' }),
      })
    )
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const defaultValues: Partial<ProfileFormValues> = {
  bio: 'Birtokolok egy számítógépet.',
  urls: [
    { value: 'https://shadcn.com' },
    { value: 'http://twitter.com/shadcn' },
  ],
};

export function ProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { fields, append } = useFieldArray({
    name: 'urls',
    control: form.control,
  });

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: 'A következő értékeket küldted el:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Felhasználónév</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                Ez a nyilvános neved. Lehet az igazi neved vagy egy becenév.
                Csak minden 30 napban változtathatod meg.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Válaszd ki a megjelenítendő megerősített email címet" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                A megerősített email címeket a{' '}
                <Link href="/examples/forms">email beállításoknál</Link> tudod
                kezelni.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rövid bemutatkozás</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Mesélj egy kicsit magadról"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                @Megjegyzés segítségével megemlítheted más felhasználókat és
                szervezeteket a hozzászólásaiddal.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && 'sr-only')}>
                    URL-ek
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && 'sr-only')}>
                    Adj hozzá linkeket a weboldaladhoz, blogodhoz vagy közösségi
                    média profiljaidhoz.
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ value: '' })}
          >
            URL hozzáadása
          </Button>
        </div>
        <Button type="submit">Profil frissítése</Button>
      </form>
    </Form>
  );
}

'use client';

import Head from 'next/head';
import Editor from '@/components/TipTap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import * as z from 'zod';
import Tiptap from '@/components/TipTap';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import {
  GearSix,
  CaretRight,
  Gauge,
  Monitor,
  PresentationChart,
} from '@phosphor-icons/react';

export default function BemutatkozoPage() {
  const formSchema = z.object({
    title: z
      .string()
      .min(3, { message: 'Túl rövid.' })
      .max(255, { message: 'Túl hosszú.' }),
    price: z
      .number()
      .min(5, { message: 'Túl rövid.' })
      .max(1000, { message: 'Túl hosszú.' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      price: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // itt mentjük el a db-be
    console.log(values);
  }

  return (
    <main className="mt-32">
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold leading-none tracking-tight mb-2">
          Bemutatkozás szerkeszése
        </h1>

        <div className="flex items-center gap-4">
          <Link href="/vezerlopult">
            <span className="text-sm hover:underline">
              Vissza a vezérlőpulthoz
            </span>
          </Link>
          {/* <Link href="/vezerlopult/regisztracio">
            <Button variant="default">
              {' '}
              <UserCirclePlus className="w-6 h-6 mr-2" color="white" /> Új fiók
              létrehozása
            </Button>
          </Link> */}
        </div>
      </div>

      <span className="leading-none tracking-tight text-base text-gray-500 flex items-center">
        <Link href="/vezerlopult">
          <div className="flex items-center gap-[2px] hover:underline">
            <Gauge className="h-6 w-6" /> Vezérlőpult
          </div>
        </Link>

        <CaretRight className="mx-1 h-4 w-4" />

        <Link href="/vezerlopult/beallitasok">
          <div className="flex items-center gap-[2px] hover:underline">
            <PresentationChart className="h-6 w-6" /> Bemutatkozás
          </div>
        </Link>
      </span>

      <div className="mt-14">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Tiptap
                      description={field.name}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mb-12">Save</Button>
          </form>
        </Form>
      </div>
    </main>
  );
}

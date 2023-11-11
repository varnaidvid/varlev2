'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import toast from 'react-hot-toast';

const items = [
  {
    id: 'recents',
    label: 'Előzmények',
  },
  {
    id: 'home',
    label: 'Főoldal',
  },
  {
    id: 'applications',
    label: 'Alkalmazások',
  },
  {
    id: 'desktop',
    label: 'Asztal',
  },
  {
    id: 'downloads',
    label: 'Letöltések',
  },
  {
    id: 'documents',
    label: 'Dokumentumok',
  },
] as const;

const displayFormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'Legalább egy elemet ki kell választanod.',
  }),
});

type DisplayFormValues = z.infer<typeof displayFormSchema>;

// prisma ???
const defaultValues: Partial<DisplayFormValues> = {
  items: ['recents', 'home'],
};

export function DisplayForm() {
  const form = useForm<DisplayFormValues>({
    resolver: zodResolver(displayFormSchema),
    defaultValues,
  });

  function onSubmit(data: DisplayFormValues) {
    toast.success('Értesítések frissítve.');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Oldalsáv</FormLabel>
                <FormDescription>
                  Válaszd ki azokat az elemeket, amelyeket meg szeretnél
                  jeleníteni az oldalsávban.
                </FormDescription>
              </div>
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Kijelző frissítése</Button>
      </form>
    </Form>
  );
}

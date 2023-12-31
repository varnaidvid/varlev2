'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useContext, useEffect, useState } from 'react';
import { VezerloContext } from '@/app/vezerlopult/layout';

const FormSchema = z.object({
  date: z.date(),
});

export function CalendarForm({
  control,
  name,
  form,
  date,
  setDate,
  label,
  hour,
  setHour,
  minutes,
  setMinutes,
}: {
  control: any;
  name: string;
  form: any;
  date: Date;
  setDate: (date: Date) => void;
  label: string;
  hour: number;
  setHour: (hour: number) => void;
  minutes: number;
  setMinutes: (minutes: number) => void;
}) {
  const { competition } = useContext(VezerloContext);

  const [initialStartDate, setInitialStartDate] = useState<Date>();
  const [initialEndDate, setInitialEndDate] = useState<Date>();

  const [initialStartHour, setInitialStartHour] = useState<number>();
  const [initialStartMinutes, setInitialStartMinutes] = useState<number>();
  const [initialEndHour, setInitialEndHour] = useState<number>();
  const [initialEndMinutes, setInitialEndMinutes] = useState<number>();

  useEffect(() => {
    if (competition) {
      setInitialEndDate(competition?.endDate && new Date(competition.endDate));
      setInitialStartDate(
        competition?.startDate && new Date(competition.startDate)
      );
    }
  }, [competition]);

  useEffect(() => {
    if (initialEndDate && initialStartDate) {
      form.setValue('startDate', initialEndDate);
      form.setValue('endDate', initialStartDate);

      setInitialStartHour(initialStartDate?.getHours());
      setInitialStartMinutes(initialStartDate?.getMinutes());
      setInitialEndHour(initialEndDate?.getHours());
      setInitialEndMinutes(initialEndDate?.getMinutes());
    }
  }, [initialEndDate, initialStartDate]);

  useEffect(() => {
    console.log(
      initialStartHour,
      initialStartMinutes,
      initialEndHour,
      initialEndMinutes
    );
  }, [
    initialStartHour,
    initialStartMinutes,
    initialEndHour,
    initialEndMinutes,
  ]);

  return (
    <FormField
      control={control}
      name={name}
      defaultValue={name === 'startDate' ? initialStartDate : initialEndDate}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>

          <Card className="p-4">
            <div className="flex gap-2 items-center">
              <div>
                <p className="text-sm text-muted-foreground">Nap:</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          <span>{field.value.toLocaleDateString()}</span>
                        ) : (
                          <span>Válassz dátumot</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date.getTime() < new Date().getTime() - 86400000 ||
                        date.getTime() > new Date().getTime() + 31536000000
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Óra:</p>
                <Input
                  onChange={(e) => {
                    if (parseInt(e.target.value) > 23) e.target.value = '23';
                    if (parseInt(e.target.value) < 0) e.target.value = '0';

                    setHour(parseInt(e.target.value));
                  }}
                  type="number"
                  defaultValue={
                    name == 'startDate' ? initialStartHour : initialEndHour
                  }
                  max={23}
                  min={0}
                  placeholder="0"
                  className="w-[100px]"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Perc:</p>
                <Input
                  placeholder="0"
                  defaultValue={
                    name == 'startDate'
                      ? initialStartMinutes
                      : initialEndMinutes
                  }
                  onChange={(e) => {
                    if (parseInt(e.target.value) > 59) e.target.value = '59';
                    if (parseInt(e.target.value) < 0) e.target.value = '0';

                    setMinutes(parseInt(e.target.value));
                  }}
                  type="number"
                  max={59}
                  min={0}
                  className="w-[100px]"
                />
              </div>
            </div>
          </Card>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

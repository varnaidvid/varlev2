'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import MyPieChart from '@/components/Chart';
import parse from 'html-react-parser';
import { getHtmlText } from '@/lib/actions';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import UploadcareImage from '@uploadcare/nextjs-loader';

export default function Home() {
  const { data: session, status } = useSession();

  const getGreeting = () => {
    const currentHour = new Date().getHours();

    switch (true) {
      case currentHour >= 3 && currentHour < 12:
        return 'Jó reggelt!';
      case currentHour >= 12 && currentHour < 18:
        return 'Jó napot!';
      case currentHour >= 18 && currentHour < 22:
        return 'Jó estét!';
      default:
        return 'Jó éjszakát!';
    }
  };

  const [parsedHtml, setParsedHtml] = useState<string>('');
  const [vmi, setVmi] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      const htmlText: string = await getHtmlText();
      const parsed = await parse(htmlText);
      setVmi(parsed);

      setParsedHtml(parsed + '');
    };

    fetchData();
  }, []);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return <main className="container mt-10 overflow-hidden">{vmi}</main>;
}

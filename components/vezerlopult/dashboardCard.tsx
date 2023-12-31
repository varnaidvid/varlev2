import Link from 'next/link';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { List, PlusCircle } from '@phosphor-icons/react';

export default function DashboardCard({
  Icon,
  title,
  description,
  buttonText,
  link,
  secondLink,
  secondLinkText,
  disableCreate,
}: {
  Icon: any;
  title: string;
  description: string;
  buttonText: string;
  link: string;
  secondLink: string;
  secondLinkText: string;
  disableCreate?: boolean;
}) {
  return (
    <Card className="rounded-md h-[300px] hover:shadow-sm transition-all">
      <CardHeader className="h-full flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle>
            <Icon weight="bold" className="h-10 w-10 mb-3" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex gap-2">
          <Link href={link} className="w-full">
            <Button className="w-full font-light" variant={'outline'}>
              <List className="h-6 w-6 mr-1" weight="regular" />
              {buttonText}
            </Button>
          </Link>
          {!disableCreate && (
            <Link href={secondLink} className="w-full">
              <Button className="w-full font-light">
                <PlusCircle className="h-6 w-6 mr-1" weight="regular" />{' '}
                {secondLinkText}
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}

import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

export default function DashboardCard({
  Icon,
  title,
  description,
  buttonText,
  link,
}: {
  Icon: any;
  title: string;
  description: string;
  buttonText: string;
  link: string;
}) {
  return (
    <Link href={link}>
      <Card className="rounded-md h-[400px] hover:bg-accent hover:shadow-sm transition-all">
        <CardHeader className="h-full flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>
              <Icon className="h-8 w-8 mb-4" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div>
            <Button className="w-full font-mono lowercase font-light">
              {buttonText}
            </Button>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}

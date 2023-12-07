import { BarChart } from '@tremor/react';
import { useContext, useEffect, useState } from 'react';
import { VezerloContext } from '../../layout';
import { teacherStatsByYear } from '@/lib/actions';
import { useSession } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const customTooltip = ({ payload, active }: any) => {
  if (!active || !payload) return null;

  return (
    <div className="w-56 rounded-tremor-default text-tremor-default bg-tremor-background p-2 shadow-tremor-dropdown border border-tremor-border">
      {payload.map((category: any, idx: any) => (
        <div key={idx} className="flex flex-1 space-x-2.5">
          <div
            className={`w-1 flex flex-col bg-${category.color}-500 rounded`}
          />
          <div className="space-y-1">
            <p className="text-tremor-content">
              {category.payload.name}. évfolyam
            </p>
            <p className="font-medium text-tremor-content-emphasis">
              {category.value} db
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function TanarForm() {
  const { data: session, status, update } = useSession();

  const { user, setUser, isUserLoading } = useContext(VezerloContext);

  const [teacherStats, setTeacherStats] = useState([]);
  const [isTeacherStatsLoading, setIsTeacherStatsLoading] = useState(false);

  const valueFormatter = (number: any) => `${number}`;

  useEffect(() => {
    const fetchUser = async () => {
      setIsTeacherStatsLoading(true);

      const stats: any = await teacherStatsByYear(user?.username!);

      if (!stats) {
        setIsTeacherStatsLoading(false);
        return;
      } else {
        setTeacherStats(stats);
        setIsTeacherStatsLoading(false);
      }
    };

    if (session?.user.role == 'webmester' && !isTeacherStatsLoading)
      fetchUser();
  }, [session]);

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Évfolyamonkénti statisztika</CardTitle>
          <CardDescription>
            Az adott tanár által feltöltött feladatok száma évfolyamonként
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isTeacherStatsLoading ? (
            <div className="flex justify-center items-center">
              <div className="animate-pulse text-xl font-semibold text-black">
                Keresés alatt..
              </div>
            </div>
          ) : (
            <BarChart
              data={teacherStats}
              index="name"
              categories={['Feladatok száma']}
              colors={['blue']}
              valueFormatter={valueFormatter}
              yAxisWidth={48}
              className="mt-2"
              customTooltip={customTooltip}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}

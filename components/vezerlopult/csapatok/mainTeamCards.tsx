import { useContext } from 'react';
import DashboardCard from '../dashboardCard';
import { FolderPlus, UsersFour } from '@phosphor-icons/react';

export default function MainTeamCards() {
  return (
    <>
      <div className="grid md:grid-cols-2 md:space-x-6 space-x-0 space-y-6 md:space-y-0">
        <DashboardCard
          Icon={FolderPlus}
          title="Csapat létrehozása"
          description="A kártyára kattintva megtalálja a csapatok regisztrációs felületet"
          buttonText="01. létrehozás"
          link="/vezerlopult/csapatok/letrehozas"
        />

        <DashboardCard
          Icon={UsersFour}
          title="Csapatok kezelése"
          description="A kártyára kattintva megtalálja a csapatok kezelői felületet"
          buttonText="02. kezelés"
          link="/vezerlopult/csapatok"
        />
      </div>
    </>
  );
}

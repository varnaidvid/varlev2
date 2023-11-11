import { useContext } from 'react';
import DashboardCard from '../dashboardCard';
import { Flag, UserCirclePlus, UserList } from '@phosphor-icons/react';

export default function MainCompetitonCards() {
  return (
    <>
      <div className="grid md:grid-cols-2 md:space-x-6 space-x-0 space-y-6 md:space-y-0">
        <DashboardCard
          Icon={Flag}
          title="Verseny létrehozása"
          description="A kártyára kattintva megtalálja a versenyek regisztrációs felületet"
          buttonText="01. létrehozás"
          link="/vezerlopult/versenyek/letrehozas"
        />

        <DashboardCard
          Icon={Flag}
          title="Versenyek kezelése"
          description="A kártyára kattintva megtalálja a versenyek kezelői felületet"
          buttonText="02. kezelés"
          link="/vezerlopult/versenyek"
        />
      </div>
    </>
  );
}

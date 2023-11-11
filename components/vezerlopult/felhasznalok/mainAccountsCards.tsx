import { useContext } from 'react';
import DashboardCard from '../dashboardCard';
import { UserCirclePlus, UserList } from '@phosphor-icons/react';

export default function MainAccountsCards() {
  return (
    <>
      <div className="grid md:grid-cols-2 md:space-x-6 space-x-0 space-y-6 md:space-y-0">
        <DashboardCard
          Icon={UserCirclePlus}
          title="Fiók létrehozása"
          description="A kártyára kattintva megtalálja a regisztrációs felületet"
          buttonText="01. létrehozás"
          link="/vezerlopult/regisztracio"
        />

        <DashboardCard
          Icon={UserList}
          title="Fiókok kezelése"
          description="A kártyára kattintva megtalálja a felhasználók kezelői felületet"
          buttonText="02. kezelés"
          link="/vezerlopult/felhasznalok"
        />
      </div>
    </>
  );
}

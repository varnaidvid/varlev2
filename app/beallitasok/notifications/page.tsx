import { Separator } from '@/components/ui/separator';
import { NotificationsForm } from '@/app/beallitasok/notifications/notifications-form';

export default function SettingsNotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Értesítések</h3>
        <p className="text-sm text-muted-foreground">
          Konfiguráld az értesítéseket. Válaszd ki, hogy milyen értesítéseket
          szeretnél kapni.
        </p>
      </div>
      <Separator />
      <NotificationsForm />
    </div>
  );
}

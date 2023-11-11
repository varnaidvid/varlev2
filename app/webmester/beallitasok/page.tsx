import { Separator } from '@/components/ui/separator';
import { ProfileForm } from '@/app/webmester/beallitasok/profile-form';

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profil</h3>
        <p className="text-sm text-muted-foreground">Így fognak mások látni.</p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  );
}

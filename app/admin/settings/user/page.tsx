import { UserSettingsForm } from "../user-settings-form";

export default function AdminUserSettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">User Settings</h1>
        <p className="text-sm text-neutral-500">Manage your account security settings.</p>
      </div>
      <UserSettingsForm />
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import ProfileHero from '../components/profile/ProfileHero';
import AccountInfo from '../components/profile/AccountInfo';
import ConnectedPlatformsList from '../components/profile/ConnectedPlatformsList';
import NotificationPrefs from '../components/profile/NotificationPrefs';
import PlanCard from '../components/profile/PlanCard';
import ActivityFeed from '../components/profile/ActivityFeed';
import EditProfileModal    from '../components/profile/EditProfileModal';
import ChangePasswordModal from '../components/profile/ChangePasswordModal';
import { useProfile } from '../hooks/useProfile';

export default function Profile() {
  const navigate = useNavigate();
  const {
    profile, connectedPlatforms, activity, notifPrefs,
    editOpen, setEditOpen,
    passwordOpen, setPasswordOpen,
    saveProfile, pageRef,
  } = useProfile();

  return (
    <>
      {editOpen && profile && (
        <EditProfileModal
          data={profile}
          onSave={saveProfile}
          onClose={() => setEditOpen(false)}
        />
      )}
      {passwordOpen && (
        <ChangePasswordModal onClose={() => setPasswordOpen(false)} />
      )}

      <div ref={pageRef}>
        <TopBar
          title="Profile"
          subtitle="Account & Settings"
          actions={
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Back
            </button>
          }
        />

        {!profile ? (
          <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-pulse">
            <div className="h-56 rounded-3xl bg-[#F1F5F9] border border-[#0F172A]/10" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="h-64 rounded-3xl bg-[#F1F5F9] border border-[#0F172A]/10" />
                <div className="h-40 rounded-3xl bg-[#F1F5F9] border border-[#0F172A]/10" />
              </div>
              <div className="space-y-8">
                <div className="h-48 rounded-3xl bg-[#F1F5F9] border border-[#0F172A]/10" />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
            <ProfileHero profile={profile} onEdit={() => setEditOpen(true)} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <AccountInfo profile={profile} onEdit={() => setEditOpen(true)} onChangePassword={() => setPasswordOpen(true)} />
                <ConnectedPlatformsList platforms={connectedPlatforms} />
                <NotificationPrefs prefs={notifPrefs} />
              </div>

              <div className="space-y-8">
                <PlanCard />
                <ActivityFeed activity={activity} />

                <div data-section className="surface-card overflow-hidden">
                  <div className="px-6 py-5 border-b border-[#DC2626]/10 bg-[#DC2626]/5">
                    <h3 className="font-headline font-bold text-[#DC2626] flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-[18px]">warning</span>
                      Danger Zone
                    </h3>
                  </div>
                  <div className="p-6 space-y-3">
                    <button className="w-full py-2.5 rounded-xl border border-[#0F172A]/20 text-[#64748B] text-sm hover:border-[#DC2626]/30 hover:text-[#DC2626] transition-all">
                      Deactivate Account
                    </button>
                    <button className="w-full py-2.5 rounded-xl border border-[#DC2626]/25 text-[#DC2626] text-sm hover:bg-[#DC2626]/8 transition-all">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

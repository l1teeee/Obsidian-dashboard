import { useNavigate } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import ProfileHero from '../components/profile/ProfileHero';
import AccountInfo from '../components/profile/AccountInfo';
import ConnectedPlatformsList from '../components/profile/ConnectedPlatformsList';
import NotificationPrefs from '../components/profile/NotificationPrefs';
import PlanCard from '../components/profile/PlanCard';
import ActivityFeed from '../components/profile/ActivityFeed';
import EditProfileModal      from '../components/profile/EditProfileModal';
import AvatarCropModal       from '../components/profile/AvatarCropModal';
import ChangePasswordModal   from '../components/profile/ChangePasswordModal';
import { useProfile } from '../hooks/useProfile';

export default function Profile() {
  const navigate = useNavigate();
  const {
    profile, connectedPlatforms, activity, notifPrefs,
    editOpen, setEditOpen, avatarOpen, setAvatarOpen,
    passwordOpen, setPasswordOpen,
    saveProfile, onAvatarUpdated, pageRef,
  } = useProfile();

  return (
    <>
      {editOpen && profile && (
        <EditProfileModal
          data={profile}
          onSave={saveProfile}
          onClose={() => setEditOpen(false)}
          onChangeAvatar={() => setAvatarOpen(true)}
        />
      )}
      {avatarOpen && (
        <AvatarCropModal
          onSave={onAvatarUpdated}
          onClose={() => setAvatarOpen(false)}
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
              className="flex items-center gap-1.5 text-sm text-[#6B655B] hover:text-[#15140F] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Back
            </button>
          }
        />

        {!profile ? (
          <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-pulse">
            <div className="h-56 rounded-3xl bg-[#EFE9DC] border border-[#15140F]/10" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="h-64 rounded-3xl bg-[#EFE9DC] border border-[#15140F]/10" />
                <div className="h-40 rounded-3xl bg-[#EFE9DC] border border-[#15140F]/10" />
              </div>
              <div className="space-y-8">
                <div className="h-48 rounded-3xl bg-[#EFE9DC] border border-[#15140F]/10" />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
            <ProfileHero profile={profile} onEdit={() => setEditOpen(true)} onChangeAvatar={() => setAvatarOpen(true)} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <AccountInfo profile={profile} onEdit={() => setEditOpen(true)} onChangePassword={() => setPasswordOpen(true)} />
                <ConnectedPlatformsList platforms={connectedPlatforms} />
                <NotificationPrefs prefs={notifPrefs} />
              </div>

              <div className="space-y-8">
                <PlanCard />
                <ActivityFeed activity={activity} />

                <div data-section className="bg-[#EFE9DC] rounded-3xl border border-[#ffb4ab]/10 overflow-hidden">
                  <div className="px-6 py-5 border-b border-[#ffb4ab]/5 bg-[#ffb4ab]/5">
                    <h3 className="font-headline font-bold text-[#ffb4ab] flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-[18px]">warning</span>
                      Danger Zone
                    </h3>
                  </div>
                  <div className="p-6 space-y-3">
                    <button className="w-full py-2.5 rounded-xl border border-[#15140F]/20 text-[#6B655B] text-sm hover:border-[#ffb4ab]/30 hover:text-[#ffb4ab] transition-all">
                      Deactivate Account
                    </button>
                    <button className="w-full py-2.5 rounded-xl border border-[#ffb4ab]/20 text-[#ffb4ab] text-sm hover:bg-[#ffb4ab]/10 transition-all">
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

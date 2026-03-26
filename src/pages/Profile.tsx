import { useNavigate } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import ProfileHero from '../components/profile/ProfileHero';
import AccountInfo from '../components/profile/AccountInfo';
import ConnectedPlatformsList from '../components/profile/ConnectedPlatformsList';
import NotificationPrefs from '../components/profile/NotificationPrefs';
import PlanCard from '../components/profile/PlanCard';
import ActivityFeed from '../components/profile/ActivityFeed';
import EditProfileModal from '../components/profile/EditProfileModal';
import { useProfile } from '../hooks/useProfile';

export default function Profile() {
  const navigate = useNavigate();
  const {
    profile, stats, connectedPlatforms, activity, notifPrefs,
    editOpen, setEditOpen, saveProfile, pageRef,
  } = useProfile();

  return (
    <>
      {editOpen && (
        <EditProfileModal
          data={profile}
          onSave={saveProfile}
          onClose={() => setEditOpen(false)}
        />
      )}

      <div ref={pageRef}>
        <TopBar
          title="Profile"
          subtitle="Account & Settings"
          actions={
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-sm text-[#988d9c] hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Back
            </button>
          }
        />

        <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">

          <ProfileHero profile={profile} stats={stats} onEdit={() => setEditOpen(true)} />

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left col */}
            <div className="lg:col-span-2 space-y-8">
              <AccountInfo profile={profile} onEdit={() => setEditOpen(true)} />
              <ConnectedPlatformsList platforms={connectedPlatforms} />
              <NotificationPrefs prefs={notifPrefs} />
            </div>

            {/* Right col */}
            <div className="space-y-8">
              <PlanCard />
              <ActivityFeed activity={activity} />

              {/* Danger Zone */}
              <div data-section className="bg-[#201f1f] rounded-3xl border border-[#ffb4ab]/10 overflow-hidden">
                <div className="px-6 py-5 border-b border-[#ffb4ab]/5 bg-[#ffb4ab]/5">
                  <h3 className="font-headline font-bold text-[#ffb4ab] flex items-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-[18px]">warning</span>
                    Danger Zone
                  </h3>
                </div>
                <div className="p-6 space-y-3">
                  <button className="w-full py-2.5 rounded-xl border border-[#4c4450]/20 text-[#988d9c] text-sm hover:border-[#ffb4ab]/30 hover:text-[#ffb4ab] transition-all">
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
      </div>
    </>
  );
}

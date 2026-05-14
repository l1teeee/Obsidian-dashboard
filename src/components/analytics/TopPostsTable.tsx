import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import type { TopPost } from '../../domain/entities/Analytics';

interface TopPostsTableProps {
  posts: TopPost[];
}

export default function TopPostsTable({ posts }: TopPostsTableProps) {
  const navigate = useNavigate();

  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-[#1C1814]/5">
      <div className="p-8 border-b border-[#1C1814]/5 flex justify-between items-center">
        <h3 className="text-xl font-headline font-bold tracking-tight text-[#1C1814]">Top Performing Posts</h3>
        <Link to="/posts/88291" className="text-xs font-bold text-[#7DD3C7] flex items-center gap-1 hover:text-[#9ee3db] transition-colors">
          View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="text-[#6A6470] uppercase text-[10px] tracking-widest bg-[#FAF7F2]/50">
            {['Content', 'Platform', 'Reach', 'Likes', 'Comments', 'Engagement'].map(h => (
              <th key={h} className="px-8 py-4 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1C1814]/5">
          {posts.map((post) => (
            <tr
              key={post.id}
              data-table-row
              className="hover:bg-white/5 transition-colors group cursor-pointer"
              onClick={() => navigate('/posts/' + post.id)}
            >
              <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-[#353534]">
                    <img src={post.imageUrl} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1C1814] truncate max-w-[220px] group-hover:text-[#7DD3C7] transition-colors">{post.title}</p>
                    <p className="text-xs text-[#6A6470] font-mono uppercase">POST_ID: {post.id}</p>
                  </div>
                </div>
              </td>
              <td className="px-8 py-5"><span className="material-symbols-outlined text-gray-400">{post.platform}</span></td>
              <td className="px-8 py-5 font-mono text-sm text-[#1C1814]">{post.reach}</td>
              <td className="px-8 py-5 font-mono text-sm text-[#1C1814]">{post.likes}</td>
              <td className="px-8 py-5 font-mono text-sm text-[#1C1814]">{post.comments}</td>
              <td className="px-8 py-5 text-right font-mono text-sm text-[#7DD3C7]">{post.engagement}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import type { TopPost } from '../../domain/entities/Analytics';

interface TopPostsTableProps {
  posts: TopPost[];
}

export default function TopPostsTable({ posts }: TopPostsTableProps) {
  const navigate = useNavigate();

  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-[#4c4450]/5">
      <div className="p-8 border-b border-[#4c4450]/5 flex justify-between items-center">
        <h3 className="text-xl font-headline font-bold tracking-tight text-white">Top Performing Posts</h3>
        <Link to="/posts/88291" className="text-xs font-bold text-[#d394ff] flex items-center gap-1 hover:text-[#ebd6ff] transition-colors">
          View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="text-[#988d9c] uppercase text-[10px] tracking-widest bg-[#1c1b1b]/50">
            {['Content', 'Platform', 'Reach', 'Likes', 'Comments', 'Engagement'].map(h => (
              <th key={h} className="px-8 py-4 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#4c4450]/5">
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
                    <p className="text-sm font-semibold text-white truncate max-w-[220px] group-hover:text-[#d394ff] transition-colors">{post.title}</p>
                    <p className="text-xs text-[#988d9c] font-mono uppercase">POST_ID: {post.id}</p>
                  </div>
                </div>
              </td>
              <td className="px-8 py-5"><span className="material-symbols-outlined text-gray-400">{post.platform}</span></td>
              <td className="px-8 py-5 font-mono text-sm text-white">{post.reach}</td>
              <td className="px-8 py-5 font-mono text-sm text-white">{post.likes}</td>
              <td className="px-8 py-5 font-mono text-sm text-white">{post.comments}</td>
              <td className="px-8 py-5 text-right font-mono text-sm text-[#d394ff]">{post.engagement}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

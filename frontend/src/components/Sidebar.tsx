import avatar from '@src/assets/IMG/touxiang.jpg'

const HOT_TOPICS = ['人工智能', '前端开发', '系统架构', '职业规划', '开源精神', '独立开发']

const EDITOR_PICKS = [
  { title: '从零开始：Java 并发编程实战手册', author: '程序员鱼皮' },
  { title: '深入理解 React 原理与源码', author: '前端小助手' },
  { title: 'MySQL 性能优化的 20 个技巧', author: 'DBA 老张' },
]

export default function Sidebar() {
  return (
    <aside className="space-y-9 pt-2">
      <section>
        <h3 className="mb-4 text-base font-semibold text-gray-900">热门话题</h3>
        <div className="flex flex-wrap gap-2.5">
          {HOT_TOPICS.map((topic) => (
            <button
              key={topic}
              className="rounded border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:text-gray-800"
            >
              {topic}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-base font-semibold text-gray-900">编辑精选</h3>
        <ol className="space-y-4">
          {EDITOR_PICKS.map((item, index) => (
            <li key={item.title} className="flex gap-3">
              <span className="min-w-12 text-4xl font-semibold leading-none text-gray-200">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <p className="text-lg font-semibold leading-7 text-gray-900">{item.title}</p>
                <p className="mt-0.5 text-sm text-gray-500">{item.author}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h3 className="mb-4 text-base font-semibold text-gray-900">关于我们</h3>
        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <div className="flex items-center gap-3">
            <img src={avatar} alt="程序员鱼皮" className="h-14 w-14 rounded-full object-cover" />
            <div>
              <p className="font-semibold text-gray-900">程序员kkk</p>
              <p className="text-sm text-gray-500">全栈开发者 / 火影忍者超影选手</p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-gray-600">编程导航是一个帮助程序员成长的社区，提供优质技术内容与实践项目。</p>
        </div>
      </section>
    </aside>
  )
}

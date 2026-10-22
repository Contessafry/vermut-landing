import type { Guide, GuideUi } from "@/lib/guides";
import { S } from "@/lib/guides";
import { links } from "@/site.config";

const FIRST_LAUNCH = "/zh#first-launch";

const kernelAntiCheat = [
  "使用内核级反作弊的游戏，例如 Valorant、Fortnite 和 Call of Duty，无法通过 Wine 运行，任何 Mac 工具都改变不了这一点。购买前请先在 ",
  { text: "Are We Anti-Cheat Yet?", href: S.aacy.href },
  " 上查询。",
] as const;

export const ui: GuideUi = {
  guides: "指南",
  download: "下载",
  home: "Vermut 首页",
  breadcrumbGuide: "指南",
  downloadLabel: (v) => `下载 Vermut ${v}（.dmg）`,
  firstLaunch: "首次启动指南",
  updated: "更新于 2026 年 10 月 22 日 · Apple 芯片 · macOS 14+",
  compared: "坦诚对比",
  questions: "常见问题",
  sources: "资料来源（2026 年 10 月 22 日核实）",
  tryTitle: "试试 Vermut",
  tryBody: "免费开源。在 Wine 11 上运行 Steam 和 Epic Games（测试版）。需要 Apple 芯片和 macOS 14 或更高版本。",
  moreGuides: "更多指南",
  allGuides: "全部指南",
  readGuide: "阅读指南",
  hub: {
    metaTitle: "指南：在苹果芯片 Mac 上玩 Windows 游戏",
    eyebrow: "指南",
    h1: "在 Mac 上玩 Windows 游戏，实话实说。",
    description: "实用、坦诚的指南，教你在 Apple 芯片 Mac 上玩 Windows 游戏：用 Wine 运行 Steam、Whisky 的替代品，以及不用 CrossOver 的方法。",
    back: "返回 Vermut",
  },
};

export const guides: readonly Guide[] = [
  {
    slug: "run-windows-steam-games-on-apple-silicon",
    label: "在苹果芯片 Mac 上运行 Windows 版 Steam 游戏",
    metaTitle: "如何在 M1、M2、M3、M4 Mac 上玩 Windows 版 Steam 游戏",
    description:
      "借助 Wine、DXMT 和 Rosetta 2，在 Apple 芯片 Mac 上运行 Windows 版 Steam。具体步骤、哪些能玩、哪些不能，以及免费和付费方案。",
    h1: "如何在 Apple 芯片 Mac 上玩 Windows 版 Steam 游戏",
    answer: [
      "把 Windows 版 Steam 安装到 Wine 里：Wine 负责把 Windows 调用转换给 macOS，Rosetta 2 运行 x86 代码，DXMT 之类的图形层把 DirectX 转成 Metal。Vermut 免费帮你完成这些设置：下载 Wine，为 Steam 单独创建一个容器，并启动官方 Steam 客户端。大多数 DirectX 9 到 11 的游戏都能运行；使用内核级反作弊的游戏不行。",
    ],
    sections: [
      {
        id: "why",
        title: "为什么 Mac 版 Steam 不够用",
        body: [
          ["Mac 版 Steam 只显示有 Mac 版本的游戏。一般玩家的 Steam 游戏库里，大部分只有 Windows 版，而 Apple 芯片 Mac 又没有 Boot Camp，所以只能用别的方式运行 Windows 版。"],
          ["在 Apple 芯片 Mac 上，三样东西协同工作：Rosetta 2 运行 x86-64 代码，Wine 提供 Windows API，图形层把 DirectX 转成 Metal。这并不是模拟一整台 PC，所以速度可以很快，但也正因如此，有些游戏会出问题。"],
        ],
      },
      {
        id: "steps",
        title: "用 Vermut 安装 Windows 版 Steam",
        steps: [
          { title: "检查你的 Mac", body: ["你需要一台 Apple 芯片 Mac（M1 或更新），运行 macOS 14 Sonoma 或更高版本，并为 Wine、Steam 和游戏留出数 GB 可用空间。不支持 Intel Mac。"] },
          { title: "下载并打开 Vermut", body: ["从 GitHub 下载 DMG，把 Vermut 拖到“应用程序”文件夹。应用尚未经过公证，所以 macOS 会要求你允许一次：请按照", { text: "首次启动指南", href: FIRST_LAUNCH }, "操作。"] },
          { title: "让 Vermut 准备 Wine", body: ["首次启动时，如果缺少 Rosetta 2，Vermut 会提示安装，并下载约 1 到 2 GB 的 Wine 11 引擎。"] },
          { title: "安装 Steam", body: ["点击 Steam 旁边的 Install。Vermut 会把官方 Steam 安装程序下载到单独的容器中，并完成 Steam 的首次更新。然后用你平时的 Steam 账户登录。"] },
          { title: "安装并开玩", body: ["像在 PC 上一样，从 Steam 客户端安装游戏。已安装的游戏会出现在 Vermut 的游戏库中。"] },
          { title: "游戏出问题？换一个图形后端", body: ["DirectX 10 和 11 默认使用 DXMT。你可以把容器切换到 DXVK、WineD3D，或者在安装了 Apple 的 Game Porting Toolkit 后切换到 D3DMetal。v1.2 测试版还加入了单个游戏的设置。"] },
        ],
      },
      {
        id: "what-works",
        title: "在 Apple 芯片上，哪些能玩，哪些不能",
        bullets: [
          ["通常能玩：DirectX 9、10、11 游戏，以及独立游戏和较老的游戏，它们往往最容易成功。"],
          ["需要额外设置：DirectX 12 游戏需要 Apple 的 D3DMetal，它包含在你从 Apple 下载的 Game Porting Toolkit 中。自带启动器的游戏可能需要反复尝试。"],
          ["无法运行：", ...kernelAntiCheat],
          ["性能取决于游戏和芯片。转换本身有开销：与 GPU 相近的 Windows PC 相比，帧率会更低；第一次编译着色器时也可能出现卡顿。"],
        ],
        body: [["购买游戏前，可以在 ", { text: "CodeWeavers 兼容性数据库", href: S.cxCompat.href }, " 中搜索：CrossOver 基于同样的 Wine，它的报告很有参考价值。"]],
      },
    ],
    compare: {
      caption: "在 Apple 芯片 Mac 上玩 Windows 版 Steam 游戏的方式（2026 年 10 月）",
      columns: ["方案", "价格", "能否运行 Windows 版 Steam 客户端", "主要限制"],
      rows: [
        { label: "Vermut", cells: ["免费，MIT 许可证", "能，自动设置", "新项目；通过 GitHub Issues 获得支持"] },
        { label: "CrossOver", cells: ["74 美元含 12 个月更新；可免费试用 14 天", "能，从安装目录中安装", "付费；支持最完善"] },
        { label: "Whisky", cells: ["免费", "需要自己设置", "2025 年 4 月已归档，不会升级到 Wine 8 及以上"] },
        { label: "Parallels Desktop", cells: ["付费", "能，在 Windows 11 Arm 版中", "DirectX 最高 11.1；虚拟机中大多数反作弊无法运行"] },
        { label: "GeForce NOW", cells: ["有免费版和付费版", "不需要，串流支持的游戏", "需要高速网络；只能玩其目录中的游戏"] },
      ],
    },
    faq: [
      { q: "M1 Mac 能玩 Windows 版 Steam 游戏吗？", a: ["能。任何运行 macOS 14 Sonoma 或更高版本的 Apple 芯片 Mac，都可以通过 Wine 运行 Windows 版 Steam 客户端。轻量或较老的游戏在基础款芯片上表现最好；大型游戏需要更强的 GPU 和更多内存。"] },
      { q: "需要 Windows 许可证吗？", a: ["不需要。Wine 不是 Windows，你不用安装或购买 Windows。只有在 Parallels 这类虚拟机中才需要 Windows 许可证。"] },
      { q: "Steam 存档和成就能用吗？", a: ["能。你在官方 Steam 客户端中登录自己的账户，云存档、成就和游戏库都和在 PC 上一样。"] },
      { q: "DirectX 12 游戏能玩吗？", a: ["部分可以，需要 Apple 的 D3DMetal。Apple 的许可证不允许应用内置它，所以你需要自己从 Apple 下载 ", { text: "Game Porting Toolkit", href: S.gptk.href }, "，Vermut 会自动检测到。"] },
      { q: "对我的 Steam 账户安全吗？", a: ["Vermut 运行的是官方 Steam 客户端，从不接触你的密码。反作弊拒绝 Wine 的游戏会无法启动或无法联网。"] },
    ],
    sources: [S.vermut, S.gptk, S.gptkReq, S.cxStore, S.cx26, S.whiskyNotice, S.parallels, S.gfn, S.aacy, S.cxCompat],
  },

  {
    slug: "free-whisky-alternative-mac",
    label: "免费的 Mac 版 Whisky 替代品",
    metaTitle: "免费的 Whisky 替代品（Mac）：Whisky 已停止维护",
    description:
      "Whisky 已于 2025 年 4 月归档。这里整理了在 Mac 上玩 Windows 游戏的免费和付费替代方案，以及如何迁移到 Vermut。",
    h1: "适合你 Mac 的免费 Whisky 替代品",
    answer: [
      "Whisky 已于 2025 年 4 月 9 日归档，不会再升级到 Wine 8 或更高版本。如果你想要免费且仍在维护的工具，Vermut 是一款开源应用，会在 Wine 11 上为你配置好 Steam 和 Epic Games（测试版）。如果你需要最广泛的兼容性和真正的技术支持，可以选择付费的 CrossOver，这也是 Whisky 作者本人推荐的方案。",
    ],
    sections: [
      {
        id: "status",
        title: "Whisky 怎么了",
        body: [
          ["Whisky 曾是一款很受欢迎的免费 SwiftUI 应用，用来在 Apple 芯片 Mac 上使用 Wine。开发者停止了积极开发，并于 2025 年 4 月 9 日归档了 GitHub 仓库。维护公告写明，Whisky 不会升级到 Wine 8 或更高版本，也不会再为特定应用或游戏（包括 Steam）提供修复。"],
          ["现有的安装或许还能用一段时间，但不会再有任何修复，而新游戏越来越需要更新的 Wine。社区分支 ", { text: "frankea/Whisky", href: S.whiskyFork.href }, " 正在独立继续开发。"],
        ],
      },
      {
        id: "how-different",
        title: "Vermut 和 Whisky 有什么不同",
        bullets: [
          ["围绕游戏商店设计。Whisky 只给你空容器；Vermut 为每个商店创建单独的容器，安装官方 Steam 客户端，并通过 Legendary（测试版）支持 Epic Games，还有一个游戏库集中显示已安装的游戏。"],
          ["引擎够新。Vermut 下载 Wine 11，默认用 DXMT 在 Metal 上运行 DirectX 10 和 11，并提供 Wine Staging 和 Wine Devel 作为备用。"],
          ["同样可选多种图形后端：DXMT、DXVK 加 MoltenVK、WineD3D，以及在安装 Apple 的 Game Porting Toolkit 后可用的 D3DMetal。"],
          ["游戏不在支持的商店里时，可以在容器中运行任意 Windows .exe、.msi 或 .bat 文件。"],
          ["免费，MIT 许可证，无需账户，没有遥测。"],
        ],
      },
      {
        id: "move",
        title: "从 Whisky 迁移到 Vermut",
        steps: [
          { title: "记下你在玩的游戏", body: ["列出你的游戏，以及在 Whisky 中有效的设置。Steam 和 Epic 会把游戏库和云存档保存在服务器上。"] },
          { title: "备份本地存档", body: ["有些游戏只把存档放在 Whisky 容器里。在做任何改动之前先复制出来。Vermut 无法导入 Whisky 容器。"] },
          { title: "安装 Vermut", body: ["从 GitHub 下载，并按照", { text: "首次启动指南", href: FIRST_LAUNCH }, "在“隐私与安全性”中允许一次。"] },
          { title: "安装你的商店", body: ["在 Stores 页面安装 Steam，或登录 Epic Games。Vermut 会下载 Wine 并创建容器。"] },
          { title: "重新安装游戏", body: ["从商店客户端重新下载游戏，如有需要再恢复本地存档。在一切正常之前先保留 Whisky，之后再删除。"] },
        ],
      },
    ],
    compare: {
      caption: "Whisky 及其替代方案（2026 年 10 月）",
      columns: ["方案", "价格", "是否维护", "最适合"],
      rows: [
        { label: "Vermut", cells: ["免费，MIT", "是", "无需设置就想玩 Steam 和 Epic 游戏的人"] },
        { label: "Whisky", cells: ["免费，GPL-3.0", "否，2025 年 4 月已归档", "不会有新功能；仅限现有环境"] },
        { label: "Whisky 社区分支", cells: ["免费", "是，由另一位开发者维护", "想保留原有容器的 Whisky 用户"] },
        { label: "CrossOver", cells: ["74 美元含 12 个月更新；终身版 494 美元", "是，2026 年 2 月发布 CrossOver 26", "最广泛的兼容性和商业支持"] },
        { label: "Game Porting Toolkit", cells: ["从 Apple 免费下载", "是，面向开发者", "测试 DirectX 12 游戏；不是启动器"] },
      ],
    },
    after: [
      {
        id: "choose",
        title: "该选哪一个？",
        bullets: [
          ["你在 Whisky 里玩 Steam 或 Epic 游戏，想要一个免费且仍在维护的替代品：先试试 Vermut。只需几分钟，完全免费。"],
          ["你有很多不想重建的自定义容器：社区分支可以导入 Whisky 容器。它由另一个人维护，请根据它自己的更新情况来判断。"],
          ["你需要某款游戏一定能运行，或者希望出问题时有人帮忙：开始 CrossOver 的 14 天试用，如果那款游戏能玩再购买。"],
          ["你是正在测试 DirectX 12 移植的开发者：Apple 的 Game Porting Toolkit 正是为此打造的工具。"],
        ],
      },
      {
        id: "limits",
        title: "坦白说，也有局限",
        bullets: [
          [...kernelAntiCheat],
          ["Vermut 还很年轻，由一个小团队开发。没有商业支持，问题通过 GitHub Issues 处理。"],
          ["任何 Wine 前端都不会让游戏比底层的 Wine 更快。如果某款游戏在 Whisky 中因为 Wine 本身而无法运行，在认定它换个工具就能玩之前，请先测试。"],
        ],
      },
    ],
    faq: [
      { q: "Whisky 已经停更了吗？", a: ["原项目已不再维护。它的 GitHub 仓库于 2025 年 4 月 9 日归档，不会支持 Wine 8 或更高版本。另有一个由其他人维护的社区分支。"] },
      { q: "可以把 Whisky 容器导入 Vermut 吗？", a: ["不可以。Vermut 会为每个商店创建自己的容器。请备份本地存档，在 Vermut 中安装商店，再重新下载游戏。"] },
      { q: "Vermut 真的免费吗？", a: ["是的。它以 MIT 许可证开源，无需账户，没有付费版，也没有遥测。你可以查看", { text: "源代码", href: links.github }, "。"] },
      { q: "为什么 Whisky 的作者推荐 CrossOver？", a: ["CrossOver 背后的公司 CodeWeavers 承担了 Mac 版 Wine 的大部分开发工作。CrossOver 的销售收入支撑着这些工作，包括 Vermut 在内的所有免费 Mac Wine 项目都建立在这一基础之上。"] },
      { q: "Vermut 支持 Intel Mac 吗？", a: ["不支持。Vermut 需要 Apple 芯片 Mac 和 macOS 14 Sonoma 或更高版本。"] },
    ],
    sources: [S.whiskyNotice, S.whiskyRepo, S.whiskyFork, S.cxStore, S.cx26, S.gptk, S.legendary, S.vermut, S.aacy],
  },

  {
    slug: "run-windows-games-on-mac-without-crossover",
    label: "不用 CrossOver 在 Mac 上玩 Windows 游戏",
    metaTitle: "不用 CrossOver，在 Mac 上免费玩 Windows 游戏",
    description:
      "不用 CrossOver 也能在 Apple 芯片 Mac 上免费玩 Windows 游戏：用 Vermut 运行 Wine、Apple 的 Game Porting Toolkit、虚拟机和云游戏。",
    h1: "不用 CrossOver，如何在 Mac 上玩 Windows 游戏",
    answer: [
      "使用免费的 Wine 前端。Vermut 是开源应用，可以在任何 Apple 芯片 Mac 上为你配置好 Wine 11、Steam 和 Epic Games（测试版）。对于 Wine 跑不了的游戏，另一个免费选择是云游戏：游戏通过串流运行，而不是在 Mac 本地运行。CrossOver 仍然是支持最完善的付费选择。",
    ],
    sections: [
      {
        id: "what-crossover-does",
        title: "CrossOver 做了什么，替代它需要什么",
        body: [
          ["CrossOver 是 CodeWeavers 推出的商业版 Wine。74 美元包含 12 个月的更新和支持，终身许可证为 494 美元；支持期结束后，已购买的版本仍可继续使用。另有 14 天免费试用。"],
          ["不用 CrossOver，你需要三样东西：适用于 macOS 的 Wine、把 DirectX 转成 Metal 的图形层，以及能安装和启动游戏商店的工具。在终端里手动配置也可以，但维护起来很费劲。Vermut 把这三者集成到了一个应用中。"],
        ],
      },
      {
        id: "options",
        title: "免费方案",
        bullets: [
          ["Vermut，免费开源。它把 Steam 和 Epic Games（测试版）分别安装到各自的 Wine 11 容器中，DirectX 10 和 11 默认使用 DXMT，也可以切换到 DXVK、WineD3D 或 D3DMetal。"],
          ["Apple 的 Game Porting Toolkit。使用 Apple 开发者账户即可免费下载，原本是给开发者评估游戏用的。其中的 D3DMetal 能运行许多 DirectX 12 游戏，但它不是游戏启动器，应用也不允许内置它。"],
          ["云游戏，例如 GeForce NOW，提供免费版。游戏在远程 PC 上运行，所以反作弊不是问题，但需要快速稳定的网络，而且游戏必须在服务的目录中。"],
          ["Parallels Desktop 之类的虚拟机不是免费的，而且虚拟机中的 Windows Arm 版最多只支持 DirectX 11.1，大多数反作弊也会被拦截。"],
        ],
      },
      {
        id: "steps",
        title: "用 Vermut 免费玩 Windows 游戏",
        steps: [
          { title: "先查一下游戏", body: ["在 ", { text: "CodeWeavers 兼容性数据库", href: S.cxCompat.href }, " 和 ", { text: "Are We Anti-Cheat Yet?", href: S.aacy.href }, " 上查询。如果它需要内核级反作弊，请改用云游戏。"] },
          { title: "安装 Vermut", body: ["下载 DMG，把 Vermut 拖到“应用程序”，并按照", { text: "首次启动指南", href: FIRST_LAUNCH }, "允许一次。需要 Apple 芯片 Mac 和 macOS 14 或更高版本。"] },
          { title: "安装你的商店", body: ["安装 Steam 或登录 Epic Games。Vermut 会下载 Wine，需要时也会安装 Rosetta 2。"] },
          { title: "DirectX 12 游戏：加上 D3DMetal", body: ["从 Apple 下载 Game Porting Toolkit。Vermut 会检测到它，并提供 D3DMetal 作为图形后端。"] },
          { title: "不在商店里？直接运行安装程序", body: ["用 Run .exe 在容器中运行任意 Windows 安装程序。效果比商店游戏更难预料。"] },
        ],
      },
    ],
    compare: {
      caption: "不用 CrossOver 玩 Windows 游戏（2026 年 10 月）",
      columns: ["方案", "费用", "DirectX 12", "带反作弊的游戏", "上手难度"],
      rows: [
        { label: "Vermut", cells: ["免费", "配合 Apple 的 D3DMetal", "内核级：不行", "低，一个应用搞定"] },
        { label: "仅用 Game Porting Toolkit", cells: ["免费", "可以，通过 D3DMetal", "内核级：不行", "高，需要终端和手动配置"] },
        { label: "GeForce NOW", cells: ["有免费版和付费版", "可以，在远程 PC 上运行", "可以，限支持的游戏", "低，需要高速网络"] },
        { label: "Parallels Desktop", cells: ["付费，还需 Windows", "不行，最高 DirectX 11.1", "虚拟机中大多被拦截", "中"] },
        { label: "CrossOver（参考）", cells: ["74 美元含一年更新", "可以，通过 D3DMetal", "内核级：不行", "低，有商业支持"] },
      ],
    },
    after: [
      {
        id: "performance",
        title: "性能大概如何",
        body: [
          ["Wine 不模拟 PC，但 Rosetta 2 以及从 DirectX 到 Metal 的转换都会增加负担。在中端 Windows PC 上流畅运行的游戏，在基础款 M 系列芯片上可能需要调低画质。新游戏刚开始的几分钟常因编译着色器而卡顿，通常之后会稳定下来。"],
          ["如果游戏能启动但画面异常或崩溃，首先尝试切换图形后端。内存也很关键：Game Porting Toolkit 公布的配置要求建议 16 GB，大型游戏无论用哪种后端都会受益。"],
        ],
      },
      {
        id: "honest",
        title: "什么时候仍然值得买 CrossOver",
        body: [
          ["如果你离不开某一款游戏，希望出问题时有人可以联系，或者在玩 CodeWeavers 专门修复过的游戏，那么放弃之前值得试试 CrossOver。购买它也是在资助所有免费 Mac 项目都在使用的 Wine 开发工作。"],
          ["Vermut 是免费的，但项目还年轻，不保证每款游戏都能运行。它的优势在于：免费、快速地在 Mac 上试玩你的 Steam 和 Epic 游戏库。"],
        ],
      },
    ],
    faq: [
      { q: "CrossOver 有免费版吗？", a: ["没有。CrossOver 提供 14 天免费试用，之后需要购买许可证。Wine 本身是免费的，Vermut 则是基于 Wine 的免费应用。"] },
      { q: "Wine 是模拟器吗？", a: ["不是。Wine 在 macOS 上重新实现了 Windows API。在 Apple 芯片上，由 Rosetta 2 转译 x86 代码，并不会模拟一整台 PC。"] },
      { q: "可以用 Apple 的 Game Porting Toolkit 玩游戏吗？", a: ["它是开发者工具，但其中的 D3DMetal 能运行许多 DirectX 12 游戏。从 Apple 下载后，Vermut 会提供 D3DMetal 作为后端。"] },
      { q: "Boot Camp 呢？", a: ["Boot Camp 只适用于 Intel Mac。Apple 芯片 Mac 无法启动 Windows。"] },
      { q: "为什么带反作弊的游戏无法运行？", a: ["内核级反作弊需要真正的 Windows 内核，会拦截 Wine 和大多数虚拟机。在 Mac 上，只能通过云游戏来玩这类游戏。"] },
    ],
    sources: [S.cxStore, S.cxLicence, S.cx26, S.gptk, S.gptkReq, S.parallels, S.gfn, S.aacy, S.cxCompat, S.vermut],
  },
];
